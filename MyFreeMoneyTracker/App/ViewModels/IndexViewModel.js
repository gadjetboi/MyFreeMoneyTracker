mainModule.controller("indexViewModel", function ($scope, helperService, $location, accountService, $window) {

    accountService.getUserInfo(function (result) {

        var userInfoObj = result;

        $scope.userName = result.data.Email;
    });

    $scope.logout = function () {
        accountService.logoutUser();
        $window.location.href = helperService.baseUrl() + '/';
    }

});