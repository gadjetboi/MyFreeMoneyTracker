mainModule.factory('helperService', function ($http, $location, $window, ngNotify) {
   
    return {
       
        baseUrl: function () {
            var me = this;

            return 'http://' + $location.host() + ':1275';
            //return 'http://' + $location.host();
        },

        apiUrl: function () {
            var me = this;

            return me.baseUrl() + '/api';
            //return me.baseUrl() + + '/api';
        },

        getApi: function (url, param, headers, callback) {
            var me = this;
            var param = param || '';
            
            $http({
                method: 'GET',
                url: url + param,
                headers: headers || { 'Content-Type': 'application/json' }
            }).then(function (result) {
                callback(result);
            }, function (result) {
                callback(result);
            });
        },

        postApi: function (url, headers, data, callback) {
            var me = this;

            $http({
                method: 'POST',
                url: url,
                headers: headers || { 'Content-Type': 'application/json' },
                data: data
            }).then(function (result) {
                callback(result);
            }, function (result) {
                me.notifyError();
            });
        },

        postWithTransform: function (url, headers, data, callback) {
            var me = this;

            $http({
                method: 'POST',
                url: url,
                headers: headers || { 'Content-Type': 'application/json' },
                data: data,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
            }).then(function (result) {
                callback(result);
            }, function (result) {
                callback(result);
            });
        },

        putApi: function (url, header, data, callback) {
            var me = this;

            $http({
                method: 'PUT',
                url: url,
                data: data
            }).then(function (result) {
                callback(result);
            }, function (result) {
                me.notifyError();
            });
        },

        redirectTo: function (url) {
            $location.path(url);
        },

        openNewTab: function(url) {
            $window.open(url, '_blank');
        },

        pageSize: 5,

        notify: function(msg, type, position, duration) {
            ngNotify.set(msg, {
                        type: type || 'info',
                        duration: duration || 2000,
                        position: position || 'top',
                        theme: 'pure',
                        html: true
                    });
        },
        notifyError: function(msg, type, position, duration) {
            ngNotify.set(msg || "Oops! There is invalid data in the form.", {
                        type: type || 'error',
                        duration: duration || 2000,
                        position: position || 'top',
                        theme: 'pure',
                        html: true
            });
        }
    }
});