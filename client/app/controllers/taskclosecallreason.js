(function () {
    'use strict';

    angular.module('app.table').controller('TaskclosecallreasonCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskclosecallreasonModel', 'commonModel', TaskclosecallreasonCtrl]);

    function TaskclosecallreasonCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, taskclosecallreasonModel, commonModel) {

        var original;
        var init;
        this.taskclosecallreason = taskclosecallreasonModel.add;
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(46);

        $scope.deleteTaskclosecallreason = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.taskclosecallreason);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTaskclosecallreason, taskclosecallreasonModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.deleteMsg);
                        getAllTaskclosecallreason();
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTaskclosecallreason = function (rowData) {

            $scope.show = 2;
            $scope.taskclosecallreason = angular.copy(rowData);
            original = angular.copy($scope.taskclosecallreason);

        }

        $scope.revert = function () {
            $scope.taskclosecallreason = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.taskclosecallreason, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.taskclosecallreason, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTaskclosecallreason = function (rowData) {
            $scope.show = 2;
            $scope.taskclosecallreason = angular.copy(rowData);
            original = angular.copy($scope.taskclosecallreason);
        }

        $scope.addTaskclosecallreason = function () {
            this.taskclosecallreason = {};
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

        function getAllTaskclosecallreason() {
            var result = service.serverGet(config.urlGetTaskclosecallreason);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getAllTaskclosecallreason();
        $scope.saveTaskclosecallreason = function () {
            var obj = this.taskclosecallreason;
            obj.imagerequired = obj.imagerequired == true || obj.imagerequired == 1 ? 1 : 0;             
            var _itemname = obj.name.trim();                                                                                         
            var _item = $filter('filter')($scope.resultData, function(value){
                return (value.name.toUpperCase().trim() == _itemname.toUpperCase().trim());
            })[0];
            if(_item == undefined){          
                if (obj.id == null) {
                    var result = service.serverPost(config.urlSaveTaskclosecallreason, taskclosecallreasonModel.add, commonModel.trans, obj)
                    result.then(function (resolve) {
                        debugger;
                        if (resolve.ResponseData > 0) {
                            $scope.taskclosecallreason = {};
                            materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.saveMsg);                    
                            getAllTaskclosecallreason();
                            $scope.show = 1;
                        }
                        else {                        
                            materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.existMsg);
                        }
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
                else {
                    var result = service.serverPost(config.urlUpdateTaskclosecallreason, taskclosecallreasonModel.edit, commonModel.trans, obj)
                    result.then(function (resolve) {
                        $scope.taskclosecallreason = {};
                        materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.updateMsg);
                        getAllTaskclosecallreason();
                        $scope.show = 1;

                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
            } else {                        
                materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.existMsg);
            }
        }

        $scope.loadDropDown = function () {
            var ddlistModel = taskclosecallreasonModel.ddlist;
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
            var _keyset = appConstants.CLOSECALL_REASON_COL;
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
                                //$scope.uploadedItems = result.filter((v,i) => result.findIndex(item => item.value == v.value) === i);
                                var jsonObject = result.map(JSON.stringify);	                                                             
                               var uniqueSet = new Set(jsonObject);
                               $scope.uploadedItems = Array.from(uniqueSet).map(JSON.parse);
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
                                            var _itemname = $scope.uploadedItems[m]["Reason"];
                                            _itemname = _itemname != null ? $scope.ToCaptilize(_itemname).trim() : "";                                                                                  
                                                var _item = $filter('filter')($scope.resultData, function(value){
                                                    return (value.name.toUpperCase().trim() == _itemname.toUpperCase().trim());
                                                })[0];
                                            if(_item == undefined){ 
                                                newtarget.name = _itemname;
                                                newtarget.imagerequired = $scope.uploadedItems[m]["ImageRequired"].toLowerCase() == "true"? true:false;
                                                $scope.listalltask.push(newtarget);
                                            }
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
                            if ($scope.uploadedItems.length == 0 && $scope.listalltask == 0){
                                materials.hideSpinner();
                                alert("Excel without data...");
                            }
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
            obj.flag = "CLOSECALLREASON";
            // obj.listinputs = $scope.listalltask;
            obj.listinputs = $scope.listalltask.map(element => {
                element.imagerequired = element.imagerequired == true || element.imagerequired == 1 ? 1 : 0;
                return element;
            });
            //obj.listinputs = $scope.listalltask.map(element => element.imagerequired = element.imagerequired == true || element.imagerequired == 1 ? 1 : 0);        
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, taskclosecallreasonModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllTaskclosecallreason();
            }, function (reject) {

            });
        }
    }
})();


