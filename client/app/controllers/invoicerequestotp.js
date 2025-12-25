(function () {
    'use strict';

    angular.module('app.table')
        .controller('InvoiceReqOTPCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'invoiceReqModel', 'commonModel', InvoiceReqOTPCtrl]);
    function InvoiceReqOTPCtrl($q, $rootScope, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, invoiceReqModel, commonModel) {

        var selectedId = 0;
        var original;
        var init;
        this.task = invoiceReqModel.add;
        $scope.rate = 0;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(48);


        $scope.ddltarget = {};
        $scope.invoice = {};
        $scope.resultData = [];
        $scope.FilePath = config.filPath + config.urlpdfpath;
        $scope.items = [];
        $scope.selected = [];
        $scope.listallinvoice = [];


        $scope.canSubmit = function () {
            return $scope.material_invoice_form.$valid ;
        };


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
        $scope.showtaskdetail = true;
        $scope.showtaskstepsdetail = false;
        $scope.filepaths = config.filepath;

        $scope.isDefined = function (input) {
            return (!angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

        function loadrequest() {
            debugger;
            var obj = {};
            materials.showSpinner()
            var result = service.serverPost(config.urlGetInvoicereqotp, invoiceReqModel.searchall_otp, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                debugger;
                alert('Not Resolved')
            });
        }
        loadrequest();

        
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };
        

        

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.projrctbytask = projrctbytask;
        $scope.selectedItemChangeTarget = selectedItemChangeTarget;
        /////Start Modal

        /////End Modal

        function querySearch(query, column) {
            
            var key = 'list' + column;
            if (column == "project")
                var results = query ? $scope[key].filter(createFilter(query, column + 'title')) : $scope[key], deferred;
            //else if (column == "target")
            //    var results = query ? $scope[key].filter(createFilter(query, column + 'title')) : $scope[key], deferred;
            else
                var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                if (column == "taskstatus")
                    $scope.searchText1 = undefined;
                else if (column == "project")
                    $scope.searchText = undefined;
                return results;
            }
        }
        function projrctbytask(project, columnn) {
            debugger;
            if (project != undefined) {
                getAllTaskbyid(project.id);
            }
            else {
                getTaskNoteDone(1);
                $scope.listtarget = {};
            }
                
        }

        function selectedItemChangeTarget(target, columnn) {
            debugger;
            if (target != undefined)
                getAllTargetbyproject(target.id);
            else
                getTaskNoteDone(1);
        }

        function selectedItemChange(item, column) {
           
            if (item != undefined) {
                selectedId = item.id;
                eval('getAll' + column + '(' + item.id + ')');
            }
            else
                getTaskNoteDone(1);


        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }



    }

    
})();


