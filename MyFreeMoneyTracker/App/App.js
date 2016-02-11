var mainModule = angular.module('mainModule', ['ngRoute', 'isteven-multi-select', 'ui.bootstrap', 'smart-table', 'kendo.directives', 'uiSwitch', 'LocalStorageModule', 'ngNotify']);

//var hostName = "/wifebudgetsystem"; //use in local hosting.
var hostName = '';

mainModule.config(function ($routeProvider) {
    $routeProvider.when('/resetPassword/:userId/:code*', { templateUrl: '/App/Views/ResetPasswordView.html', controller: 'resetPasswordViewModel' });
    $routeProvider.when('/confirmEmail/:userId/:code*', { templateUrl: '/App/Views/ConfirmEmailView.html', controller: 'confirmEmailViewModel' });
    $routeProvider.when('/main', { templateUrl: hostName + '/App/Views/MainView.html', controller: 'mainViewModel' });
    $routeProvider.when('/detail/:budgetId', { templateUrl: hostName + '/App/Views/BudgetDetailView.html', controller: 'budgetDetailViewModel' });
    $routeProvider.when('/detail', { templateUrl: hostName + '/App/Views/BudgetDetailView.html', controller: 'budgetDetailViewModel' });
    $routeProvider.when('/', { templateUrl: hostName + '/App/Views/LoginView.html', controller: 'loginViewModel' });
    $routeProvider.otherwise({ redirectTo: '/' });
});



