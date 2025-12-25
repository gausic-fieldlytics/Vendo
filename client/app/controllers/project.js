(function () {
    'use strict';

    angular.module('app.table')
        .controller('ProjectCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'projectModel', 'commonModel', ProjectCtrl]);

    function ProjectCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, projectModel, commonModel) {

        var selectedId = 0;
        var original = {};
        var init;
       // $scope.ddlclient = null;
        $scope.isclientselect = false;
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(23);
        $scope.ddlprojectid;

        this.project = projectModel.add;
        var clientid = 0, statusid = 0;
        $scope.grid = {};
        $scope.grid.fdate = null;
        $scope.grid.tdate = null;

        $scope.ddlprojectstatusid = 0;

        $scope.addCommas = function (x) {
            debugger;
            switch (x) {
                case "POV":
                    var parts = $scope.project.pov != undefined ? $scope.project.pov.toString().replace(/,/g, '') : null;
                    parts = parts != null ? parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
                    $scope.project.pov = parts;
                    break;
                case "REV":
                    var parts = $scope.project.revenue != undefined ? $scope.project.revenue.toString().replace(/,/g, '') : null;
                    parts = parts != null ? parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
                    $scope.project.revenue = parts;
                    break;
                case "COST":
                    var parts = $scope.project.cost != undefined ? $scope.project.cost.toString().replace(/,/g, '') : null;
                    parts = parts != null ? parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
                    $scope.project.cost = parts;
                    break;
            }
        }
       
        $scope.deleteProject = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.project);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteProject, projectModel.delete,  commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.deleteMsg);
                        getAllProject(clientid, statusid);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.cancelProject = function (obj) {

            var confirm = materials.cancelConfirm(appConstants.project);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id,
                    userid: sessionStorage.userid
                };
                var result = service.serverDelete(config.urlDeleteProject, projectModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.deleteMsg);
                        getAllProject(clientid, statusid);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editProject = function (rowData) {
            debugger;
            $scope.show = 2;
            $scope.isclientselect = false;
            $scope.searchclienttxt = rowData.companyname;
            $scope.project = angular.copy(rowData);
            $scope.project.startdate = new Date(rowData.startdate);
            $scope.project.enddate = new Date(rowData.enddate);
            $scope.addCommas('POV');
            $scope.addCommas('REV');
            $scope.addCommas('COST');

            $scope.project.listitem = [];
            var _client = $.grep($scope.listclient, function (obj) {
                return obj.id == rowData.clientid;
            })[0];
            getalltaskitem(rowData.id);
            $scope.project.ddlclient = _client;
            original = angular.copy($scope.project);

        }

        function getalltaskitem(projectid) {
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGetAllTaskitem, projectModel.item_searchall, "", obj)
            result.then(function (resolve) {
                $scope.project.listitem = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.revert = function () {
            $scope.project = angular.copy(original);
            //$scope.project = {};
           // $scope.project.listitem = [];
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };

        $scope.canRevert = function () {
            return !angular.equals($scope.project, original) || !$scope.material_login_form.$pristine;
        };

        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.project, original);
        };

        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewProject = function (rowData) {
            
            $scope.show = 2;

            $scope.project = angular.copy(rowData);
            $scope.project.startdate = new Date(rowData.startdate);
            $scope.project.enddate = new Date(rowData.enddate);
            original = angular.copy($scope.project);
        }

        $scope.addProject = function () {
            $scope.isclientselect = false;
            $scope.project = {};
            $scope.project.startdate = new Date();
            $scope.project.enddate = new Date();
            $scope.project.ddlclient = null;
            $scope.searchclienttxt = null;
            $scope.project.listitem = [];
            original = angular.copy($scope.project);
        }

        $scope.chagetodate = function () {
            if (new Date($scope.project.startdate) > new Date($scope.project.enddate)) {
                $scope.project.enddate = new Date($scope.project.startdate);
            }
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

        function getAllProject(clientid, statusid) {
            $scope.ddlprojectstatusid = statusid;
            var obj = {};
            obj.clientid = clientid;
            obj.statusid = statusid;
            obj.fromdate = $scope.grid.fdate != null ? new Date($scope.grid.fdate) : null;
            obj.todate = $scope.grid.tdate != null ? new Date($scope.grid.tdate) : null;
            var result = service.serverPost(config.urlGetProject, projectModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.loadgrid = function () {
            getAllProject(clientid, statusid);
        }
        function getProject(selectedId) {
            debugger;
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetProjectById, projectModel.searchbyid, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveProject = function () {
            var obj = $scope.project;
            $scope.isclientselect = false;
            if ($scope.project.ddlclient != undefined) {
                obj.offlineMode = obj.offlineMode == true ? 1 : 0;
                obj.isMapEnable = obj.isMapEnable == true ? 1 : 0;
                obj.isVariablePricing = obj.isVariablePricing == true ? 1 : 0;
                obj.startdate = new Date(obj.startdate);
                obj.enddate = new Date(obj.enddate);
                debugger;
                obj.clientid = $scope.project.ddlclient.id;
                obj.revenue = $scope.project.revenue != undefined ? $scope.project.revenue.toString().replace(/,/g, '') : null;
                obj.cost = $scope.project.cost != undefined ? $scope.project.cost.toString().replace(/,/g, '') : null;
                var task_item = [];
                var listinputs = [];
                var taskitem = obj.listitem;
                for (var i = 0; i < taskitem.length; i++) {
                    
                    if (taskitem[i].itemid != null && taskitem[i].itemid != undefined) {
                        var newparam = {};
                        newparam.itemid = taskitem[i].itemid;
                        newparam.qty = taskitem[i].qty;
                        newparam.totalqty = taskitem[i].totalqty;
                        
                        task_item.push(newparam);
                    }
                   
                }

                var newobj = {};
                newobj.item = task_item;
                listinputs.push(newobj);


                obj.lstInputs = listinputs;

                materials.showSpinner();
                if (obj.id == null) {
                    obj.status = 1;

                    obj.createdat = new Date();
                    obj.modifiedat = new Date();
                    obj.createdby = sessionStorage.userid;
                    obj.modifiedby = sessionStorage.userid;
                    var result = service.serverPost(config.urlSaveProject, projectModel.add, "", obj)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        if (resolve.ResponseData > 0) {
                            materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.saveMsg);                            
                            getAllProject(clientid, statusid);
                            $scope.show = 1;
                        }
                        else {
                            materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.existMsg);
                        }
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
                else {
                    obj.status = 1;
                    obj.modifiedby = sessionStorage.userid;
                    obj.modifiedat = new Date();
                    var result = service.serverPost(config.urlUpdateProject, projectModel.edit, "", obj)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        if (resolve.ResponseData > 0) {
                            materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.updateMsg);
                            getAllProject(clientid, statusid);
                            $scope.show = 1;
                        }
                        else {
                            materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.existMsg);
                        }
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }

            }
            else {
                $scope.isclientselect = true;
            }
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
            debugger;
            
            var ddlistModel = projectModel.ddlist;

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

        getAllProject(clientid, statusid);

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.selectedlistItemChange = selectedlistItemChange;
        $scope.searchTextChange = searchTextChange;
        
        function querySearch(query, column) {
            var key = 'list' + column;

            var _clname = column == "client" ? "company" : column;

            var results = query ? $scope[key].filter(createFilter(query, _clname + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(item, column) {
            debugger;
            if (column == "CLIENT") {
                $scope.isclientselect = false;
                if ($scope.project.ddlclient == undefined) {
                    $scope.isclientselect = true;
                }
            }
            else {
                clientid = $scope.selectedclient != undefined ? $scope.selectedclient.id : 0;
                statusid = $scope.selectedstatus != undefined ? $scope.selectedstatus.id : 0;
                getAllProject(clientid, statusid);
            }
        }

        function selectedlistItemChange(item, index, key, list) {
            debugger;
            if (item != undefined) {
                list[index].itemid = item.id;
            }
            else {
                list[index].itemid = null;
            }
        }

        function searchTextChange(item, index, key, list) {
            debugger;
            if (item != undefined) {
                list[index].itemid = item.id;
            }
            else {
                list[index].itemid = null;
            }
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.validatechild = function (form) {
            return form.$valid;
        }
        $scope.addFieldimg = function (list) {
            var obj = {};
            list.push(obj);
        }

        $scope.removeField = function (list) {
            list.splice(list.length - 1, 1);
        }
        $scope.removeimgField = function (list, idx) {
            list.splice(idx, 1);
        }
       

       
    }

   
})();


