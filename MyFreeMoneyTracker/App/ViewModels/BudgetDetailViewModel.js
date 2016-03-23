mainModule.controller("budgetDetailViewModel", function ($scope, $compile, $parse, $routeParams, accountService, helperService, $window) {

    if (!accountService.isUserLoggedIn())//TODO: Redirect before the HTML loaded.
    {
        $window.location.href = helperService.baseUrl() + '/';
    }

    $scope.helperService = helperService;

    var groupErrorClass = "has-error has-feedback";
    var glypiconRemoveClass = "glyphicon glyphicon-remove form-control-feedback";
    var ariaErrorMsg = "error";

    var groupSuccessClass = "has-success has-feedback";
    var glypiconOkClass = "glyphicon glyphicon-ok form-control-feedback";
    var ariaSuccessMsg = "success";
    var suffix_group = "Group";
    var suffix_icon = "Icon";
    var suffix_aria = "Aria";
    var billBoxId = "billBoxId_";

    function loadInit() {
 
        accountService.getUserInfo(function (result) {
             
            $scope.userId = result.data.UserId;

            var param = "?id=" + $scope.userId;

            $scope.showBillOptionSpin = true;
            helperService.getApi(helperService.apiUrl() + '/CustomBill', param, null, function (result) {
                $scope.customBillObjs = result.data;

                $scope.billOptions = [];

                angular.forEach($scope.customBillObjs, function (value, key) {
                    $scope.billOptions.push({
                        id: value.CustomBillId, name: value.BillName, ticked: false, websiteUrl: value.WebsiteUrl
                    });
                });

                $scope.showBillOptionSpin = false;

                loadBillDetails()
            });

            helperService.getApi(helperService.apiUrl() + '/PaymentType', param, null, function (result) {
                $scope.paymentTypes = result.data;
            });
        });
    }
    
    loadInit();

    function loadBillDetails() {
        $scope.budgetId = $routeParams.budgetId || null;

        if ($scope.budgetId) {
            var param = "/" + $scope.budgetId;
            helperService.getApi(helperService.apiUrl() + '/GetBudgetById', param, null, function (result) {

                var budgetObj = result.data;

                $scope.receivedAmount = budgetObj.ReceivedAmount;
                $scope.dateReceived = budgetObj.DateReceived; 
                
                $scope.earnings = budgetObj.Earnings;
                $scope.totalPaid = budgetObj.TotalPaid;
                $scope.remainingIncome = budgetObj.RemainingIncome;

                var billObjs = budgetObj.Bills;
                var selectedBills = [];

                for (var i = 0; i < billObjs.length; i++) {
                    var billOptionObj = searchBillById($scope.billOptions, billObjs[i].CustomBill.CustomBillId);
                    if (billOptionObj)
                    {
                        for (var x = 0; x < $scope.billOptions.length; x++) {
                            if ($scope.billOptions[x].id == billOptionObj.id) {
                                $scope.billOptions[x].ticked = true;

                                selectedBills.push({
                                    id: $scope.billOptions[x].id,
                                    name: $scope.billOptions[x].name,
                                    ticked: true,
                                    amountPaid: billObjs[i].AmountPaid || 0,
                                    paymentDate: billObjs[i].PaymentDate || null,
                                    paymentType: billObjs[i].PaymentType || 1, //1 Default for all users
                                    billStatus: (billObjs[i].BillStatus == 'Paid') ? true : false,
                                    websiteUrl: $scope.billOptions[x].websiteUrl
                                });
                            }
                        }
                    }
                }
                
                $scope.selectedBills = selectedBills;

                $scope.onBillSelected();

            });
        }
    }

    /**** METHODS ****/
    $scope.closeBill = function (id) {
        /* do your stuff here */
       //Remove Bill Options Dropdown
        for (var i = 0; i < $scope.billOptions.length; i++) {
            if ($scope.billOptions[i].id == id) {
                $scope.billOptions[i].ticked = false;
            }
        }

        //Remove Bill Box
        for (var i = 0; i < $scope.selectedBills.length; i++)
        {
            if ($scope.selectedBills[i].id == id) {
                $scope.selectedBills.splice(i, 1);

                $("#billBox").find("#" + billBoxId + id).remove();
            }
        }
        //Refresh
        //$scope.onBillSelected();
    }

    $scope.onBillSelected = function (data) {
       
        if (data && !data.ticked)
        {
            closeUnTickedBillBox(data.id);
        }

        for (var i = 0; i < $scope.selectedBills.length; i++) {

            var isBillBoxExist = document.getElementById(billBoxId + $scope.selectedBills[i].id);

            if (!isBillBoxExist)
            {
                $("#billBox").append(createBillBox($scope.selectedBills[i]));
                $parse("EstimatedAmount_" + $scope.selectedBills[i].id)
                .assign($scope, searchBillById($scope.customBillObjs, $scope.selectedBills[i].id).EstimatedAmount || 0);

                //Create New Budget State
                if (!$scope.budgetId) { 
                    $parse("AmountPaid_" + $scope.selectedBills[i].id)($scope);
                    $parse("PaymentDate_" + $scope.selectedBills[i].id)($scope);
                    $parse("PaymentType_" + $scope.selectedBills[i].id)
                        .assign($scope, 1); //1 Default for all users
                    $parse("BillStatus_" + $scope.selectedBills[i].id)
                        .assign($scope, false);
                }
                //View Details State
                else { 
                    $parse("AmountPaid_" + $scope.selectedBills[i].id)
                        .assign($scope, $scope.selectedBills[i].amountPaid || 0);
                    $parse("PaymentDate_" + $scope.selectedBills[i].id)
                        .assign($scope, $scope.selectedBills[i].paymentDate);
                    $parse("PaymentType_" + $scope.selectedBills[i].id)
                        .assign($scope, $scope.selectedBills[i].paymentType);
                    $parse("BillStatus_" + $scope.selectedBills[i].id)
                        .assign($scope, $scope.selectedBills[i].billStatus || false);
                }
            }
        }
    }

    $scope.saveBills = function () {
        
        if($scope.saveValidator.validate() && validateFields()){
            
            var billObjs = [];

            for (var i = 0; i < $scope.selectedBills.length; i++)
            {
                var paymentTypeScope = $parse("PaymentType_" + $scope.selectedBills[i].id)($scope);

                var paymentTypeId = null; //TODO: check if need to have a default value of 1

                if (typeof paymentTypeScope != "undefined") {
                    paymentTypeId = paymentTypeScope.PaymentTypeId || 1;
                }
                else {
                    paymentTypeId = paymentTypeScope || 1;
                }

                billObjs.push({
                    BillId: 0,
                    BudgetId: $scope.budgetId || 0,
                    AmountPaid: $parse("AmountPaid_" + $scope.selectedBills[i].id)($scope) || 0,
                    PaymentDate: $parse("PaymentDate_" + $scope.selectedBills[i].id)($scope) || null,
                    BillStatus: $parse("BillStatus_" + $scope.selectedBills[i].id)($scope) ? 'Paid' : 'Pending',
                    CustomBillId: $scope.selectedBills[i].id || null,
                    PaymentTypeId: paymentTypeId
                });
            }

            var budgetObj = {
                BudgetId: $scope.budgetId || 0,
                UserId: $scope.userId,
                ReceivedAmount: $scope.receivedAmount,
                DateReceived: $scope.dateReceived,
                Bills: billObjs
            }
           
            if(!$scope.budgetId) //New record
            {
                helperService.postApi(helperService.apiUrl() + '/Budget', null, budgetObj, function (result) {
                    helperService.redirectTo('/');
                });
            }
            else //Update existing record
            {
                budgetObj.BudgetId = $scope.budgetId;
                helperService.postApi(helperService.apiUrl() + '/UpdateBudget', null, budgetObj, function (result) {
                    helperService.redirectTo('/');
                });
            }

        }
        else {
            helperService.notifyError();
        }
    }

    $scope.addBill = function () {

        if ($scope.addBillValidator.validate()) {

            var newBillObj = {
                'UserId': $scope.userId,
                'BillName': $scope.billName,
                'EstimatedAmount': $scope.estimatedAmount,
                'WebsiteUrl': $scope.websiteUrl
            }

            helperService.postApi('/api/CustomBill', null, newBillObj, function (result) {
                if (result) {
                    var customBillObj = {
                        CustomBillId: result.data.CustomBillId,
                        BillName: result.data.BillName,
                        WebsiteUrl: result.data.WebsiteUrl
                    }

                    $scope.customBillObjs.push(customBillObj);

                    $scope.billOptions.push({
                        id: customBillObj.CustomBillId, name: customBillObj.BillName, ticked: false, websiteUrl: customBillObj.WebsiteUrl
                    });

                    $('#addBillModal').modal('hide');
                    $scope.billName = "";
                    $scope.estimatedAmount = "";
                    $scope.websiteUrl = "";

                    helperService.notify("New Bill Added", "success");
                }
                else {
                    helperService.notifyError("Unable to call API");
                }
            });
        }
        else {
            helperService.notifyError();
        }
    }
    
    $scope.clearField = function(fieldName) {
            $parse(fieldName).assign($scope, '');
    }

    function closeUnTickedBillBox (id) {
        $("#billBox").find("#" + billBoxId + id).remove();
    }

    function validateFields() {

        if($scope.dateReceived != null)
            return true;

        return false;
    }

    //TODO: Put on helper service
    function searchBillById(objects, id) {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].CustomBillId) {
                if (objects[i].CustomBillId == id) {
                    return objects[i];
                    break;
                }
            }
            else if (objects[i].id) {
                if (objects[i].id == id) {
                    return objects[i];
                    break;
                }
            }
            else
                return null;
        }
    }

    function createBillBox(data) {
       //move to directive
        var billBox =
            angular.element('<div id=\"' + billBoxId + data.id + '\" class=\"col-md-4\">'
                    + '<div class=\"panel panel-success\">'
                    + '    <button type=\"button\" class=\"close\" ng-click=\"closeBill(' + data.id + ')\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>'
                    + '    <div class=\"panel-heading\"><strong>' + data.name +'</strong></div> <!-- End of Panel heading -->'
                    + '    <div class=\"panel-body\">'
                    + '        <div class=\"row\">'
                    + '            <div class=\"col-md-6\">'
                    + '                <div class=\"form-group\">'
                    + '                    <label for=\"EstimatedAmount_' + data.id + '\">Est. Amount to Pay</label>'
                    + '                      <input type=\"number\" ng-model=\"EstimatedAmount_' + data.id + '"\ class=\"form-control\" \>'
                    + '                </div>'
                    + '                <div class=\"form-group\">'
                    + '                    <label for=\"paymentDate\">Payment Date</label>'
                    + '                    <p class=\"input-group\">'
                    + '                    <input width="50px" kendo-date-picker'
                    + '                            k-ng-model=\"PaymentDate_' + data.id + '\" />'
                    + '                    </p>'
                    + '                </div>'
                    + '                <div class=\"form-group\">'
                    + '                    <label for=\"PaymentType_' + data.id + '\">Payment Type</label>'
                    + '                    <select class=\"form-control\" ng-options=\"paymentType as paymentType.Name for paymentType in paymentTypes track by paymentType.PaymentTypeId\" ng-model=\"PaymentType_' + data.id + '\"></select>'
                    + '                </div>'
                    + '            </div>'
                    + '            <div class=\"col-md-6\">'
                    + '                <div class=\"form-group\">'
                    + '                    <label for=\"AmountPaid_' + data.id + '\">Amount to Pay</label>'
                    + '                      <input type=\"number\" ng-focus=\"clearField(\'AmountPaid_' + data.id + '\')\" ng-init=\"AmountPaid_' + data.id + '=0\" ng-model=\"AmountPaid_' + data.id + '"\ class=\"form-control\" \>'
                    + '                </div>'
                    + '                 <div class=\"form-group\">'
                    + '                    <label>Earned Amount</label>'
                    + '                    <h4 ng-show=\"AmountPaid_' + data.id + ' <= 0\" ng-hide=\"AmountPaid_' + data.id + ' > 0\"><span class="label label-primary">{{ 0 | currency }}</span></h4>'
                    + '                    <h4 ng-show=\"AmountPaid_' + data.id + ' > 0\" ng-hide=\"AmountPaid_' + data.id + ' <= 0\"><span class="label label-primary">{{ EstimatedAmount_' + data.id + ' - AmountPaid_' + data.id + ' | currency }}</span></h4>'
                    + '                </div>'
                    + '             <div>'
                    + '                 <switch id=\"BillStatus_' + data.id + '\" name=\"BillStatus_' + data.id + '\" ng-model=\"BillStatus_' + data.id + '\" class=\"green\"></switch>'
                    + '                 <h4 ng-show=\"BillStatus_' + data.id + ' == false\" ng-hide=\"BillStatus_' + data.id + ' == true\" ><span class="label label-danger">Pending</span></h4>'
                    + '                 <h4 ng-show=\"BillStatus_' + data.id + ' == true\" ng-hide=\"BillStatus_' + data.id + ' == false\"><span class="label label-success">Paid</span></h4>'
                    + '             </div>'
                    + '            </div>'
                    + '        </div> <!-- End of row -->'
                    + '        <div class=\"row\">'
                    + '           <div class=\"col-md-12\">'
                    + '             <div class=" pull-right">'
                    + '                 <a class="btn btn-link-1" href="" ng-click=\"helperService.openNewTab(\'' + data.websiteUrl + '\')\"><i class="fa fa-dollar"></i> Pay Now</a>'
                    + '             </div>'
                    + '           </div>'
                    + '        </div>'
                    + '    </div> <!-- End of panel body -->'
                    + '</div><!-- End of panel -->'
                + '</div>');

        $compile(billBox)($scope);

        return billBox;
    }

     $scope.validate = function (fieldName) {

        var formGroupModel = $parse(fieldName + suffix_group);
        var ariaElModel = $parse(fieldName + suffix_aria);

        if (!$scope[fieldName] || $scope[fieldName] == "" || $scope[fieldName] == null) {
            formGroupModel.assign($scope, groupErrorClass);
            ariaElModel.assign($scope, ariaErrorMsg);
        }
        else {
            formGroupModel.assign($scope, groupSuccessClass);
            ariaElModel.assign($scope, ariaSuccessMsg);
        }
     }

     $scope.dateReceivedChange = function(e) {

         var datePicker = e.sender;
         
         if (datePicker.value() != null) { //TODO: Add validation to make sure the date is valid.
             $scope.dateReceivedGroup = groupSuccessClass;
             $scope.dateReceivedAria = ariaSuccessMsg;
             //$scope.billForm.dateReceived.$valid = true;
             $scope.billForm.$valid = true;
             $scope.billForm.$invalid = false;
             
         }
         else {
             $scope.dateReceivedGroup = groupErrorClass;
             $scope.dateReceivedAria = ariaErrorMsg;
             //$scope.billForm.dateReceived.$valid = false;
             $scope.billForm.$valid = false;
             $scope.billForm.$invalid = true;
         }
     }
});