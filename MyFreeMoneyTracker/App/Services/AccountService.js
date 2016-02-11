mainModule.factory('accountService', function ($rootScope, $http, $q, $location, localStorageService, helperService) {

    var securityCookieName = 'mySecurityCookie';
    var accountCookieName = 'myAccountCookie';

    return {
        register: function (userObj, callback) {
            var url = helperService.apiUrl() + '/Account/Register';
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            
            var data = userObj;

            helperService.postWithTransform(url,headers,data, function (result) {
                callback(result);
            });
         },

        getUserInfo: function (callback) {
            var userInfoObj = localStorageService.cookie.get(accountCookieName);

            if (userInfoObj)
            {
                callback(userInfoObj);
            }
            else
            {
                var tokenObj = this.getToken();

                if(tokenObj)
                {
                    var url = helperService.apiUrl() + '/Account/UserInfo';
                    var headers = { 'Authorization': tokenObj.data.token_type + ' ' + tokenObj.data.access_token };

                    helperService.getApi(url, null, headers, function (result) {
                        localStorageService.cookie.set(accountCookieName, result);
                        callback(result);
                    });
                }
            }
        },

        getToken: function () {
            return localStorageService.cookie.get(securityCookieName);
        },

        saveToken: function (tokenObj) {
            localStorageService.cookie.set(securityCookieName, tokenObj);
        },
            
        logoutUser: function () {
            localStorageService.cookie.remove(accountCookieName);
            localStorageService.cookie.remove(securityCookieName);
        },

        loginUser: function(email, password, callback) {
            var url = helperService.baseUrl() + '/token';
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var data = { username: email, password: password, grant_type: 'password' };
            var me = this;

            helperService.postWithTransform(url, headers, data, function (result) {
                if (result.status == "200") {
                    me.saveToken(result);
                }
                callback(result);
            });
         },

        isUserLoggedIn: function() {
            var me = this;
            return me.getToken() ? true : false;
        },

        emailForgotPasswordToken: function (email, callback) {
            var param = "?email=" + email;
            var url = helperService.apiUrl() + '/Account/EmailForgotPasswordToken';

            helperService.getApi(url, param, null, function (result) {
                callback(result);
            });
        },

        resetPassword: function(userId, code, newPassword, callback) {
            var url = helperService.apiUrl() + '/Account/ResetPassword';
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var data = { userId: userId, code: code, newPassword: newPassword };

            helperService.postWithTransform(url, headers, data, function (result) {
                  callback(result);
            });
        },

        //changePassword: function(userId, oldPassword, newPassword, callback) {
        //    var url = '/api/Account/ChangePassword';
        //    var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        //    var data = { userId: userId, oldPassword: oldPassword, newPassword: newPassword };

        //    helperService.postApi(url,headers,data, function (result) {
        //        callback(result);
        //    });
        //},

        confirmEmail: function(userId, code, callback) {
            var url = helperService.apiUrl() + '/Account/ConfirmEmail';
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var data = { userId: userId, code: code };

            helperService.postWithTransform(url, headers, data, function (result) {
                callback(result);
            });
        },

        isEmailExist: function (email, callback) {
            var url = helperService.apiUrl() +  '/Account/IsEmailExist';
            var param = "?email=" + email;

            helperService.getApi(url, param, null, function (result) {
                callback(result);
            });
        },

        generatePassword: function (length) {
            var lowerChar = "abcdefghijklmnopqrstuvwxyz";
            var upperChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var specialChar = "z!@#$%^&*()-+<>";
            var numberChar = "1234567890";
            var pass = "";
            var i = "";
            for (var x = 0; x < length; x++) {
                if (x < 2) {
                    i = Math.floor(Math.random() * lowerChar.length);
                    pass += lowerChar.charAt(i);
                }
                else if (x < 4) {
                    i = Math.floor(Math.random() * upperChar.length);
                    pass += upperChar.charAt(i);
                }
                else if (x < 5) {
                    i = Math.floor(Math.random() * specialChar.length);
                    pass += specialChar.charAt(i);
                }
                else if (x < 6) {
                    i = Math.floor(Math.random() * numberChar.length);
                    pass += numberChar.charAt(i);
                }
                else if (x >= 6) {
                    i = Math.floor(Math.random() * numberChar.length);
                    pass += lowerChar.charAt(i);
                }
            }
            return pass;
        }
    }
});