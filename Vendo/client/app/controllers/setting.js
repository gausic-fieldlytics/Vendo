(function () {
    'use strict';

    angular.module('app.table').controller('SettingCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'settingModel', 'commonModel', SettingCtrl]);

    function SettingCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, settingModel, commonModel) {

        var original;
        var init;
        this.setting = settingModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(38);
        $scope.emailsetting = {};


        $scope.deleteSetting = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.setting);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    u_Id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteSetting, settingModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.setting + ' ' + appConstants.deleteMsg);
                        getAllSetting();
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editSetting = function (rowData) {
            debugger;
            $scope.show = 2;
            if (rowData == null) {
                rowData = {};
            }
            if ($scope.emailsetting != null) {
           
                rowData.emailsettingid = $scope.emailsetting.id;
                rowData.mailusername = $scope.emailsetting.mailusername != undefined ? $scope.emailsetting.mailusername : null;
                rowData.mailpwd = $scope.emailsetting.mailpwd != undefined ? $scope.emailsetting.mailpwd : null;
                rowData.host = $scope.emailsetting.host != undefined ? $scope.emailsetting.host : null;
                rowData.port = $scope.emailsetting.port != undefined ? $scope.emailsetting.port : null;
                rowData.issslenabled = $scope.emailsetting.issslenabled == true || $scope.emailsetting.issslenabled == 1 ? true : false;
            }
            
            $scope.setting = angular.copy(rowData);
            original = angular.copy($scope.setting);
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

        $scope.revert = function () {
            $scope.setting = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.setting, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.setting, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewSetting = function (rowData) {
            $scope.show = 2;            
			$scope.setting  = angular.copy(rowData);
            original = angular.copy($scope.setting );
        }

        $scope.addSetting = function () {
            $scope.setting = {};
        }

        $scope.resultData = [];
        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageresultData = $scope.filteredresultData.slice(start, end);
        };

        function onFilterChange() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        function onNumPerPageChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function onOrderChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function search() {
            $scope.filteredresultData = $filter('filter')($scope.resultData, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        function order(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredresultData = $filter('orderBy')($scope.resultData, rowName);
            return $scope.onOrderChange();
        };

        $scope.resultData = [];
        $scope.searchKeywords = '';
        $scope.filteredresultData = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllSetting() {
            var result = service.serverGet(config.urlGetSetting);
            result.then(function (resolve) {
                
                //$scope.resultData = resolve.ResponseData;
                //init();
                $scope.editSetting(resolve.ResponseData);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
       

        function getemailSetting() {
            debugger;
            var result = service.serverGet(config.urlGetAllEmailsetting);
            result.then(function (resolve) {
                debugger;
                $scope.emailsetting = resolve.ResponseData.length > 0 ? resolve.ResponseData[0] : {};
                getAllSetting();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getemailSetting();


        $scope.saveSetting = function () {
            debugger;
            var obj = $scope.setting;

            var email_obj = $scope.emailsetting;

            obj.otp_sms = obj.otp_sms == true || obj.otp_sms == 1 ? 1 : 0;
            obj.otp_mail = obj.otp_mail == true || obj.otp_mail == 1 ? 1 : 0;
            obj.otp_notification = obj.otp_notification == true || obj.otp_notification == 1 ? 1 : 0;
            obj.regconfirm_sms = obj.regconfirm_sms == true || obj.regconfirm_sms == 1 ? 1 : 0;
            obj.regconfirm_mail = obj.regconfirm_mail == true || obj.regconfirm_mail == 1 ? 1 : 0;
            obj.regconfirm_notifiction = obj.regconfirm_notifiction == true || obj.regconfirm_notifiction == 1 ? 1 : 0;
            obj.reject_sms = obj.reject_sms == true || obj.reject_sms == 1 ? 1 : 0;
            obj.reject_mail = obj.reject_mail == true || obj.reject_mail == 1 ? 1 : 0;
            obj.reject_notification = obj.reject_notification == true || obj.reject_notification == 1 ? 1 : 0;
            obj.paid_sms = obj.paid_sms == true || obj.paid_sms == 1 ? 1 : 0;
            obj.paid_mail = obj.paid_mail == true || obj.paid_mail == 1 ? 1 : 0;
            obj.paid_notification = obj.paid_notification == true || obj.paid_notification == 1 ? 1 : 0;

            obj.forpwd_sms = obj.forpwd_sms == true || obj.forpwd_sms == 1 ? 1 : 0;
            obj.forpwd_mail = obj.forpwd_mail == true || obj.forpwd_mail == 1 ? 1 : 0;
            obj.forpwd_notification = obj.forpwd_notification == true || obj.forpwd_notification == 1 ? 1 : 0;

            obj.aud_ap_sms = obj.au_ap_sms == true || obj.au_ap_sms == 1 ? 1 : 0;
            obj.aud_ap_mail = obj.au_ap_mail == true || obj.au_ap_mail == 1 ? 1 : 0;
            obj.aud_ap_notification = obj.au_ap_notification == true || obj.au_ap_notification == 1 ? 1 : 0;
            obj.aud_ap_msg = obj.au_ap_msg != undefined ? obj.au_ap_msg : null;

            obj.aud_re_sms = obj.au_re_sms == true || obj.au_re_sms == 1 ? 1 : 0;
            obj.aud_re_mail = obj.au_re_mail == true || obj.au_re_mail == 1 ? 1 : 0;
            obj.aud_re_notification = obj.au_re_notification == true || obj.au_re_notification == 1 ? 1 : 0;
            obj.aud_re_msg = obj.au_re_msg != undefined ? obj.au_re_msg : null;

            obj.emailsettingid = obj.emailsettingid;
            obj.mailusername = obj.mailusername != undefined ? obj.mailusername : null;
            obj.mailpwd = obj.mailpwd != undefined ? obj.mailpwd : null;
            obj.host = obj.host != undefined ? obj.host : null;
            obj.port = obj.port != undefined ? obj.port : null;
            obj.issslenabled = obj.issslenabled == true || obj.issslenabled == 1 ? 1 : 0;
            materials.showSpinner();
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveSetting, settingModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    debugger;
                    materials.hideSpinner();
                    $scope.setting = {};
                    materials.displayToast(appConstants.successClass, appConstants.setting + ' ' + appConstants.saveMsg);
                    getAllSetting();

                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
            }
            else {
                var result = service.serverPost(config.urlUpdateSetting, settingModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                   $scope.setting={};
                   materials.displayToast(appConstants.successClass, appConstants.setting + ' ' + appConstants.updateMsg);
                   getemailSetting();
                  //  getAllSetting();
                  //  $scope.show = 1;

                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
            }
        }

		$scope.loadDropDown = function () {
            var ddlistModel = settingModel.ddlist;
            for (var key in ddlistModel) {
                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, ddlistModel[key]), ddlistModel[key]);
                result.then(function (resolve) {
                    $scope['list' + ddlistModel[resolve.input]] = resolve.ResponseData;
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown();
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        
    }
})();


