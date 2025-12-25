(function () {
    'use strict';

    angular
     .module('app.table')
     .service('LoginService', LoginService);

    LoginService.$inject = ['$http', '$q', 'AuthenticationService', 'authData', '$window', 'config', '$rootScope', '$sessionStorage'];

    function LoginService($http, $q, authenticationService, authData, $window, config, $rootScope, $sessionStorage) {
        
        var userInfo;
        var loginServiceURL = config.oAuthentication;
        var deviceInfo = [];
        var deferred;

        this.login = function (userName, password) {
            debugger;
            deferred = $q.defer();
            delete $http.defaults.headers.common['X-Requested-With'];
            delete $http.defaults.headers.common['Authorization'];
            var data = "grant_type=password&username=" + userName + "&password=" + password;
            $http.post(loginServiceURL, data, {
                headers:
                   { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (response) {
                debugger;
                if (response != undefined) {
                    if (response.access_token != undefined) {
                        console.log("*Authorization*");
                       
                        if (response.usertypeid == 1 || response.usertypeid == 2) {
                            console.log(response);
                            var o = response;
                            userInfo = {
                                accessToken: response.access_token,
                                userName: response.username,
                                loginId: response.id
                            };
                            authenticationService.setTokenInfo(userInfo);
                            authData.authenticationData.IsAuthenticated = true;
                            authData.authenticationData.Username = response.username;
                            authData.authenticationData.loginId = response.id;
                            authData.authenticationData.usertypeid = response.usertypeid;
                            authData.authenticationData.userid = response.userid;
                            authData.authenticationData.ispasswordchanged = response.ispasswordchanged;

                            authData.authenticationData.rolecode = response.rolecode;
                            authData.authenticationData.roleid = response.roleid;
                            authData.authenticationData.clientid = response.clientid;
                            authData.authenticationData.userstatusid = response.userstatusid;
                            authData.authenticationData.usertypecode = response.usertypecode;
                            
                            deferred.resolve(authData);
                        }
                        else {
                            console.log(response);
                            authData.authenticationData.IsAuthenticated = false;
                            authData.authenticationData.Username = "";
                            authData.authenticationData.loginId = "";
                            authData.authenticationData.sessionId = "";
                            authData.authenticationData.usertypeid = response.usertypeid;
                            authData.authenticationData.userid = "";
                            authData.authenticationData.ispasswordchanged = "1";
                            authData.authenticationData.userstatusid = "";
                            authData.authenticationData.rolecode = "";
                            authData.authenticationData.roleid = "";
                            authData.authenticationData.clientid = "";
                            authData.authenticationData.usertypecode = "";
                            deferred.resolve(response);
                        }
                    }
                    else {
                        if (response.error_uri != undefined) {
                            if (response.error_uri == "401") {
                                // alert(response.error_description);
                                console.log(response);
                                authData.authenticationData.IsAuthenticated = false;
                                authData.authenticationData.Username = "";
                                authData.authenticationData.loginId = "";
                                authData.authenticationData.sessionId = "";
                                authData.authenticationData.usertypeid = "";
                                authData.authenticationData.userid = "";
                                authData.authenticationData.ispasswordchanged = "1";
                                authData.authenticationData.userstatusid = "";
                                authData.authenticationData.rolecode = "";
                                authData.authenticationData.roleid = "";
                                authData.authenticationData.clientid = "";
                                authData.authenticationData.usertypecode = "";
                                deferred.resolve(response);
                            }
                        }
                    }
                }

            })
            .error(function (err, status) {

                console.log(err);
                authData.authenticationData.IsAuthenticated = false;
                authData.authenticationData.Username = "";
                authData.authenticationData.loginId = "";
                authData.authenticationData.sessionId = "";
                authData.authenticationData.usertypeid = "";
                authData.authenticationData.userid = "";
                authData.authenticationData.ispasswordchanged = "1";
                authData.authenticationData.userstatusid = "";
                authData.authenticationData.rolecode = "";
                authData.authenticationData.roleid = "";
                authData.authenticationData.clientid = "";
                authData.authenticationData.usertypecode = "";
                deferred.resolve(err);
            });
            return deferred.promise;
        }

        this.logOut = function () {

            Notification.clearAll()
            authenticationService.removeToken();
            authData.authenticationData.IsAuthenticated = false;
            authData.authenticationData.Username = "";
            authData.authenticationData.loginId = "";
            authData.authenticationData.usertypeid = "";
            authData.authenticationData.userid = "";
            authData.authenticationData.ispasswordchanged = "1";
            authData.authenticationData.userstatusid = "";
            authData.authenticationData.rolecode = "";
            authData.authenticationData.roleid = "";
            authData.authenticationData.clientid = "";
            authData.authenticationData.usertypecode = "";
        }
    }
})();