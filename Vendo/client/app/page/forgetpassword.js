(function () {
    'use strict';

    angular.module('app.table').controller('forgetpassordCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$mdDialog','$location', 'config', 'appConstants', 'service', 'materials',  'commonModel', forgetpassordCtrl]);

    function forgetpassordCtrl($q, $rootScope, $scope, $http, $filter, $mdDialog, $location, config, appConstants, service, materials, commonModel) {

        // alert("Success");
        $scope.forgetpaasord = {};
        $scope.issentotp = false;
        $scope.userlogin = {};

        $scope.canSubmit = function (from) {
            return from.$valid;
        }

        $scope.hidepassword = "password";
        $scope.ispasswordview = true;

        $scope.changepasswordtype = function (status) {
            $scope.hidepassword = "text";
            $scope.ispasswordview = false;
        }
        $scope.changetypepassword = function (status) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
        }

        $scope.sentotp = function () {
            debugger;
            materials.showSpinner();
            var obj = $scope.forgetpaasord;
            var forgetobj = {
                u_username: obj.username,
                u_isagent: "0"
            }
            var result = $http.post(config.serviceUrl + config.urlforgetpassword, forgetobj);
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                var res = resolve.data;
                if (res.ResponseData > 0) {
                    $scope.issentotp = true;
                   // $location.url('/page/signin');
                    materials.displayToast(appConstants.successClass, appConstants.otpMsg);
                }
                else {
                    materials.displayToast(appConstants.warningClass, "Invalid Username");
                }
            }, function (reject) {
                materials.hideSpinner();
                if (reject.statusText === 'Unauthorized') {
                    alert(reject.data.ResponseMessage);
                    $scope.signin = "";
                }
                else {
                    console.log(reject.data.ResponseMessage);
                }
            });
        }
        

        $scope.updatepassword = function () {
            debugger;

            if ($scope.userlogin.password == $scope.userlogin.confirmpassword) {
                materials.showSpinner();

                var forgetobj = {
                    u_username: $scope.forgetpaasord.username,
                    u_password: $scope.userlogin.password,
                    u_otp: $scope.userlogin.otp,
                    u_isagent: "0"
                }
                var result = $http.post(config.serviceUrl + config.urlchangepassword, forgetobj);
                result.then(function (resolve) {
                    debugger;
                    materials.hideSpinner();
                    var res = resolve.data;
                    if (res.ResponseData > 0) {
                        // 
                        materials.displayToast(appConstants.successClass, "Password " + appConstants.updateMsg);
                        $location.url('/page/signin');
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.otpErrorMsg);
                    }
                }, function (reject) {
                    materials.hideSpinner();
                    if (reject.statusText === 'Unauthorized') {
                        alert(reject.data.ResponseMessage);
                        $scope.signin = "";
                    }
                    else {
                        console.log(reject.data.ResponseMessage);
                    }
                });
            }
            else {
                materials.displayToast(appConstants.warningClass, appConstants.passmitxhMsg);
            }
        }
      
       }
})();