(function () {
    'use strict';

    angular.module('app.table').controller('AreaCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'areaModel', 'commonModel', AreaCtrl]);

    function AreaCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, areaModel, commonModel) {

        var stateid = 0,cityid=0;
        var original;
        var init;
        this.city = areaModel.add;
        $scope.listallcity = [];
        $scope.listcitydata = [];
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(3);
        var autocompletelocalfrom;


        // function initialize(islocal) {
        //     var options = {
        //         types: ['geocode'],
        //         componentRestrictions: { country: 'in' }
        //     };
           
        //     autocompletelocalfrom = new google.maps.places.Autocomplete((document.getElementById('txtFromLocation')), options);

        // }
       // initialize();

        $scope.deleteArea = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.area);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id,
                    modifiedby: sessionStorage.userid
                };
                var result = service.serverDelete(config.urlDeleteArea, areaModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.deleteMsg);
                        getAllArea(stateid, cityid);
                    }
                    else {
                        var _cons = resolve.ResponseData == -1 ? appConstants.target : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, appConstants.area).replace(/#REFNAME#/g, _cons);
                        materials.displayToast(appConstants.warningClass, msg);
                    }

                    
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editArea = function (rowData) {
            debugger;
            $scope.show = 2;
            $scope.loadChilds(rowData.stateid, 'stateid');
            $scope.area = angular.copy(rowData);
            original = angular.copy($scope.area);

        }

        $scope.revert = function () {
            $scope.city = angular.copy(original);
            $scope.city = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.area, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.area, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewArea = function (rowData) {
            $scope.show = 2;
            $scope.city = angular.copy(rowData);
            original = angular.copy($scope.city);
        }

        $scope.addArea = function () {
            this.area = "";
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

        function up_select(page) {
            var end, start;
            start = (page - 1) * $scope.up_numPerPage;
            end = start + $scope.up_numPerPage;
            return $scope.listbinddata = $scope.listalltask.slice(start, end);
        };

        $scope.up_currentPage = 1;
        $scope.up_numPerPage = 25;
        $scope.up_select = up_select;

        function getAllArea(stateid, cityid) {
            materials.showSpinner();
            var obj = {};
            obj.stateid = stateid;
            obj.cityid = cityid;
            var result = service.serverPost(config.urlGetArea, areaModel.searchall, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.saveArea = function () {
            debugger;
            var obj = this.area;
            obj.status = 1;
            if (obj.id == null) {

                var result = service.serverPost(config.urlSaveArea, areaModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.saveMsg);
                        $scope.area = {};
                        getAllArea(stateid, cityid);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.existMsg);
                    }
                   

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {

                var result = service.serverPost(config.urlUpdateArea, areaModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.updateMsg);
                        getAllArea(stateid, cityid);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.existMsg);
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
            debugger;
            var ddlistModel = areaModel.ddlist;

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
                    if (resolve.input == "city") {
                        $scope.listcitydata = resolve.ResponseData;
                    }
                    else {
                        $scope['list' + resolve.input] = resolve.ResponseData;
                    }
                  
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(0, '');

        function getAllCity(selectedId) {
            debugger;
            var obj = {};
            obj.stateid = selectedId;
            var result = service.serverPost(config.urlGetCity, areaModel.searchall_city, "", obj)
            result.then(function (resolve) {
                $scope.listallcity = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        getAllArea(0,0);

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column) {
            var key = column == "city" ? "listallcity" : 'list' + column;
            var lst = $scope[key];
            var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results; selectedItemChange
            }
        }

        function selectedItemChange(item, column,status) {
            debugger;
           // selectedId = item.id;
            stateid = $scope.selectedstate != undefined ? $scope.selectedstate.id : 0;
            cityid = $scope.selectedcity != undefined ? $scope.selectedcity.id : 0;
            if (status == "S") {
                getAllCity(stateid);
            }
            eval('getAll' + column + '(' + stateid + ',' + cityid + ')');

           
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
            var _keyset = appConstants.AREA_COL;
            var _keysetcount = _keyset.length;
            var columncount = 0;
            var count = 1;
            var incount = 0;
            $scope.listalltask = [];
            $scope.listinsertdata = [];
            $scope.uploadedItems = [];
            //Get the files from Upload control
            var files = e.target.files;
            var i, f;
            //Loop through files

            if (files.length > 0) {
                var extension = e.target.files[0].name.split(".");
                if (extension[extension.length - 1] == "xlsx") {
                    materials.showSpinner();
                    for (i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var result;
                            var workbook = XLSX.read(data, { type: 'binary' });
                            //incount = workbook.SheetNames.length;
                            incount = 1;
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
                                    $scope.listinsertdata = [];

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

                                            var _statename = $scope.uploadedItems[m]["State"];
                                            var _cityname = $scope.uploadedItems[m]["City"];
                                            _statename = _statename != null ? _statename.toLowerCase().trim() : "";
                                            _cityname = _cityname != null ? _cityname.toLowerCase().trim() : "";

                                            var state = $filter('filter')($scope.liststate, function (value) {
                                                return value.statename.toLowerCase().trim() == _statename;
                                            })[0];

                                            var city = $filter('filter')($scope.listcitydata, function (value) {
                                                return value.cityname.toLowerCase().trim() == _cityname;
                                            })[0];

                                            var pin = $scope.uploadedItems[m]["Pincode"];
                                            pin = pin != null ? pin : "";


                                            newtarget.areaname = $scope.uploadedItems[m]["Area"];
                                            newtarget.pincode = pin;
                                            if (state != null && city != null) {

                                                newtarget.stateid = state.id;
                                                newtarget.cityid = city.id;

                                                $scope.listinsertdata.push(newtarget);
                                                newtarget.statename = $scope.uploadedItems[m]["State"];
                                                newtarget.cityname = $scope.uploadedItems[m]["City"];
                                                $scope.listalltask.push(newtarget);
                                            }

                                        }
                                    }
                                    else {
                                        materials.hideSpinner();
                                        $scope.uploadedItems = [];
                                        document.getElementById("files").value = "";
                                        alert("Excel Format does not Match...");
                                    }
                                }
                                else {
                                }
                                if (count == incount && $scope.isvalid) {
                                    materials.hideSpinner();
                                    $scope.listbinddata = $scope.up_select($scope.up_currentPage);
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
            obj.flag = "AREA";
            obj.listinputs = $scope.listinsertdata ;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, areaModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.area + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllArea(stateid, cityid);
            }, function (reject) {

            });
        }



    }
})();


