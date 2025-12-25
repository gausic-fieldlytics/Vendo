(function () {
    'use strict';

    angular.module('app.table').controller('RoleCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'roleModel', 'commonModel', RoleCtrl]);

    function RoleCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, roleModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.role = roleModel.add;
        $scope.listallpages = [];
       
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(5);

        $scope.deleteRole = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.role);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteRole, roleModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.deleteMsg);
                        getAllRole(selectedId);
                    }
                    else {
                        var _cons = resolve.ResponseData == -1 ? appConstants.user : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, appConstants.role).replace(/#REFNAME#/g, _cons);
                        materials.displayToast(appConstants.warningClass, msg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editRole = function (rowData) {
            debugger;
            $scope.listpages = angular.copy($scope.listallpages);
            $scope.role = angular.copy(rowData);
            original = angular.copy($scope.role);
            getpermission(rowData.id);
        }

        function getpermission(roleid) {
            debugger;
            var obj = {};
            obj.roleid = roleid;
            materials.showSpinner();
            var result = service.serverPost(config.url_Getrolepagepermission, roleModel.searchall_permission, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                var data = resolve.ResponseData;

                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < $scope.listpages.length; j++) {
                        if ($scope.listpages[j].id == data[i].pageid) {
                            $scope.listpages[j].isshow = true;
                            $scope.listpages[j].addshow = data[i].addshow;
                            $scope.listpages[j].editshow = data[i].editshow;
                            $scope.listpages[j].deleteshow = data[i].deleteshow;
                        }
                    }
                }
                $scope.show = 2;
                
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }


        $scope.revert = function () {
            $scope.role = angular.copy(original);
			$scope.role = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.role, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid;// && !angular.equals($scope.role, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewRole = function (rowData) {
            $scope.show = 2;            
			$scope.role  = angular.copy(rowData);
            original = angular.copy($scope.role );
        }

        $scope.addRole = function () {
            $scope.role = {};
            $scope.role.homeshow = false;
            $scope.role.lookupshow = false;
            $scope.role.mastershow = false;
            $scope.role.projectshow = false;
            $scope.role.agencyshow = false;
            $scope.role.auditshow = false;
            $scope.role.settingshow = false;
            $scope.role.reportshow = false;
            $scope.listpages = angular.copy($scope.listallpages);
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

        function getAllRole(selectedId) {
            materials.showSpinner();
            var result = service.serverGet(config.urlGetRole);
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.saveRole = function () {
            debugger;
            var lstinputs = [];
            materials.showSpinner();
            var obj = this.role;
            
            obj.status = 1;
            obj.homeshow = obj.homeshow == true || obj.homeshow == 1 ? 1 : 0;
            obj.lookupshow = obj.lookupshow == true || obj.lookupshow == 1 ? 1 : 0;
            obj.mastershow = obj.mastershow == true || obj.mastershow == 1 ? 1 : 0;
            obj.projectshow = obj.projectshow == true || obj.projectshow == 1 ? 1 : 0;
            obj.agencyshow = obj.agencyshow == true || obj.agencyshow == 1 ? 1 : 0;
            obj.auditshow = obj.auditshow == true || obj.auditshow == 1 ? 1 : 0;
            obj.settingshow = obj.settingshow == true || obj.settingshow == 1 ? 1 : 0;
            obj.reportshow = obj.reportshow == true || obj.reportshow == 1 ? 1 : 0;

            var listdata = materials.groupBy($scope.listpages, "headerid");

            if (obj.lookupshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 2) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                            
                        }
                    }
                }
            }
            if (obj.mastershow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 3) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            if (obj.projectshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 4) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            if (obj.agencyshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 5) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            if (obj.auditshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 6) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            if (obj.settingshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 7) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            if (obj.reportshow) {
                for (var i = 0; i < listdata.length; i++) {
                    if (listdata[i][0].headerid == 8) {
                        for (var j = 0; j < listdata[i].length; j++) {
                            if (listdata[i][j].isshow) {
                                var newobj = {};
                                newobj.headerid = listdata[i][j].headerid;
                                newobj.pageid = listdata[i][j].id;
                                newobj.addshow = listdata[i][j].addshow == true ? 1 : 0;
                                newobj.editshow = listdata[i][j].editshow == true ? 1 : 0;
                                newobj.deleteshow = listdata[i][j].deleteshow == true ? 1 : 0;
                                lstinputs.push(newobj);
                            }
                        }
                    }
                }
            }
            

            obj.listinputs = lstinputs;

            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveRole, roleModel.add, commonModel.statusmaster, obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.saveMsg);
                        $scope.role = {};
                        getAllRole(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.status = 1;
                var result = service.serverPost(config.urlUpdateRole, roleModel.edit, commonModel.statusmaster, obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.updateMsg);
                        getAllRole(selectedId);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
            }
        }
		
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
           
            var ddlistModel = roleModel.ddlist;

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
                    $scope.listallpages = resolve.ResponseData;
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

        getAllRole(0);

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
            var _keyset = appConstants.ROLE_COL;
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
                                    newtarget.roletype = $scope.uploadedItems[m]["Role"];
                                    newtarget.rolecode = $scope.uploadedItems[m]["Code"];

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
            obj.flag = "ROLE";
            obj.listinputs = $scope.listalltask;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, roleModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.role + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllRole(selectedId);
            }, function (reject) {

            });
        }

        

    }
})();


