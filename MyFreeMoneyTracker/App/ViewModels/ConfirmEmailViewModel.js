mainModule.controller("confirmEmailViewModel", function ($scope, $routeParams, accountService, helperService) {

    var userId = null;
    var code = null;

    var initialize = function () {
        userId = $routeParams.userId || null;
        code = $routeParams.code || null;

        if(userId != null || code != null)
        {
            accountService.confirmEmail(userId, code, function (result) {
                if(result.status == "200")
                {
                    helperService.notify("Thank you for confirming your email address", "success", null, 5000);
                }
                else
                {
                    helperService.notifyError();
                }
            });
        }
        else
        {
            helperService.notifyError();
        }
    }

    initialize();
});
