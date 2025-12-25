(function () {
    'use strict';

    angular.module('app.table').controller('AssignauditorCtrl', ['$q', '$element', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'AssignauditorModel', 'AssignauditorModel', AssignauditorCtrl]);

    function AssignauditorCtrl($q, $element, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, AssignauditorModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.project = AssignauditorModel.add;

        $scope.deleteAssignAuditor = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.assignauditor);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteAssignAuditor, AssignauditorModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.deleteMsg);
                        getAllAssignAuditor(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };
        //$scope.selectedRun = false;
        $scope.editAssignAuditor = function (rowData) {
            debugger;
            // $scope.selectedRun = true;
            $scope.show = 2;



            var audit_ = querySearch(rowData.username, 'auditor');
            $scope.searchTextAuditor = audit_[0].firstname;
            $scope.item_audit = audit_[0];

            var project_ = querySearch(rowData.projecttitle, 'project');
            $scope.searchTextProject = project_[0].projecttitle;
            $scope.item_project = project_[0];
            //selectedItemChange(audit_[0], 'auditor');
            //selectedItemChange($scope.project_[0], 'project');
            $scope.selectedrowid = rowData.id;
            $scope.assignauditor = angular.copy(rowData);
            $scope.assignauditor.auditid = $scope.assignauditor.auditby;
            original = angular.copy($scope.assignauditor);

        }

        $scope.revert = function () {
            $scope.assignauditor = angular.copy(original);
            $scope.assignauditor = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.assignauditor, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.assignauditor, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewAssignAuditor = function (rowData) {
            $scope.show = 2;
            $scope.assignauditor = angular.copy(rowData);
            $scope.assignauditor.auditid = $scope.assignauditor.auditby;
            original = angular.copy($scope.assignauditor);
        }

        $scope.addAssignAuditor = function () {
            this.assignauditor = "";
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

        function getAllAssignAuditor(selectedId) {

            var obj = {};
            obj.clientid = selectedId;
            var result = service.serverPost(config.urlGetAssignAuditor, AssignauditorModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function getAssignAuditor(selectedId) {

            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetAssignAuditorById, AssignauditorModel.searchbyid, "", obj)

            result.then(function (resolve) {

                $scope.resultData = resolve.ResponseData;

                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function getProject(selectedId) {

            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetProjectById, AssignauditorModel.searchbyid, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.selectedrowid = undefined;
        $scope.saveAssignAuditor = function () {
            debugger;
            var obj = {};
            obj.projectid = $scope.project == null ? $scope.item_project.id : $scope.project.id;
            //obj.auditid = $scope.audit == null ? $scope.item_audit.id : $scope.audit.id  ;

            obj.id = $scope.selectedrowid != undefined ? $scope.selectedrowid : null;
            if (obj.id == null) {

                for (var i = 0; i < $scope.item_audit.length; i++) {
                    obj.projectid = obj.projectid;
                    obj.auditid = $scope.item_audit[i].id;
                    obj.status = 1;
                    obj.createdat = new Date();
                    obj.createdby = 1;

                    var result = service.serverPost(config.urlSaveAssignAuditor, AssignauditorModel.add, "", obj)
                    result.then(function (resolve) {

                        materials.displayToast(appConstants.successClass, appConstants.project + ' ' + appConstants.saveMsg);
                        $scope.assignauditor = {};
                        getAllAssignAuditor(selectedId);

                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }


            }
            else {
                obj.status = 1;
                obj.modifiedby = 1;
                obj.modifiedat = new Date();
                var result = service.serverPost(config.urlUpdateAssignAuditor, AssignauditorModel.edit, "", obj)
                result.then(function (resolve) {
                    getAllAssignAuditor(selectedId);
                    $scope.show = 1;

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }

        $scope.searchTerm;
        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };
        $scope.filter = function () {
            debugger;
            if ($scope.searchTerm.length > 2) return $scope.searchTerm;
        }
        $element.find('input').on('keydown', function (ev) {
            debugger;
            ev.stopPropagation();
        });
        

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = AssignauditorModel.ddlist;

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

        getAllAssignAuditor(0);

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column) {

            var colVal;
            var key = 'list' + column;
            if (column == "project") {
                colVal = "title";
            }
            else if (column == "auditor") {
                column = "firstname";
                colVal = "";
            }
            else {
                colVal = "name";
            }
            var results = query ? $scope[key].filter(createFilter(query, column + colVal)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        


        function selectedItemChange(item, column) {

            if (item == undefined)
                getAllAssignAuditor(0);

            else
                selectedId = item.id;
            if (item != undefined)

                eval('get' + column + '(' + selectedId + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

    }
})();


