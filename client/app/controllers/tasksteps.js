(function () {
    'use strict';

    angular.module('app.table').controller('TaskstepsCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskstepsModel', 'commonModel', TaskstepsCtrl]);

    function TaskstepsCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, taskstepsModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        $scope.selectsteptxt = "";
        this.tasksteps = taskstepsModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(25);

        $scope.listalltask = [];
        $scope.deleteTasksteps = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.tasksteps);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTasksteps, taskstepsModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.deleteMsg);
                        getAllTasksteps(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTasksteps = function (rowData) {

            $scope.show = 2;
            $scope.tasksteps = angular.copy(rowData);
            original = angular.copy($scope.tasksteps);

        }

        $scope.revert = function () {
            $scope.tasksteps = angular.copy(original);
			$scope.tasksteps = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.tasksteps, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.tasksteps, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTasksteps = function (rowData) {
            $scope.show = 2;
            $scope.tasksteps = angular.copy(rowData);

            $scope.projectid = rowData.projectid;
            $scope.taskid = rowData.taskid;

            $scope.loadtask(rowData.projectid);
            getAllTasksteps( rowData.taskid);
           
           
            original = angular.copy($scope.tasksteps);
        }

        $scope.addTasksteps = function () {
            $scope.projectid = null;
            $scope.taskid = null;
            $scope.tasksteptypeids = [];
            $scope.tasksteps = {};
            $scope.tasksteps.liststep = [];
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

        function loadgridtask(projectid) {
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGetTaskstepsgrid, taskstepsModel.searchall, "", obj)
            result.then(function (resolve) {
                $scope.listalltask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
       

        function loadgrid(clientid) {
            var obj = {};
            obj.clientid = clientid;
            var result = service.serverPost(config.urlGetTaskstepsprojectgrid, taskstepsModel.searchall_grid, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadgrid(0);

        $scope.expandSelected = function (row) {
            debugger;
            $scope.listalltarget = [];
            $scope.currentPageresultData.forEach(function (val) {
                val.expanded = false;
            })
            debugger;
            row.expanded = true;
            loadgridtask(row.projectid);
        }


        $scope.Gettaskstepbytypeid = function(tasksteptypeid) {
            var obj = {};
            obj.tasksteptypeid = tasksteptypeid.join(",");
            materials.showSpinner();
            $scope.selectsteptxt = $scope.tasksteptypeids != null ? $scope.tasksteptypeids.length + " Taskstep type selected" : "";
            // $scope.listtasksteptype.ResponseData.forEach(function (selectedItem,index) {
            //     if(tasksteptypeid)                                      
            //         $scope.listtasksteptype.splice(index, 1);                              
            // });
            if(tasksteptypeid.length == 0)
                tasksteptypeid.push(0);   
            if($scope.tasksteps.liststep == undefined)
                $scope.tasksteps.liststep= [];
            for(var i = $scope.tasksteps.liststep.length-1; i >=0 ;i--) {             
                if($scope.tasksteps.liststep[i].tasksteptypeid != 0 && $scope.tasksteps.liststep[i].tasksteptypeid != undefined){
                    var q = tasksteptypeid.filter(res => res == $scope.tasksteps.liststep[i].tasksteptypeid);
                    if(q.length == 0)
                        $scope.tasksteps.liststep.splice(i,1)
                }         
            }       
            $scope.tasksteptypeids = $scope.tasksteptypeids[0] == 0 ? []:tasksteptypeid;       
            var result = service.serverPost(config.urlGetTasksteptypedetailById, taskstepsModel.searchtasksteptype, "", obj)
            result.then(function (resolve) {
                resolve.ResponseData.forEach(function (selectedItem) {
                    var ar = $filter('filter')($scope.tasksteps.liststep, function (value) {
                        return value.step.toLowerCase().trim() == selectedItem.step.toLowerCase().trim(); 
                    });
                    if(ar.length == 0)               
                        $scope.tasksteps.liststep.push(selectedItem);
                });                                                
                materials.hideSpinner();                
            }, function (reject) {
                materials.hideSpinner();
            });
        }

        function getAllTasksteps( taskid) {
            debugger;
            var obj = {};
            obj.id = taskid;
            $scope.tasksteps.liststep = [];
            materials.showSpinner();
            var result = service.serverPost(config.urlGetTasksteps, taskstepsModel.searchbyid, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                $scope.tasksteps.liststep = resolve.ResponseData;
                $scope.tasksteptypeids = [...new Set($scope.tasksteps.liststep.map(x => x.tasksteptypeid))];
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        
        $scope.taskstepsDelete = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.tasksteps);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTasksteps, taskstepsModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.deleteMsg);
                        getAllTasksteps(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };
        
        $scope.removeimgField = function (list,idx) {         
             if (idx !== -1) {
                $scope.tasksteps.liststep.splice(idx, 1); 
            }       
        }
        
        $scope.loadtasksteps = function (taskid) {
            getAllTasksteps(taskid)
        }

        $scope.childParam_step = function (form) {
            return form.$valid;
        }
        $scope.addtaskstepsField = function (list) {
            debugger;
            if(list == undefined)
                $scope.tasksteps.liststep= [];
            var obj = {};
            $scope.tasksteps.liststep.push(obj);
        }

        $scope.rmtaskstepsField = function (list) {
            list.splice(list.length - 1, 1);
        }
        $scope.savesteps = function (docData) {
            debugger;
            var listinputs = [];
            var obj = {};
            obj.taskid = $scope.taskid;

            obj.listinputs = [];
            var lststepid = [];
            var resultStepData = $scope.tasksteps.liststep;

            for (var i = 0; i < resultStepData.length; i++) {
                var newparam = {};
                newparam.id = null;

                if (resultStepData[i].id != undefined && resultStepData[i].id != null) {
                    lststepid.push(resultStepData[i].id);
                    newparam.id = resultStepData[i].id;
                }
                    
                newparam.tasksteptypeid = (resultStepData[i].tasksteptypeid == undefined && resultStepData[i].tasksteptypeid == null)? 0 : resultStepData[i].tasksteptypeid;                    
                newparam.step = resultStepData[i].step;
                newparam.taskid = $scope.taskid;
                newparam.sequence = resultStepData[i].sequence;
               
                newparam.createdby = sessionStorage.userid;
                listinputs.push(newparam);
            }

            obj.listinputs = listinputs;
            obj.lststepid = lststepid.join(",");
            materials.showSpinner();
            var result = service.serverPost(config.urlSaveTasksteps, taskstepsModel.add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                loadgrid(0);
                $scope.addTasksteps();
            }, function (reject) {
                alert('Not Resolved')
            });

        }

        

        $scope.loadtask = function (projectid) {
            debugger;
            $scope.tasksteps.liststep = [];
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGettaskDD, taskstepsModel.searchall_task, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listtask = resolve.ResponseData;
                
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }
        $scope.loadDropDown = function (id, varId) {
            debugger;
            var ddlistModel = taskstepsModel.ddlist;

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
                    for (var i = 0; i < valParam.length; i++) {
                        obj['u_' + valParam[i]] = i == 1 ? id : 0;
                    }
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    debugger;
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

    }
})();


