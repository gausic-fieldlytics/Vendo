(function () {
    'use strict';

    angular.module('app.table').controller('DepartmentCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'departmentModel', DepartmentCtrl]);

    function DepartmentCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, departmentModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.department = departmentModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(4);

        $scope.deleteDepartment = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.department);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteDepartment, departmentModel.delete, departmentModel.trans,commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.deleteMsg);
                        getAllDepartment(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editDepartment = function (rowData) {

            $scope.show = 2;
            $scope.department = angular.copy(rowData);
            original = angular.copy($scope.department);

        }

        $scope.revert = function () {
            $scope.department = angular.copy(original);
			$scope.department = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.department, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.department, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewDepartment = function (rowData) {
            $scope.show = 2;            
			$scope.department  = angular.copy(rowData);
            original = angular.copy($scope.department );
        }

        $scope.addDepartment = function () {
            this.department = "";
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
        $scope.numPerPageOpt = [50, 200, 500, 1000];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllDepartment(selectedId) {
            var result = service.serverGet(config.urlGetDepartment);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveDepartment = function () {
            
            var obj = this.department;
            obj.status = 1;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveDepartment, departmentModel.add,  "", obj)
                result.then(function (resolve) {
                    
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.saveMsg);
                        $scope.department = {};
                        getAllDepartment(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.existMsg);
                    }

                  

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                
                var result = service.serverPost(config.urlUpdateDepartment, departmentModel.edit, "", obj)
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.updateMsg);
                        getAllDepartment(selectedId);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.existMsg);
                    }

                   

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }
		
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
           
            var ddlistModel = departmentModel.ddlist;

            for (var key in ddlistModel) {
               
                var obj = {};
                var valParam = {};
                var keyParam = null;

                valParam = ddlistModel[key].split('~');
                //Only for selection changed
                if (varId != '' && valParam[1] != varId) {
                    continue;
                }
                //End
                if (valParam.length > 1) {
                    keyParam = valParam[0];
                    obj['u_' + valParam[1]] = id;
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    $scope['list' + resolve.input] = resolve.ResponseData;
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(0, '');
	 
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        getAllDepartment(0);

		$scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column) {
            var key = 'list' + column;
            var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(item, column) {
			selectedId = item.id;
            eval('getAll' + column + '(' + item.id + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

        function handleFile(e) {
            debugger;
            $scope.isvalid = false;
            var _keyset = appConstants.DEPARTMENT_COL;
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
                                    newtarget.departmentname = $scope.uploadedItems[m]["Department"];
                                    newtarget.departmentcode = $scope.uploadedItems[m]["Code"];

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
                        }
                        count++;
                    });
                    $scope.$apply();

                };
                reader.readAsArrayBuffer(f);
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
            obj.flag = "DEPT";
            obj.listinputs = $scope.listalltask;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, departmentModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.department + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllDepartment(0);
            }, function (reject) {

            });
        }

    }
})();


