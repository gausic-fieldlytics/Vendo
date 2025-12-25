(function () {
    'use strict';

    angular.module('app.table').controller('ContactCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'contactModel', 'commonModel', ContactCtrl]);

    function ContactCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, contactModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.contact = contactModel.add;

        $scope.deleteContact = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.contact);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteContact, contactModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.contact + ' ' + appConstants.deleteMsg);
                        getAllContact(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editContact = function (rowData) {

            $scope.show = 2;
            $scope.contact = angular.copy(rowData);
            original = angular.copy($scope.contact);

        }

        $scope.revert = function () {
            $scope.contact = angular.copy(original);
			$scope.contact = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.contact, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.contact, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewContact = function (rowData) {
            $scope.show = 2;            
			$scope.contact  = angular.copy(rowData);
            original = angular.copy($scope.contact );
        }

        $scope.addContact = function () {
            this.contact = "";
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

        function getAllContact(selectedId) {
            			var obj = {};
            obj.stateid = selectedId;
            var result = service.serverPost(config.urlGetContact, contactModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveContact = function () {
            var obj = this.contact;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveContact, contactModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    
                    materials.displayToast(appConstants.successClass, appConstants.contact + ' ' + appConstants.saveMsg);
					$scope.contact = {};
                    getAllContact(selectedId);

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.status = 1;
                var result = service.serverPost(config.urlUpdateContact, contactModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    getAllContact(selectedId);
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
           
            var ddlistModel = contactModel.ddlist;

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

        getAllContact(0);

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


