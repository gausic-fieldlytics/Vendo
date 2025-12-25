(function () {
    'use strict';

    angular.module('app.table')
        .controller('TaskpoolCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskpoolModel', 'commonModel', '$element', '$uibModal', TaskpoolCtrl]);
   // .controller('taskexcelCtrl', ['$q', '$scope', '$uibModalInstance','$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', taskexcelCtrl]);
        function TaskpoolCtrl($q,$rootScope, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, taskpoolModel, commonModel, $element, $uibModal) {
		var selectedId = 0;
        var original;
        var init;
        this.taskpool = taskpoolModel.add;

        $scope.deleteTaskpool = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.taskpool);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTaskpool, taskpoolModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.taskpool + ' ' + appConstants.deleteMsg);
                        getAllTaskpool(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTaskpool = function (rowData) {

            $scope.show = 2;
            $scope.taskpool = angular.copy(rowData);
            original = angular.copy($scope.taskpool);

        }

        $scope.revert = function () {
            $scope.taskpool = angular.copy(original);
			$scope.taskpool = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.taskpool, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.taskpool, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTaskpool = function (rowData) {
            $scope.show = 2;            
			$scope.taskpool  = angular.copy(rowData);
            original = angular.copy($scope.taskpool );
        }

        $scope.addTaskpool = function () {
            this.taskpool = "";
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

        function getAllTaskpool(selectedId) {
            			var obj = {};
            obj.taskstatusid = selectedId;
            var result = service.serverPost(config.urlGetTaskpool, taskpoolModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveTaskpool = function () {
            var obj = this.taskpool;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveTaskpool, taskpoolModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    
                    materials.displayToast(appConstants.successClass, appConstants.taskpool + ' ' + appConstants.saveMsg);
					$scope.taskpool = {};
                    getAllTaskpool(selectedId);

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.status = 1;
                var result = service.serverPost(config.urlUpdateTaskpool, taskpoolModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    getAllTaskpool(selectedId);
                    $scope.show = 1;

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }
		
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
           
            var ddlistModel = taskpoolModel.ddlist;

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

      //  getAllTaskpool(0);

		$scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column) {
            var key = 'list' + column;
            var keyname = column == "user" ? "firstname" : column;
            var results = query ? $scope[key].filter(createFilter(query, keyname)) : $scope[key], deferred;
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


        $scope.animationsEnabled = true;
       

        //$scope.toggleAnimation = function () {
        //    $scope.animationsEnabled = !$scope.animationsEnabled;
        //};


        function getdate(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            
            return year + '-' + month + '-' + day;
        }

        function handleFile(e) {
            debugger;
            
            //var result = service.filePost(config.urlSaveFile, e.target.files)
            //result.then(function (resolve) {
            //    debugger;
            //}
            //, function (reject) {
            //    alert("File Upload Error");
            //});

            var _keyset = appConstants.TASK_POOL_SAMPLE_EL_COL;
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
                                var newproject = true;
                                var part = {};
                                var newtask = {};
                                var newtarget = {};
                                for (var m = 0; m < $scope.uploadedItems.length; m++) {
                                   


                                    if ($scope.uploadedItems[m]["Project"] != undefined && $scope.uploadedItems[m]["Project"] != "") {
                                        if (part.projecttitle == null) {
                                            part.projecttitle = $scope.uploadedItems[m]["Project"];
                                            part.projectdesc = $scope.uploadedItems[m]["Project description"];
                                            part.listtask = [];
                                        }
                                        else {
                                            if (part.projecttitle != $scope.uploadedItems[m]["Project"]) {

                                                $scope.listalltask.push(part);
                                                part = {};
                                                newtask = {};
                                                newtarget = {};

                                                part.projecttitle = $scope.uploadedItems[m]["Project"];
                                                part.projectdesc = $scope.uploadedItems[m]["Project description"];
                                                part.listtask = [];
                                            }
                                        }
                                    }
                                    
                                    if ($scope.uploadedItems[m]["Task"] != undefined && $scope.uploadedItems[m]["Task"] != "") {

                                        if (newtask.tasktitle == null) {
                                            newtask.tasktitle = $scope.uploadedItems[m]["Task"];
                                            newtask.taskdescription = $scope.uploadedItems[m]["Task description"];
                                            newtask.startdate = $scope.uploadedItems[m]["Start date"] != null ? getdate( new Date($scope.uploadedItems[m]["Start date"])) : null;
                                            newtask.enddate = $scope.uploadedItems[m]["End date"] != null ?getdate( new Date($scope.uploadedItems[m]["End date"])) : null;
                                            newtask.remarks = $scope.uploadedItems[m]["Remarks"];
                                            newtask.listtarget = [];

                                        }
                                        else {
                                            if (newtask.tasktitle != $scope.uploadedItems[m]["Task"]) {

                                                part.listtask.push(newtask);
                                                newtask = {};


                                                newtask.tasktitle = $scope.uploadedItems[m]["Task"];
                                                newtask.taskdescription = $scope.uploadedItems[m]["Task description"];
                                                newtask.startdate = $scope.uploadedItems[m]["Start date"] != null ?getdate( new Date($scope.uploadedItems[m]["Start date"])) : null;
                                                newtask.enddate = $scope.uploadedItems[m]["End date"] != null ?getdate( new Date($scope.uploadedItems[m]["End date"])) : null;
                                                newtask.remarks = $scope.uploadedItems[m]["Remarks"];
                                                newtask.listtarget = [];
                                            }
                                        }

                                    }
                                    newtarget.targetname = $scope.uploadedItems[m]["Target"];
                                    newtarget.state = $scope.uploadedItems[m]["State"];
                                    newtarget.city = $scope.uploadedItems[m]["City"];
                                    newtarget.area = $scope.uploadedItems[m]["Area"];
                                    newtarget.street = $scope.uploadedItems[m]["Street"];
                                    newtarget.address = $scope.uploadedItems[m]["Address"];
                                    newtarget.landmark = $scope.uploadedItems[m]["Land Mark"];
                                    newtarget.phoneno = $scope.uploadedItems[m]["Contact"];
                                    newtarget.distributor = $scope.uploadedItems[m]["Distributor"];
                                    newtarget.districontact = $scope.uploadedItems[m]["Distributor Contact"];

                                    newtask.listtarget.push(newtarget);
                                    newtarget = {};

                                }


                                if ($scope.uploadedItems.length > 0 && part.projecttitle != null) {
                                    if (newtask.tasktitle != null) {
                                        part.listtask.push(newtask);
                                    }
                                    $scope.listalltask.push(part);
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
                        if (count == incount) {
                            $scope.open('lg');

                        }
                        count++;
                    });
                    $scope.$apply();

                };
                reader.readAsArrayBuffer(f);
            }
        }
        $scope.listalltask = [];
        $scope.open = function (size) {
            debugger;


            var obj = {};
            obj.user = $scope.listuser;
            obj.task = $scope.listalltask;
          



            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'taskexcellist.html',
                controller: 'taskexcelCtrl',
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

        $(document).ready(function () {

            $('#files').change(handleFile);
        });

    }

    //    function taskexcelCtrl($q,$scope, $uibModalInstance,$filter, items, config, appConstants, service, materials, commonModel) {
    //        debugger;
    //        $scope.listalltask = [];
    //        $scope.listuser = [];
    //        $scope.listuser = items.user;
    //        $scope.listalltask = items.task;
    //        $scope.publishdate = new Date();

    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss("cancel");
    //    };

    //    var addobj = {
    //        "createdby": "createdby",
    //        "clientid": "clientid",
    //        "publishdate": "publishdate",
    //        "listinputs": [{
    //            "projecttitle": "projecttitle",
    //            "projectdesc": "projectdesc",
    //            "listtask":"listtask"
    //            //"listtask": [{
    //            //    "tasktitle": "tasktitle",
    //            //    "taskdescription": "taskdescription",
    //            //    "startdate": "startdate",
    //            //    "enddate": "enddate",
    //            //    "remarks": "remarks",
    //            //    "target": "target"
    //            //}]
    //        }]
    //    };
    //    function getdate(dat) {

    //        var year = dat.getFullYear();
    //        var month = (1 + dat.getMonth()).toString();
    //        month = month.length > 1 ? month : '0' + month;
    //        var day = dat.getDate().toString();
    //        day = day.length > 1 ? day : '0' + day;

    //        return year + '-' + month + '-' + day;
    //    }
        
    //    $scope.ok = function () {
    //        debugger;
    //        //  materials.showSpinner();
    //        var obj = {};
    //        obj.clientid = $scope.selecteditem != undefined ? $scope.selecteditem.id : null;
    //        obj.publishdate = getdate(new Date($scope.publishdate));
    //        obj.createdby = sessionStorage.userid;
    //        var tempArray = [];
    //        for (var i = 0; i < $scope.listalltask.length; i++) {

    //            var res = {};
    //            res.projecttitle = $scope.listalltask[i].projecttitle;
    //            res.projectdesc = $scope.listalltask[i].projectdesc;
    //            //for (var j = 0; j < $scope.listalltask[i].listtask.length; j++) {
    //            //    $scope.listalltask[i].listtask[j].listtarget = JSON.stringify($scope.listalltask[i].listtask[j].listtarget);
    //            //}
    //            res.listtask = JSON.stringify($scope.listalltask[i].listtask);
    //            tempArray.push(res);
    //        }
    //        obj.listinputs = tempArray;
    //        var result = service.serverPost(config.url_bulktarget, addobj, "", obj)
    //        result.then(function (resolve) {
    //            debugger;
    //            materials.hideSpinner();
    //            $uibModalInstance.dismiss("cancel");
    //        }, function (reject) {
    //            alert('Not Resolved')
    //        });
    //    }

    //    $scope.simulateQuery = false;
    //    $scope.isDisabled = false;
    //    $scope.querySearch = querySearch;
    //    $scope.selectedItemChange = selectedItemChange;

    //    function querySearch(query, column) {
    //        var key = 'list' + column;
    //        var keyname = column == "user" ? "firstname" : column;
    //        var results = query ? $scope[key].filter(createFilter(query, keyname)) : $scope[key], deferred;
    //        if ($scope.simulateQuery) {
    //            deferred = $q.defer();
    //            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
    //            return deferred.promise;
    //        } else {
    //            return results;
    //        }
    //    }

    //    function selectedItemChange(item, column) {
    //        selectedId = item.id;
    //        eval('getAll' + column + '(' + item.id + ')');
    //    }

    //    function createFilter(query, name) {
    //        var lowercaseQuery = angular.lowercase(query);
    //        return function filterFn(obj) {
    //            return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
    //        };
    //    }

    //}
})();


