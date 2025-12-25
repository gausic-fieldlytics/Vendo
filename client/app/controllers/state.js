(function () {
    'use strict';

    angular.module('app.table').controller('StateCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'stateModel', 'commonModel', '$element', '$sce', StateCtrl]);

    function StateCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, stateModel, commonModel, $element, $sce) {
		var selectedId = 0;
        var original;
        var init;
        this.state = stateModel.add;
        debugger;
        $scope.access_permission = {};
        $scope.access_permission= materials.getaccess(1);


        $scope.deleteState = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.state);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id,
                    modifiedby: sessionStorage.userid
                };
                var result = service.serverDelete(config.urlDeleteState, stateModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.deleteMsg);
                        getAllState(selectedId);
                    }
                    else {
                        var _cons = resolve.ResponseData == -1 ? appConstants.city : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, appConstants.state).replace(/#REFNAME#/g, _cons);
                        materials.displayToast(appConstants.warningClass, msg);
                    }

                    
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editState = function (rowData) {

            $scope.show = 2;
            $scope.state = angular.copy(rowData);
            original = angular.copy($scope.state);

        }

        $scope.revert = function () {
            $scope.state = angular.copy(original);
			$scope.state = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.state, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.state, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewState = function (rowData) {
            $scope.show = 2;            
			$scope.state  = angular.copy(rowData);
            original = angular.copy($scope.state );
        }

        $scope.addState = function () {
            this.state = {};
            
            //$('document').ready(function () {
             //  $('#stateModel').modal('show');
            //});
            
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
       

        function getAllState(selectedId) {
            materials.showSpinner();
            var result = service.serverGet(config.urlGetState);
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.saveState = function () {
            debugger;
            var obj = this.state;
            obj.status = 1;
            if (obj.id == null) {
            
                var result = service.serverPost(config.urlSaveState, stateModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.saveMsg);
                        getAllState(selectedId);                        
                        $scope.show = 1;
                        this.state = {};
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.existMsg);
                    }                    
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                
                var result = service.serverPost(config.urlUpdateState, stateModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.updateMsg);
                        getAllState(selectedId);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.existMsg);
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
           
            var ddlistModel = stateModel.ddlist;

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

        getAllState(0);

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
            var _keyset = appConstants.STATE_COL;
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
                    materials.showSpinner();
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
                                if(result.length > 0){
                               // $scope.uploadedItems =result;
                                //$scope.uploadedItems = result.filter((v,i) => result.findIndex(item => item.value == v.value) === i);
                                var jsonObject = result.map(JSON.stringify);	                                                             
                               var uniqueSet = new Set(jsonObject);
                               $scope.uploadedItems = Array.from(uniqueSet).map(JSON.parse);
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
                                            var _statename = $scope.uploadedItems[m]["State"];
                                            _statename = _statename != null ? $scope.ToCaptilize(_statename).trim() : "";       
                                            var _state = $filter('filter')($scope.resultData, function (value) {
                                                return value.statename.toUpperCase().trim() == _statename.toUpperCase().trim();
                                            })[0];
                                            if(_state == undefined){
                                                newtarget.statename = _statename;
                                                newtarget.statecode = $scope.uploadedItems[m]["Code"];

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
                            }
                            });
                            if ($scope.uploadedItems.length == 0 && $scope.listalltask == 0){
                                materials.hideSpinner();
                                alert("Excel without data...");
                            }
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

        $scope.removerow = function (listinputs, idx,newrow) {
            listinputs.splice(idx, 1);
            let index = $scope.listalltask.findIndex( record => ((record.statename === newrow.statename) && (record.statecode === newrow.statecode)));
            $scope.listalltask.splice(index, 1);

        }
        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.savebulkitem = function () {
            debugger;
            var obj = {};
            obj.flag = "STATE";
            obj.listinputs = $scope.listalltask;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, stateModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllState(selectedId);
            }, function (reject) {
                materials.hideSpinner();
                materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.tryMSG);
            });
        }

        //$scope.savebulkitem = function () {
        //    debugger;
        //    var obj = {};
        //    obj.listinputs = $scope.listalltask;
        //    materials.showSpinner();
        //    var result = service.serverPost(config.url_bulkstate, stateModel.bulk_add, "", obj)
        //    result.then(function (resolve) {
        //        debugger;
        //        materials.displayToast(appConstants.successClass, appConstants.state + ' ' + appConstants.saveMsg);
        //        materials.hideSpinner();
        //        getAllState(selectedId);
        //    }, function (reject) {

        //    });
        //}
        $scope.cols = ["State Name", "State Code"];
        $scope.colstitle = ["statename", "statecode"];

        function toObject(arr, arrlength) {
           
            var arriobj = [];
            for (var p = 0; p < arrlength; p++) {
                arriobj.push(p == arrlength-1 ? arr : "");
            }
            return arriobj;
        }

        $scope.sampleexceller = function () {
            debugger;
            $scope.fileName = "State";
            $scope.exportData = [];           
            $scope.exportData.push($scope.cols);           
            service.exceldownload($scope.fileName,$scope.exportData);
        }

        $scope.exceller = function () {

            $scope.fileName = "State Master";
            $scope.exportData = [];
            // var headtitle = "State Master";
            // var headtitlefrom = "From Date " + ":" + materials.date_MMDDYYYY(new Date($scope.projectreport.fromdate));
            // var headtitleto = "To Date" + ":" + materials.date_MMDDYYYY(new Date($scope.projectreport.todate));
            //$scope.exportData.push(toObject(headtitle, $scope.cols.length));
            // $scope.exportData.push(toObject(headtitlefrom, $scope.cols.length));
            // $scope.exportData.push(toObject(headtitleto, $scope.cols.length));
            //$scope.exportData.push(toObject("", $scope.cols.length));

            $scope.exportData.push($scope.cols);
            for (var n = 0; n < $scope.filteredresultData.length; n++) {
                    var selectdData = [];
                    var selectObjec = $scope.filteredresultData[n];
                    for (var m = 0; m < $scope.colstitle.length; m++) {
                        for (var key in selectObjec) {
                            if (key === $scope.colstitle[m]) {
                                switch (key) {

                                    case "customername":
                                        var _val = selectObjec[key];
                                        _val = _val + "-" + selectObjec["mobileno"];
                                        selectdData.push(_val);
                                        break;
                                    case "startdate":
                                    case "enddate":
                                        var _val = materials.stockconvertdatetime(new Date(selectObjec[key]), "D");
                                       // _val = _val + " at " + (key == "pickupdate" ? selectObjec["deliverylocation"] : selectObjec["droplocation"]);
                                        selectdData.push(_val);
                                        break;
                                     default:
                                        selectdData.push(selectObjec[key]);
                                        break;
                                }
                            }
                        }
                    }
                    $scope.exportData.push(selectdData);
            }

            service.exceldownload($scope.fileName,$scope.exportData);
        }       

    }
})();


