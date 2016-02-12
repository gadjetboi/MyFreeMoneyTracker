mainModule.controller("resetPasswordViewModel", function ($scope, $routeParams, accountService, helperService) {

    var userId = null;
    var code = null;

    var initialize = function () {
        userId = $routeParams.userId || null;
        code = $routeParams.code || null;
    }

    $scope.resetPassword = function () {

        if (userId != null || code != null || $scope.newPassword != null || $scope.confirmNewPassword != null) {
            if ($scope.validator.validate()) {
                accountService.resetPassword(userId, code, $scope.newPassword, $scope.confirmNewPassword, function (result) {
                    if(result.status == "200")
                    {
                        helperService.notify("Your password reset successfully", "success");
                    }
                    else
                    {
                        var error = "";
                        if(result.data.ModelState['model.NewPassword'])
                        {
                            error = result.data.ModelState['model.NewPassword'][0];
                        }
                        if(result.data.ModelState['model.ConfirmNewPassword'])
                        {
                            if (error != "")
                                error = error + "<br />";

                            error = error + result.data.ModelState['model.ConfirmNewPassword'][0];
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
                });
            }
            else {
                helperService.notifyError();
            }
        }
    }

    initialize();
});
