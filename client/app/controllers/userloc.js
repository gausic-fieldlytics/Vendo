(function () {
    'use strict';

    angular.module('app.table').controller('UserlocCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'userlocModel', 'commonModel', UserlocCtrl]);

    function UserlocCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, userlocModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.userloc = userlocModel.add;

        $scope.deleteUserloc = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.userloc);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteUserloc, userlocModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.userloc + ' ' + appConstants.deleteMsg);
                        getAllUserloc(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editUserloc = function (rowData) {

            $scope.show = 2;
            $scope.userloc = angular.copy(rowData);
            original = angular.copy($scope.userloc);

        }

        $scope.revert = function () {
            $scope.userloc = angular.copy(original);
			$scope.userloc = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.userloc, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.userloc, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewUserloc = function (rowData) {
            $scope.show = 2;            
			$scope.userloc  = angular.copy(rowData);
            original = angular.copy($scope.userloc );
        }

        $scope.addUserloc = function () {
            this.userloc = "";
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

        function getAllUserloc(selectedId) {
            			var obj = {};
            obj.userid = selectedId;
            var result = service.serverPost(config.urlGetUserloc, userlocModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveUserloc = function () {
            var obj = this.userloc;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveUserloc, userlocModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    
                    materials.displayToast(appConstants.successClass, appConstants.userloc + ' ' + appConstants.saveMsg);
					$scope.userloc = {};
                    getAllUserloc(selectedId);

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.status = 1;
                var result = service.serverPost(config.urlUpdateUserloc, userlocModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    getAllUserloc(selectedId);
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
           
            var ddlistModel = userlocModel.ddlist;

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

        getAllUserloc(0);

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


