mainModule.controller("loginViewModel", function ($scope, $rootScope, helperService, $location, accountService, $window, $uibModal) {
    
    if (accountService.isUserLoggedIn())//TODO: Redirect before the HTML loaded.
    {
        helperService.redirectTo('/main');
    }

    $scope.loginLoading = false;
    
    $scope.login = function () {
        $scope.loginLoading = true;
        if ($scope.validator.validate()) {

            accountService.loginUser($scope.email, $scope.password, function (result) {
                if (result.status == "200") {
                    $window.location.reload(true);
                }
                else {
                    helperService.notifyError(result.data.error_description);
                }
                 $scope.loginLoading = false;
            });
        }
        else {
            helperService.notifyError();
             $scope.loginLoading = false;
        }
    }

    $scope.openModal = function(controller, templateId) {
        $uibModal.open({
            animation: true,
            controller: controller,
            templateUrl: templateId,
            size: 'md'
        });
    }
});

mainModule.controller("forgotPasswordViewModel", function ($scope, $rootScope, $uibModalInstance, helperService, accountService) {
    $scope.forgotLoading = false;

    $scope.close = function () {
        $uibModalInstance.close();
    }

    $scope.forgotPassword = function () {
        $scope.forgotLoading = true;
        if ($scope.forgotValidator.validate()) {
            accountService.emailForgotPasswordToken($scope.forgotEmail, function (result) {
                if (result.status == "200") {
                    helperService.notify("Reset informations were sent to your email.", "info");
                }
                else {
                    helperService.notify("Provided email is not exist.", "error");
                }
                $scope.forgotLoading = false;
            });
        }
        else {
            helperService.notifyError();
            $scope.forgotLoading = false;
        }
    }
});

mainModule.controller("registrationViewModel", function ($scope, $rootScope, $uibModalInstance, helperService, $location, accountService, $window) {
    $scope.createLoading = false;

    $scope.close = function () {
        $uibModalInstance.close();
    }

    $scope.register = function () {

        $scope.createLoading = true;
        if ($scope.registerValidator.validate()) {

            var userObj = {
                email: $scope.regEmail,
                password: $scope.regPassword,
                confirmPassword: $scope.regConfirmPassword
            };

            accountService.register(userObj, function (result) {
                if (result.status == "200") {
                    accountService.loginUser(userObj.email, userObj.password, function (result) {
                        if (result.status == "200") {
                            $window.location.reload(true);
                        }
                        else {
                            helperService.notifyError(result.data.error_description);
                        }
                    });
                }
                else {
                    var error = "";
                    if (result.data.ModelState['model.Password']) {
                        error = result.data.ModelState['model.Password'][0];
                    }
                    if (result.data.ModelState['model.ConfirmPassword']) {
                        if (error != "")
                            error = error + "<br />";

                        error = error + result.data.ModelState['model.ConfirmPassword'][0];
                    }
                    if (result.data.ModelState[""]) {
                        if (result.data.ModelState[""][0])
                            error = error + result.data.ModelState[""][0];

                        if (result.data.ModelState[""][1]) {
                            if (error != "")
                                error = error + "<br />";

                            error = error + result.data.ModelState[""][1];
                        }
                    }

                    helperService.notifyError(error);
                }
                $scope.createLoading = false;
            });
        }
        else {
            helperService.notifyError();
            $scope.createLoading = false;
        }
    }
});