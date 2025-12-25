(function () {
    'use strict';

    angular.module('app.table').controller('ClientCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'clientModel', 'commonModel', ClientCtrl]);

    function ClientCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, clientModel, commonModel) {		
        var original;
        var init;
        this.client = clientModel.add;
		
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(22);


        $scope.deleteClient = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.client);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteClient, clientModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.client + ' ' + appConstants.deleteMsg);
                        getAllClient();
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editClient = function (rowData) {

            $scope.show = 2;
            $scope.client = angular.copy(rowData);
            original = angular.copy($scope.client);

        }

        $scope.revert = function () {
            $scope.client = angular.copy(original);
			$scope.client = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.client, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.client, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewClient = function (rowData) {
            $scope.show = 2;            
			$scope.client  = angular.copy(rowData);
            original = angular.copy($scope.client );
        }

        $scope.addClient = function () {
            this.client = "";
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
        $scope.numPerPageOpt = [25, 50, 75, 100];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllClient() {
			var obj = {};

            var result = service.serverGet(config.urlGetClient);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveClient = function () {
            var obj = this.client;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveClient, clientModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    debugger;
                    materials.displayToast(appConstants.successClass, appConstants.client + ' ' + appConstants.saveMsg);
					$scope.client = {};
                    getAllClient();

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                var result = service.serverPost(config.urlUpdateClient, clientModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    getAllClient();
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

            var ddlistModel = clientModel.ddlist;

            for (var key in ddlistModel) {

                var obj = {};
                var valParam = {};
                var keyParam = null;

                valParam = ddlistModel[key].split('~');
                //Only for selection changedloadChilds
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
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(0, '');
	 
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        getAllClient();

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
			
			eval('getAll' + column + '('  +  ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

    }
})();


