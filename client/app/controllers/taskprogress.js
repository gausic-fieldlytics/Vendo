(function () {
    'use strict';

    angular.module('app.table').controller('TaskprogressCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'tasksprogressModel', 'commonModel', TaskprogressCtrl]);

    function TaskprogressCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials,tasksprogressModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(36);

        debugger;
        $scope.filepaths = config.filepath;
        $scope.FilePath = config.filepath;
        $scope.listalltask = [];
        $scope.listtarget = [];
       
       
        $scope.revert = function () {
            $scope.user = angular.copy(original);
            $scope.user = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.user, original) || !$scope.material_login_form.$pristine;

        };
        $scope.canSubmit = function () {

            return $scope.material_login_form.$valid && !angular.equals($scope.user, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        

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

        function loadgrid(clientid) {
            var obj = {};
            obj.clientid = clientid;
            var result = service.serverPost(config.urlGetTaskstepsprojectgrid, tasksprogressModel.searchall_grid, "", obj)
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

        function loadgridtask(projectid) {
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGetTaskprogressgrid, tasksprogressModel.searchall, "", obj)
            result.then(function (resolve) {
                $scope.listalltask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.getAllTaskprogress = function (taskid) {
            debugger;
            $scope.show = 2;
            var obj = {};
            obj.taskid = taskid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetallTaskprogress, tasksprogressModel.search_progress, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                $scope.listtarget = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }


        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }
        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = userModel.ddlist;

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

     //   $scope.loadDropDown(0, '');

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
                $scope.retdata = results
                return results;
            }
        }

        function selectedItemChange(item, columns) {

            columns = columns.split('~');
            if (item == undefined) {
                item = $scope.retdata;
            }

            var column = columns[1];
            selectedId = item[0].id;
            eval('getAll' + column + '(' + item[0].id + ')');
        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

    }
})();


