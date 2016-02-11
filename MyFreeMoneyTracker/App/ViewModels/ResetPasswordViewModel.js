mainModule.controller("resetPasswordViewModel", function ($scope, $routeParams, accountService, helperService) {

    var userId = null;
    var code = null;

    var initialize = function () {
        userId = $routeParams.userId || null;
        code = $routeParams.code || null;
    }

    $scope.resetPassword = function () {

        if (userId != null || code != null || $scope.password != null) {
            if ($scope.validator.validate()) {
                accountService.resetPassword(userId, code, $scope.password, function () {
                    helperService.notify("Your password reset successfully", "success");
                });
            }
            else {
                helperService.notifyError();
            }
        }
    }

    initialize();
});
