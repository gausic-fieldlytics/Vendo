(function () {
    'use strict';

    angular.module('app.page')
    .controller('authCtrl', ['$q', '$http', '$scope', '$rootScope', '$window', '$location', 'LoginService', '$mdDialog', 'config', 'service', 'appConstants', 'materials', '$sessionStorage', '$element', '$uibModal', authCtrl])

     .controller('changepwdCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', changepwdCtrl]);

    function authCtrl($q, $http, $scope, $rootScope, $window, $location, LoginService, $mdDialog, config,service, appConstants, materials, $sessionStorage, $element, $uibModal) {
        var locationPath = document.referrer;;
        //Signin

        
        $scope.signin = {
            'username': '',
            'password': ''
        };

        $scope.logoImage = "locker.png";



        $scope.login = function () {
            debugger;
            $scope.showSpinner = true;
            var obj = $scope.signin;
            LoginService.login(obj.username, obj.password)
            .then(function (response, status) {
                debugger;
                $scope.showSpinner = false;
                if (response == null || response.error != undefined) {
                    alert(response.error);
                }
                else {
                    if (response.authenticationData == undefined) {
                        alert("Login Failed");
                    }
                    else {
                        debugger;
                        delete sessionStorage.UserId;
                        delete sessionStorage.UserName;
                        delete sessionStorage.role;
                        delete sessionStorage.activeHeader;
                        delete sessionStorage.activeHeadername;
                        sessionStorage.removeItem("HeaderMenus")
                        delete sessionStorage.HeaderMenus;
                        localStorage.clear();
                        sessionStorage.removeItem("_HeaderMenus");
                        $sessionStorage.put('HeaderMenus', []);
                        $rootScope.$emit('empty_header', {  });

                        if (response.authenticationData.usertypeid == 1 || response.authenticationData.usertypeid == 2) {
                            sessionStorage.activeHeader = 0;
                            sessionStorage.activeHeadername = "Dashboard";
                            sessionStorage.userid = response.authenticationData.userid;
                            sessionStorage.loginid = response.authenticationData.loginId;
                            sessionStorage.UserName = response.authenticationData.Username;
                            sessionStorage.usertypeid = response.authenticationData.usertypeid;
                            sessionStorage.usertypecode = response.authenticationData.usertypecode;
                            sessionStorage.userstatusid = response.authenticationData.userstatusid;
                            sessionStorage.roleid = response.authenticationData.roleid;
                            if (sessionStorage.userstatusid != "3") {
                                $rootScope.$emit('show_profile', {});
                            }
                           

                            var menuname = '/page/mainhome';
                            var loadpage = true;
                            if (response.authenticationData.usertypeid == 2 && response.authenticationData.userstatusid != 3) {
                                menuname = '/page/profile';
                                if (response.authenticationData.ispasswordchanged == "0") {
                                    loadpage = false;
                                    $location.url('/page/signup');
                                 //   $scope.open('md');
                                }
                            }
                            if (loadpage) {
                                if (response.authenticationData.roleid != null &&response.authenticationData.roleid!= "") {
                                    getuserpermission(response.authenticationData.roleid, menuname)
                                }
                                else {
                                    $location.url(menuname);
                                }
                            }
                        }
                        else {
                            alert("Login Failed");
                            $location.url('/page/signin');
                        }
                    }
                }
            });
        }

        var userpermission = {
            "id": "id"
        };

        function getuserpermission(usertypeid, menuname) {
            debugger;
            var obj = {};
            obj.id = usertypeid;
            var result = service.serverPost(config.urlGetRoleById, userpermission, "", obj)
            result.then(function (resolve) {
                if (resolve != null) {
                    sessionStorage.userpermission = JSON.stringify(resolve.ResponseData);
                    $location.url(menuname);
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $rootScope.$on('agencylogin', function (event, args) {
            debugger;
            $scope.signin = args;
            $scope.login();
        });

        $rootScope.$on('pwdupdate', function (event, args) {
            debugger;
            $location.url('/page/profile');
        });

        $scope.open = function (size) {
            debugger;
            var obj = {};
           // obj.task = $scope.listtask;
         //   obj.target = $scope.listalltask;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'changepwd.html',
                controller: 'changepwdCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (ex) {
                debugger;
            });
        };

        $scope.cancel = function () {
            $location.url('/page/signin');
        };

        var addobj = {
            "loginid": "loginid",
            "password": "password",
        };


        $scope.ok = function () {
            debugger;
            $scope.issamepwd = false;
            $scope.isoldsamepwd = false;
            if ($scope.user.password == $scope.user.confirmpassword) {

                var obj = {};
                obj.loginid = sessionStorage.loginid;
                obj.password = $scope.user.password;

                materials.showSpinner();
                var result = service.serverPost(config.url_pwdupdate, addobj, "", obj)
                result.then(function (resolve) {
                    debugger; materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, "Password" + ' ' + appConstants.updateMsg);
                        $location.url('/page/profile');
                        //$rootScope.$emit("pwdupdate", null);
                        //$uibModalInstance.dismiss("cancel");
                    }
                    else {
                        $scope.isoldsamepwd = true;
                    }

                }, function (reject) {

                });

            }
            else {
                $scope.issamepwd = true;
            }


        }


        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };
    }


    function changepwdCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        debugger;
        
        $scope.user = {};
        $scope.issamepwd = false;
        $scope.isoldsamepwd = false;
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

        var addobj = {
             "loginid": "loginid",
             "password": "password",
        };
        

        $scope.ok = function () {
            debugger;
            $scope.issamepwd = false;
            $scope.isoldsamepwd = false;
            if ($scope.user.password == $scope.user.confirmpassword) {

                var obj = {};
                obj.loginid = sessionStorage.loginid;
                obj.password = $scope.user.password;

                materials.showSpinner();
                var result = service.serverPost(config.url_pwdupdate, addobj, "", obj)
                result.then(function (resolve) {
                    debugger; materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, "Password" + ' ' + appConstants.updateMsg);
                        
                        $rootScope.$emit("pwdupdate", null);
                        $uibModalInstance.dismiss("cancel");
                    }
                    else {
                        $scope.isoldsamepwd = true;
                    }
                   
                }, function (reject) {

                });

            }
            else {
                $scope.issamepwd = true;
            }
           
           
        }


        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

     

    }


})();




