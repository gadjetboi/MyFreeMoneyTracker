mainModule.controller("mainViewModel", function ($scope, helperService, $filter, accountService, $location, $window) {
    
    if (!accountService.isUserLoggedIn())//TODO: Redirect before the HTML loaded.
    {
        $window.location.href = helperService.baseUrl() + '/';
    }

    $scope.helperService = helperService;

    accountService.getUserInfo(function (result) {

        $scope.userId = result.data.UserId;

        var param = "?id=" + $scope.userId;

        setupBudgetGridOptions(param);
    });

    function setupBudgetGridOptions(param) {
        $scope.budgetGridOptions = {
            dataSource: {
                transport: {
                    read: {
                        url: helperService.apiUrl() + '/Budget' + param,
                        dataType: "json"
                    }
                },
                schema: {
                    model: {
                        fields: {
                            DateReceived: { type: "date" },
                            TotalPaid: { type: "number" }
                        }
                    }
                },
                pageSize: helperService.pageSize
            },
            sortable: true,
            pageable: true,
            filterable: true,
            scrollable: false,
            mobile: true,
            height: "250px",
            columns: [{
                field: "",
                title: "Actions",
                template: function (dataItem) {
                    return '<a href=\"#/detail/' + dataItem.BudgetId + '\">View</a>'
                }
            }, {
                field: "DateReceived",
                format: "{0:MMM dd, yyyy}",
                parseFormats: "{0:MM/dd/yyyy}",
                title: "Date Received",
                filterable: {
                    ui: function (element) {
                        element.kendoDatePicker({
                            format: "MMM dd, yyyy"
                        });
                    }
                }
            }, {
                field: "TotalPaid",
                format: "{0:c}",
                title: "Total Paid"
            }]
        };
    }
});