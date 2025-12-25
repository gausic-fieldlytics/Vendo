(function () {
    'use strict';

    angular.module('app.table')
        .controller('TargetCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'targetModel', 'commonModel', '$element', '$uibModal', TargetCtrl])
        .controller('taskexcelCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', taskexcelCtrl]);

    function TargetCtrl($q,$rootScope, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, targetModel, commonModel, $element, $uibModal) {
        var selectedId = 0;
        var original;
        var init;
        this.target = targetModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(26);


        var projectid = 0, clientid = 0, stateid = 0, cityid = 0, areaid = 0;
        $scope.listtarget = [];
        $scope.listallcity = [];
        $scope.listallarea = [];

        $scope.items = [];
        $scope.selected = [];


        $scope.deleteTarget = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.target);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTarget, targetModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.deleteMsg);
                        getAllTarget(stateid, cityid, areaid);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };
        $scope.deletebulkitem = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.target);
            $mdDialog.show(confirm).then(function () {
                
                var delObj = {
                    id: obj.join()
                };
                var result = service.serverDelete(config.urlDeletebulkTarget, targetModel.delete, "", delObj);
                result.then(function (resolve) {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.deleteMsg);
                        getAllTarget(stateid, cityid, areaid);
                    
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        

        $scope.editTarget = function (rowData) {

            $scope.loadDropDown(rowData.stateid, 'stateid',"1");
            $scope.loadDropDown(rowData.cityid, 'cityid', "1");
           
            $scope.target = angular.copy(rowData);
            original = angular.copy($scope.target);
            $scope.show = 2;
        }

        $scope.revert = function () {
            $scope.target = angular.copy(original);
            $scope.target = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.target, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.target, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTarget = function (rowData) {
            $scope.show = 2;
            $scope.target = angular.copy(rowData);
            original = angular.copy($scope.target);
        }

        $scope.addTarget = function () {
            this.target = "";
            $scope.listcity = [];
            $scope.listarea = [];
        }

        $scope.removeval = function () {
            $scope.listcity = [];
            $scope.listarea = [];
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
        $scope.numPerPageOpt = [25, 50, 100, 200];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllTarget(stateid, cityid, areaid) {
            
            var obj = {};
            obj.stateid = stateid;
            obj.cityid = cityid;
            obj.areaid = areaid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetTarget, targetModel.searchall, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                for (var i = 0; i < $scope.resultData.length; i++) {
                    $scope.items.push($scope.resultData[i].id);
                }
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }
       getAllTarget(stateid, cityid, areaid);

        function loadgrid(projectid, clientid, stateid, cityid, areaid) {
            
            var obj = {};
            obj.projectid = projectid;
            obj.clientid = clientid;
            obj.stateid = stateid;
            obj.cityid = cityid;
            obj.areaid = areaid;

            var result = service.serverPost(config.urlGetTargetgrid, targetModel.grid_searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        //loadgrid(projectid, clientid, stateid, cityid, areaid)



        $scope.expandSelected = function (row) {
            
            $scope.listtarget = [];
            $scope.currentPageresultData.forEach(function (val) {
                val.expanded = false;
            })
            
            row.expanded = true;
            getAllTarget(row.taskid);
        }


        $rootScope.$on('loadtarget', function (event, args) {
            
            getAllTarget(stateid, cityid, areaid);
        });

        $scope.saveTarget = function () {
            var obj = $scope.target;
            obj.islocked = obj.islocked == true || obj.islocked == 1 ? 1 : 0;
            materials.showSpinner();
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveTarget, targetModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
                        $scope.target = {};
                        getAllTarget(stateid, cityid, areaid);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.status = 1;
                var result = service.serverPost(config.urlUpdateTarget, targetModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.updateMsg);
                        getAllTarget(stateid, cityid, areaid);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId, "1");
        }

        $scope.loadDropDown = function (id, varId,loadstatus) {
            
            var ddlistModel = targetModel.ddlist;

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
                    for (var i = 0; i < valParam.length; i++) {
                        obj['u_' + valParam[i]] = i == 1 ? id : 0;
                    }
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    
                    if (loadstatus == "0" || loadstatus == "2") {

                        if (resolve.input == "city") {
                            $scope.listallcity = resolve.ResponseData;
                            $scope['list' + resolve.input] = resolve.ResponseData;
                        }
                        else if (resolve.input == "area") {
                            $scope.listallarea = resolve.ResponseData;
                            $scope['list' + resolve.input] = resolve.ResponseData;
                        }
                        else {
                            $scope['list' + resolve.input] = resolve.ResponseData;
                        }
                    }
                    else {
                        $scope['list' + resolve.input] = resolve.ResponseData;
                    }
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(0, '', "0");

        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

      

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        

        function querySearch(query, column) {
            // var keyname = column == "city" ? "listall" : (column == "area" ? "listall" : 'list');
            var keyname = 'list';
            var key = keyname + column;
            var colname = column == "client" ? "companyname" : (column == "project" ? "projecttitle" : column + 'name');
            var results = query ? $scope[key].filter(createFilter(query, colname)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(item, column) {
            
            projectid = $scope.selectedproject != undefined ? $scope.selectedproject.id : 0;
            clientid = $scope.selectedclient != undefined ? $scope.selectedclient.id : 0;
            stateid = $scope.selectedstate != undefined ? $scope.selectedstate.id : 0;
            cityid = $scope.selectedcity != undefined ? $scope.selectedcity.id : 0;
            areaid = $scope.selectedarea != undefined ? $scope.selectedarea.id : 0;

            if (column == "S") {
                $scope.listcity = [];
                $scope.listarea = [];
                $scope.loadDropDown(stateid, 'stateid', "2");
            }
            else if (column == "C") {
                $scope.listarea = [];
                $scope.loadDropDown(cityid, 'cityid', "2");
            }

            
            

            getAllTarget( stateid, cityid, areaid)

            // selectedId = item.id;
            // eval('getAll' + column + '(' + item.id + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }



        $scope.animationsEnabled = true;


        //$scope.toggleAnimation = function () {
        //    $scope.animationsEnabled = !$scope.animationsEnabled;
        //};


        function getdate(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;

            return year + '-' + month + '-' + day;
        }

        function handleFile(e) {
            
            $scope.isvalid = false;
            var _keyset = appConstants.TASK_POOL_SAMPLE_EL_COL;
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
                            materials.showSpinner();
                            var data = e.target.result;
                            var result;
                            var workbook = XLSX.read(data, { type: 'binary' });
                            //incount = workbook.SheetNames.length;
                            incount = 1;
                            var sheet_name_list = workbook.SheetNames;
                            $scope.listalltask = [];
                            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                                //Convert the cell value to Json
                                console.log('123')
                                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                console.log();
                                //   var roa = workbook.Sheets[y];
                                result = [];
                                if (roa.length > 0) {
                                    result = roa;
                                }
                                columncount = 0;
                                $scope.uploadedItems = result;
                               // $scope.listalltask = result;
                               
                                
                                if ($scope.uploadedItems.length > 0) {

                                    

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
                                            newtarget.targetname = $scope.uploadedItems[m]["Target"];

                                            var _statename = $scope.uploadedItems[m]["State"];
                                            var _cityname = $scope.uploadedItems[m]["City"];
                                            var _areaname = $scope.uploadedItems[m]["Area"];

                                            _statename = _statename != null ? _statename.toLowerCase().trim() : "";
                                            _cityname = _cityname != null ? _cityname.toLowerCase().trim() : "";
                                            _areaname = _areaname != null ? _areaname.toLowerCase().trim() : "";

                                            var state = $filter('filter')($scope.liststate, function (value) {
                                                return value.statename.toLowerCase().trim() == _statename;
                                            })[0];

                                            var city = $filter('filter')($scope.listallcity, function (value) {
                                                return value.cityname.toLowerCase().trim() == _cityname;
                                            })[0];

                                            var area = $filter('filter')($scope.listallarea, function (value) {
                                                return value.areaname.toLowerCase().trim() == _areaname;
                                            })[0];


                                            newtarget.stateid = state != null ? state.id : null;
                                            newtarget.cityid = city != null ? city.id : null;
                                            newtarget.areaid = area != null ? area.id : null;

                                            newtarget.state = $scope.uploadedItems[m]["State"];
                                            newtarget.city = $scope.uploadedItems[m]["City"];
                                            newtarget.area = $scope.uploadedItems[m]["Area"];
                                            newtarget.street = $scope.uploadedItems[m]["Street"] != undefined ? $scope.uploadedItems[m]["Street"] : null;
                                            newtarget.address = $scope.uploadedItems[m]["Address"];
                                            newtarget.phoneno = $scope.uploadedItems[m]["Contact"];
                                            newtarget.pickuplocation = $scope.uploadedItems[m]["Pickup Location"];
                                            newtarget.landmark = $scope.uploadedItems[m]["Land Mark"] != undefined ? $scope.uploadedItems[m]["Land Mark"] : null;

                                            newtarget.distributor = $scope.uploadedItems[m]["Distributor"];
                                            newtarget.districontact = $scope.uploadedItems[m]["Distributor Contact"];

                                            newtarget.supportcontact = $scope.uploadedItems[m]["Support Contact"];
                                            newtarget.supportnumber = $scope.uploadedItems[m]["Support Number"];
                                            newtarget.lat = $scope.uploadedItems[m]["Latitude"];
                                            newtarget.lng = $scope.uploadedItems[m]["Longitude"];



                                            if (newtarget.stateid != null && newtarget.cityid != null && newtarget.areaid) {
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
                                
                                if (count == incount && $scope.isvalid) {
                                    materials.hideSpinner();
                                     $scope.open('lg');
                                   // alert();
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
        $scope.listalltask = [];

        $scope.open = function (size) {
            
            var obj = {};
            obj.task = $scope.listtask;
            obj.target = $scope.listalltask;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'taskexcellist.html',
                controller: 'taskexcelCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (ex) {
                
            });
        };

        $(document).ready(function () {
            $('#files').change(handleFile);
        });

        $scope.toggle = function (item, list) {
            
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            
            return list.indexOf(item) > -1;
        };

        $scope.isIndeterminate = function () {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.items.length);
        };

        $scope.isChecked = function () {
            return $scope.selected.length === $scope.items.length;
        };

        $scope.toggleAll = function () {
            if ($scope.selected.length === $scope.items.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.items.slice(0);
            }
        };

    }


    function taskexcelCtrl($q,$rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        
        $scope.listtarget = [];
        $scope.listtask = [];
        $scope.listtask = items.task;
        $scope.listtarget = items.target;
        $scope.listbinddata = [];
        $scope.publishdate = new Date();


        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.listbinddata = $scope.listtarget.slice(start, end);
        };

        $scope.currentPage = 1;
        $scope.numPerPage = 25;
        $scope.select = select;
        $scope.listbinddata = $scope.select($scope.currentPage);

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }
        var addobj = {
            // "createdby": "createdby",
            //  "clientid": "clientid",
             "flag": "flag",
            "listinputs": [{
                "targetname": "targetname",
                "areaid": "areaid",
                "stateid": "stateid",
                "cityid": "cityid",
                
                "street": "street",
                "address": "address",
                "phoneno": "phoneno",
                "pickuplocation": "pickuplocation",
                "landmark": "landmark",
               
                "distributor": "distributor",
                "districontact": "districontact",
                "supportcontact": "supportcontact",
                "supportnumber": "supportnumber",
                "lat": "lat",
                "lng": "lng",
                //"islocked": "islocked",
                "createdby": "createdby",
                //  "taskid": "taskid",
                
                
                           }]
        };
        function getdate(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;

            return year + '-' + month + '-' + day;
        }

        $scope.ok = function () {
            

            var tempArray = [];
            for (var i = 0; i < $scope.listtarget.length; i++) {
                var inputobj = angular.copy($scope.listtarget[i]);
                //res.createdby = sessionStorage.userid;
                //res.islocked = 0;
                //tempArray.push(res);
                var res = {};
                res.targetname = inputobj.targetname;
                res.areaid = inputobj.areaid;
                res.stateid = inputobj.stateid;
                res.cityid = inputobj.cityid;

                res.street = inputobj.street;
                res.address = inputobj.address;
                res.phoneno = inputobj.phoneno;
                res.pickuplocation = inputobj.pickuplocation;
                res.landmark = inputobj.landmark;

                res.distributor = inputobj.distributor;
                res.districontact = inputobj.districontact;
                res.supportcontact = inputobj.supportcontact;
                res.supportnumber = inputobj.supportnumber;
                res.lat = inputobj.lat;
                res.lng = inputobj.lng;
                //"islocked": "islocked",
                res.createdby = sessionStorage.userid;
                tempArray.push(res);
            }

            var obj = {};
            obj.flag = "TARGET";
            obj.listinputs = tempArray;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, addobj, "", obj)
            result.then(function (resolve) {
                
                materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                $rootScope.$emit("loadtarget", null);
                $uibModalInstance.dismiss("cancel");
            }, function (reject) {
                materials.hideSpinner();
                materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.tryMSG);
            });
        }

        //$scope.ok = function () {
            
        //    //  
        //  //  if ($scope.selecteditem != undefined) {
        //        var obj = {};
        //        //obj.clientid = $scope.selecteditem != undefined ? $scope.selecteditem.id : null;
        //        //  obj.publishdate = getdate(new Date($scope.publishdate));
        //        //   obj.createdby = sessionStorage.userid;
        //        var tempArray = [];
        //        for (var i = 0; i < $scope.listtarget.length; i++) {

        //            var res = angular.copy($scope.listtarget[i]);
        //            //res.taskid = $scope.selecteditem != undefined ? $scope.selecteditem.id : null;
        //            res.createdby = sessionStorage.userid;
        //            res.islocked = 0;

        //            //res.projecttitle = $scope.listalltask[i].projecttitle;
        //            //res.projectdesc = $scope.listalltask[i].projectdesc;
        //            //for (var j = 0; j < $scope.listalltask[i].listtask.length; j++) {
        //            //    $scope.listalltask[i].listtask[j].listtarget = JSON.stringify($scope.listalltask[i].listtask[j].listtarget);
        //            //}
        //            // res.listtask = JSON.stringify($scope.listalltask[i].listtask);
        //            tempArray.push(res);
        //        }
        //        obj.listinputs = tempArray;
        //        materials.showSpinner();
        //        var result = service.serverPost(config.url_bulktarget, addobj, "", obj)
        //        result.then(function (resolve) {
                    
        //            materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
        //            materials.hideSpinner();
        //            $rootScope.$emit("loadtarget", null);
        //            $uibModalInstance.dismiss("cancel");
        //        }, function (reject) {

        //        });
        //    //}
        //    //else {
        //    //    alert("Select Task")
        //    //}
        //}


        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        //  $scope.selectedItemChange = selectedItemChange;
        
        function querySearch(query, column) {
            var key = 'list' + column;
            var keyname = column == "task" ? "tasktitle" : column;
            var results = query ? $scope[key].filter(createFilter(query, keyname)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        //function selectedItemChange(item, column) {
        //    selectedId = item.id;
        //    eval('getAll' + column + '(' + item.id + ')');
        //}

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

     

      
       

    }
})();


