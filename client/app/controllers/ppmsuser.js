(function () {
    'use strict';

    angular.module('app.table').controller('ppmsuserCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'ppmsuserModel', 'commonModel', ppmsuserCtrl]);

    function ppmsuserCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, ppmsuserModel, commonModel) {

        var original;
        var init;
        this.ppmsuser = ppmsuserModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(20);


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

        $scope.deletePpmsuser = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.ppmsuser);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeletePpmsuser, ppmsuserModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.ppmsuser + ' ' + appConstants.deleteMsg);
                        getAllPpmsuser('0');
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editPpmsuser = function (rowData) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
            //$scope.show = 2;
            //$scope.ppmsuser = angular.copy(rowData);
            //original = angular.copy($scope.ppmsuser);
            $scope.contact = {};
            $scope.ppmsuser = {};
            getuserdetail(rowData.id);

        }

        function getuserdetail(userid) {
            debugger
            var obj = {};
            obj.id = userid;
            obj.userid = userid;
            var result = service.serverPost(config.urlGetUserById, ppmsuserModel.searchbyid, "", obj)
            result.then(function (resolve) {
                var oResult = resolve.ResponseData;
                $scope.ppmsuser = angular.copy(oResult);
                original = angular.copy($scope.user);
              
                $scope.contact = oResult.contact;
                $scope.ppmsuser.username = oResult.login.username;
                $scope.ppmsuser.password = oResult.login.password;
               // $scope.ppmsuser = oResult.login;
              
                $scope.show = 2;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.revert = function () {
            $scope.ppmsuser = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.ppmsuser, original) && !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.ppmsuser, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewPpmsuser = function (rowData) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
            $scope.show = 2;
            $scope.ppmsuser = angular.copy(rowData);
            original = angular.copy($scope.ppmsuser);
        }

        $scope.addPpmsuser = function () {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
            this.ppmsuser = {};
            this.contact = {};            
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

        function getAllPpmsuser(selectedId) {
            debugger
            var obj = {};
            obj.id = selectedId;
            //var result = service.serverGet(config.urlGetPpmsuser);
            var result = service.serverPost(config.urlGetPpmsuser, ppmsuserModel.searchall, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.savePpmsuser = function () {
            var obj = $scope.ppmsuser;
            debugger;

            obj.contactno = $scope.contact.mobileno;
            obj.email = $scope.contact.email;
            obj.username = $scope.ppmsuser.username;

            var con = [];
            var login = [];
            var lstInputs = [];
            con.push($scope.contact);

            $scope.ppmsuser.islocked = $scope.ppmsuser.islocked == true || $scope.ppmsuser.islocked == 1 ? 1 : 0;
            $scope.ppmsuser.createdby = sessionStorage.userid;
            login.push($scope.ppmsuser)

            var newobj = {};
            newobj.contact = con;
            newobj.login = login;
            lstInputs.push(newobj);

            obj.lstInputs = lstInputs;
            //obj.createdat = new Date();
            obj.createdby = sessionStorage.userid;
            //obj.modifiedat = new Date();
            obj.modifiedby = sessionStorage.userid;
            obj.status = 1;
            //obj.islocked = obj.islocked == true || obj.islocked == 1 ? 1 : 0;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSavePpmsuser, ppmsuserModel.add, "", obj)
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseData > 0) {
                        $scope.addPpmsuser();
                        materials.displayToast(appConstants.successClass, appConstants.ppmsuser + ' ' + appConstants.saveMsg);
                        getAllPpmsuser('0');
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }
                    

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                var result = service.serverPost(config.urlUpdatePpmsuser, ppmsuserModel.edit, "", obj)
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {
                        $scope.addPpmsuser();
                        materials.displayToast(appConstants.successClass, appConstants.ppmsuser + ' ' + appConstants.updateMsg);
                        getAllPpmsuser('0');
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }
                   

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }

        function geterrormgs(ResponseData) {
            var msg = appConstants.agencyname;
            switch (ResponseData) {
                case -2:
                    msg = appConstants.firstname;
                    break;
                case -3:
                    msg = appConstants.mobile;
                    break;
                case -4:
                    msg = appConstants.email;
                    break;
                case -5:
                    msg = appConstants.username;
                    break;
            }
            return msg;
        }

        $scope.loadDropDown = function () {

            var ddlistModel = ppmsuserModel.ddlist;
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

        getAllPpmsuser('0');
    }
})();


