(function () {
    'use strict';

    angular
      .module('app.table')
      .service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$window', 'config', '$q', '$sessionStorage', '$location'];

    function AuthenticationService($http, $window, config, $q, $sessionStorage, $location) {
        var tokenInfo;

        this.setTokenInfo = function (data) {
            
            tokenInfo = data;
            $sessionStorage.put("TokenInfo", JSON.stringify(tokenInfo));
            this.setHeader();
        }

        this.getTokenInfo = function () {
            var tokenInfo = ($sessionStorage.get("TokenInfo") != null && $sessionStorage.get("TokenInfo") != undefined ? JSON.parse($sessionStorage.get("TokenInfo")) : null);

            if (tokenInfo == null){
                var location = sessionStorage.from_location;
                $location.url(location);
            }
            else
                tokenInfo.sessionId = ($sessionStorage.get("sessionId") == undefined || $sessionStorage.get("sessionId") == null) ? null : $sessionStorage.get("sessionId");

            return tokenInfo;
        }

        this.removeToken = function () {
            tokenInfo = null;

            delete $http.defaults.headers.common['X-Requested-With'];
            delete $http.defaults.headers.common['Authorization'];
            delete $sessionStorage.TokenInfo;
        }

        this.init = function () {

            if ($sessionStorage.get("TokenInfo") !== undefined) {
                tokenInfo = JSON.parse($sessionStorage.get("TokenInfo"));
                this.setHeader();
            }
        }

        this.setHeader = function () {
            delete $http.defaults.headers.common['X-Requested-With'];
            if ((tokenInfo != undefined) && (tokenInfo.accessToken != undefined) && (tokenInfo.accessToken != null) && (tokenInfo.accessToken != "")) {
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenInfo.accessToken;
            }
        }

        this.init();
    }
})();