mainModule.controller("loginViewModel", function ($scope, helperService, $location, accountService, $window) {
    
    if (accountService.isUserLoggedIn())//TODO: Redirect before the HTML loaded.
    {
        helperService.redirectTo('/main');
    }

    $scope.loginLoading = false;
    $scope.createLoading = false;
    $scope.forgotLoading = false;
    
    $scope.login = function () {
        $scope.loginLoading = true;
        if ($scope.validator.validate()) {

            accountService.loginUser($scope.email, $scope.password, function (result) {
                if (result.status == "200") {
                    $scope.$broadcast('loggedInEvent', { isLoggedIn: true }); //TODO: Not broadcasting
                    //helperService.redirectTo('/main');

                    //TODO: Temporary
                    $window.location.href = helperService.baseUrl() + "/#/main";
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
                            $scope.$broadcast('loggedInEvent', { isLoggedIn: true }); //TODO: Not broadcasting
                            //helperService.redirectTo('/main'); //TODO: Not broadcasting

                            //TODO: Temporary
                            //Need to close the modal in login page to remove the black background.
                            $window.location.href = helperService.baseUrl() + "/#/main";
                        }
                        else {
                            helperService.notifyError(result.data.error_description);
                        }
                    });
                }
                else {
                    var error = "";
                    if(result.data.ModelState['model.Password'])
                    {
                        error = result.data.ModelState['model.Password'][0];
                    }
                    if(result.data.ModelState['model.ConfirmPassword'])
                    {
                        if (error != "")
                            error = error + "<br />";

                        error = error + result.data.ModelState['model.ConfirmPassword'][0];
                    }
                    if (result.data.ModelState[""])
                    {
                        if(result.data.ModelState[""][0])
                            error = error + result.data.ModelState[""][0];

                        if(result.data.ModelState[""][1]) {
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

    $scope.forgotPassword = function () {
        $scope.forgotLoading = true;
        if ($scope.forgotValidator.validate()) {
            accountService.emailForgotPasswordToken($scope.forgotEmail, function (result) {
                if (result.status == "200")
                {
                    helperService.notify("Reset informations were sent to your email.", "info");
                }
                else
                {
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