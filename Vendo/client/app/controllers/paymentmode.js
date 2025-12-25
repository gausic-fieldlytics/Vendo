(function () {
    'use strict';

    angular.module('app.table').controller('PaymentmodeCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'paymentmodeModel', 'commonModel', '$sce', PaymentmodeCtrl]);

    function PaymentmodeCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, paymentmodeModel, commonModel, $sce) {
		var selectedId = 0;
        var original;
        var init;
        this.paymentmode = paymentmodeModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(6);

        $scope.bindcurrency = $sce.trustAsHtml("&#8377;");


        $scope.deletePaymentmode = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.paymentmode);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeletePaymentmode, paymentmodeModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.deleteMsg);
                        getAllPaymentmode(selectedId);
                    }
                    else {
                        var _cons = resolve.ResponseData == -1 ? appConstants.payment : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, appConstants.paymentmode).replace(/#REFNAME#/g, _cons);
                        materials.displayToast(appConstants.warningClass, msg);
                    }

                   
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editPaymentmode = function (rowData) {

            $scope.show = 2;
            $scope.paymentmode = angular.copy(rowData);
            original = angular.copy($scope.paymentmode);

        }

        $scope.revert = function () {
            $scope.paymentmode = angular.copy(original);
			$scope.paymentmode = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.paymentmode, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.paymentmode, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewPaymentmode = function (rowData) {
            $scope.show = 2;            
			$scope.paymentmode  = angular.copy(rowData);
            original = angular.copy($scope.paymentmode );
        }

        $scope.addPaymentmode = function () {
            this.paymentmode = "";
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

        function getAllPaymentmode(selectedId) {
            materials.showSpinner();
            var result = service.serverGet(config.urlGetPaymentmode);
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.savePaymentmode = function () {
            var obj = this.paymentmode;
            obj.status = 1;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSavePaymentmode, paymentmodeModel.add, commonModel.statusmaster, obj)
                result.then(function (resolve) {
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.saveMsg);
                        $scope.paymentmode = {};
                        getAllPaymentmode(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.existMsg);
                        $scope.paymentmode = {};
                        getAllPaymentmode(selectedId);
                    }
                    

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                
                var result = service.serverPost(config.urlUpdatePaymentmode, paymentmodeModel.edit, commonModel.statusmaster, obj)
                result.then(function (resolve) {
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.updateMsg);
                        getAllPaymentmode(selectedId);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.existMsg);
                    }

                   

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }
		
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
           
            var ddlistModel = paymentmodeModel.ddlist;

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

        getAllPaymentmode(0);

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

        function handleFile(e) {
            debugger;
            $scope.isvalid = false;
            var _keyset = appConstants.PAYMENT_MODE_COL;
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

            if (files.length > 0) {
                var extension = e.target.files[0].name.split(".");
                if (extension[extension.length - 1] == "xlsx") {
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
                                debugger;
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
                                        $scope.isvalid = true;
                                        var part = {};
                                        var newtask = {};
                                        var newtarget = {};
                                        for (var m = 0; m < $scope.uploadedItems.length; m++) {

                                            var newtarget = {};
                                            newtarget.paymentmodename = $scope.uploadedItems[m]["Payment Mode"];
                                            newtarget.paymentmodecode = $scope.uploadedItems[m]["Code"];

                                            $scope.listalltask.push(newtarget);
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
                                if (count == incount && $scope.isvalid) {
                                    $('#openpopup').click();
                                    //  $scope.open('lg');
                                }
                                count++;
                            });
                            $scope.$apply();

                        };
                        reader.readAsArrayBuffer(f);
                    }
                }
                else {

                    $scope.uploadedItems = [];
                    document.getElementById("files").value = "";
                    alert("Invalid Excel Format...");
                }
            }

            
        }

        $(document).ready(function () {
            $('#files').change(handleFile);
        });

        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }

        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.savebulkitem = function () {
            debugger;
            var obj = {};
            obj.flag = "PAY_MODE";
            obj.listinputs = $scope.listalltask;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, paymentmodeModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.paymentmode + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllPaymentmode(0);
            }, function (reject) {
                materials.hideSpinner();
                materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.tryMSG);
            });
        }

    }
})();


