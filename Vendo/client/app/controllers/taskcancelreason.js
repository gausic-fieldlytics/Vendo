(function () {
    'use strict';

    angular.module('app.table').controller('TaskcancelreasonCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskcancelreasonModel', 'commonModel', TaskcancelreasonCtrl]);

    function TaskcancelreasonCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, taskcancelreasonModel, commonModel) {

        var original;
        var init;
        this.taskcancelreason = taskcancelreasonModel.add;
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(46);

        $scope.deleteTaskcancelreason = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.taskcancelreason);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    u_Id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTaskcancelreason, taskcancelreasonModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.taskcancelreason + ' ' + appConstants.deleteMsg);
                        getAllTaskcancelreason();
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTaskcancelreason = function (rowData) {

            $scope.show = 2;
            $scope.taskcancelreason = angular.copy(rowData);
            original = angular.copy($scope.taskcancelreason);

        }

        $scope.revert = function () {
            $scope.taskcancelreason = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.taskcancelreason, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.taskcancelreason, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTaskcancelreason = function (rowData) {
            $scope.show = 2;
            $scope.taskcancelreason = angular.copy(rowData);
            original = angular.copy($scope.taskcancelreason);
        }

        $scope.addTaskcancelreason = function () {
            this.taskcancelreason = {};
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

        function getAllTaskcancelreason() {
            var result = service.serverGet(config.urlGetTaskcancelreason);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getAllTaskcancelreason();
        $scope.saveTaskcancelreason = function () {
            var obj = this.taskcancelreason;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveTaskcancelreason, taskcancelreasonModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    debugger;
                    $scope.taskcancelreason = {};
                    materials.displayToast(appConstants.successClass, appConstants.taskcancelreason + ' ' + appConstants.saveMsg);
                    getAllTaskcancelreason();

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                var result = service.serverPost(config.urlUpdateTaskcancelreason, taskcancelreasonModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    $scope.taskcancelreason = {};
                    materials.displayToast(appConstants.successClass, appConstants.taskcancelreason + ' ' + appConstants.updateMsg);
                    getAllTaskcancelreason();
                    $scope.show = 1;

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }

        $scope.loadDropDown = function () {
            var ddlistModel = taskcancelreasonModel.ddlist;
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

        function handleFile(e) {
            debugger;
            $scope.isvalid = false;
            var _keyset = appConstants.CANCEL_REASON_COL;
            var _keysetcount = _keyset.length;
            var columncount = 0;
            var count = 1;
            var incount = 0;
            $scope.listalltask = [];
            $scope.uploadedItems = [];
            //Get the files from Upload control
            var files = e.target.files;
            var i, f;
            //Loop through files

            if (files.length > 0) {
                var extension = e.target.files[0].name.split(".");
                if (extension[extension.length - 1] == "xlsx") {
                    for (i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var result;
                            var workbook = XLSX.read(data, { type: 'binary' });
                            incount = workbook.SheetNames.length;
                            var sheet_name_list = workbook.SheetNames;
                            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                                //Convert the cell value to Json
                                debugger;
                                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                //   var roa = workbook.Sheets[y];
                                result = [];
                                if (roa.length > 0) {
                                    result = roa;
                                }
                                columncount = 0;
                                $scope.uploadedItems = result;
                                if ($scope.uploadedItems.length > 0) {

                                    $scope.listalltask = [];

                                    for (var key in $scope.uploadedItems[0]) {
                                        var keyname = key;
                                        var k = key.toLowerCase();
                                        k = k.replace(/ +/g, "")
                                        if (_keyset.indexOf(k) != -1) {
                                            columncount = columncount + 1;
                                        }
                                    }

                                    if (_keysetcount == columncount) {
                                        $scope.isvalid = true;
                                        var part = {};
                                        var newtask = {};
                                        var newtarget = {};
                                        for (var m = 0; m < $scope.uploadedItems.length; m++) {

                                            var newtarget = {};
                                            newtarget.taskcancelreasonname = $scope.uploadedItems[m]["Reason"];

                                            $scope.listalltask.push(newtarget);
                                        }
                                    }
                                    else {
                                        $scope.uploadedItems = [];
                                        document.getElementById("files").value = "";
                                        alert("Excel Format does not Match...");
                                    }
                                }
                                else {
                                }
                                if (count == incount && $scope.isvalid) {
                                    $('#openpopup').click();
                                    //  $scope.open('lg');
                                }
                                count++;
                            });
                            $scope.$apply();

                        };
                        reader.readAsArrayBuffer(f);
                    }
                }
                else {

                    $scope.uploadedItems = [];
                    document.getElementById("files").value = "";
                    alert("Invalid Excel Format...");
                }
            }


            
        }

        $(document).ready(function () {
            $('#files').change(handleFile);
        });

        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }

        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.savebulkitem = function () {
            debugger;
            var obj = {};
            obj.flag = "CANCELREASON";
            obj.listinputs = $scope.listalltask;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, taskcancelreasonModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.taskcancelreason + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllTaskcancelreason();
            }, function (reject) {

            });
        }
    }
})();


