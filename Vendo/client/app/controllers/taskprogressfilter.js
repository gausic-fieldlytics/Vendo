(function () {
    'use strict';

    angular.module('app.table').controller('taskprogressfilterCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'tasksprogressModel', 'commonModel', taskprogressfilterCtrl]);

    function taskprogressfilterCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, tasksprogressModel, commonModel) {



        var original;
        var init;

        $scope.taskreport = {};
        $scope.taskreport.fromdate = null;
        $scope.taskreport.todate = null;
        $scope.taskreport.projectid = 0;
        $scope.taskreport.clientid = 0;
        $scope.taskreport.taskid = 0;
        $scope.taskreport.taskstatusid = 0;
        $scope.listtask = [];
        $scope.resultData = [];

        $scope.isSuperAdmin = sessionStorage.usertypecode == appConstants.CODE_USER ? true : false;

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
        $scope.numPerPageOpt = [15, 25, 50, 100];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllTaskprogress() {
            debugger;

            var obj = {};
            obj.fromdate = $scope.taskreport.fromdate != null ? new Date($scope.taskreport.fromdate) : null;
            obj.todate = $scope.taskreport.todate != null ? new Date($scope.taskreport.todate) : null;
            obj.clientid = $scope.taskreport.clientid;
            obj.projectid = $scope.taskreport.projectid;
            obj.taskid = $scope.taskreport.taskid;
            obj.taskstatusid = $scope.taskreport.taskstatusid;
            obj.agencyid = sessionStorage.usertypecode == appConstants.CODE_USER ? 0 : sessionStorage.userid;

            materials.showSpinner();
            var result = service.serverPost(config.urlGetallTaskprogressfilter, tasksprogressModel.search_taskprogress, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getAllTaskprogress();

        function getalltask (projectid) {
            debugger;
            var obj = {};
            obj.projectid = projectid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGettaskDD, tasksprogressModel.searchall_task, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                $scope.listtask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getalltask(0);

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = tasksprogressModel.filterddlist;

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
                    debugger;
                    keyParam = valParam[0];
                    for (var keyname in valParam) {
                        if (keyname == 1) {
                            obj['u_' + valParam[keyname]] = id;
                        }
                        else {
                            obj['u_' + valParam[keyname]] = 0;
                        }
                    }

                    //keyParam = valParam[0];
                    //obj['u_' + valParam[1]] = id;
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {


                    $scope['list' + resolve.input] = resolve.ResponseData;



                }, function (reject) {
                    //  alert("Samp");
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
            var val = column == "project" ? "projecttitle" : (column == "task" ? "tasktitle" : column + 'name');
            var results = query ? $scope[key].filter(createFilter(query, val)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(flag) {
            $scope.taskreport.projectid = $scope.selectedprojectitem != undefined ? $scope.selectedprojectitem.id : 0;
            $scope.taskreport.clientid = $scope.selectedclientitem != undefined ? $scope.selectedclientitem.id : 0;
            $scope.taskreport.taskid = $scope.selectedtaskitem != undefined ? $scope.selectedtaskitem.id : 0;
            $scope.taskreport.taskstatusid = $scope.selectedstatusitem != undefined ? $scope.selectedstatusitem.id : 0;

            if (flag == "C") {
                $scope.loadDropDown($scope.taskreport.clientid, "clientid");
            }
            else if (flag == "P") {
                getalltask($scope.taskreport.projectid);
            }
            getAllTaskprogress();
        }


        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }


      

    }
})();


