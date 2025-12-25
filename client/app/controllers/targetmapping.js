(function () {
    'use strict';

    angular.module('app.table')
        .controller('TargetMappingCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'targetModel', 'commonModel', TargetMappingCtrl]);

    function TargetMappingCtrl($q,$rootScope, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, targetModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.target = targetModel.add;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(27);

        var projectid = 0, clientid = 0, stateid = 0, cityid = 0, areaid = 0,start=0,end=10;
        $scope.listtarget = [];
        $scope.listalltarget = [];
        $scope.listtask = [];
        $scope.listallcity = [];
        $scope.listallarea = [];
        $scope.items = [];
        $scope.selected = [];
        $scope.items_target = [];
        $scope.selected_target = [];
        $scope.projectid = null;
        $scope.stateid = 0;
        $scope.cityid = 0;
        $scope.searchTargetName = '';
        $scope.isshow = {};
        $scope.isshow.alltask = false;
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
                        getAllTarget(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.loadtasktarget = function (taskid, projectid) {
            debugger;
            $scope.selected = [];
            $scope.projectid = projectid;
           // $scope.items_target = [];
            $scope.selected.push(taskid);
            $scope.loadtask(projectid, false, taskid, true);
            getAllTargetapping(taskid);
           // $scope.loadDropDown(rowData.stateid, 'stateid',"1");
            //$scope.loadDropDown(rowData.cityid, 'cityid', "1");
           
           // $scope.target = angular.copy(rowData);
           // original = angular.copy($scope.target);
            $scope.show = 2;
        }

        $scope.removeval = function () {
            $scope.listcity = [];
            $scope.listarea = [];
            $scope.show = 1;
        }
        
        $scope.revert = function () {
           
            $scope.listtarget = []; 
            $scope.target = "";
            $scope.selected = [];
            // $scope.projectid = null;
            // $scope.stateid = null;
            $scope.isshow.alltask = false;
            $scope.selected_target = [];
            $scope.listtask = [];
            $scope.show = 2;
            $scope.loadDropDown(0, '', "0");
            // $scope.material_login_form.$setPristine();
            // $scope.material_login_form.$setUntouched();
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
            $scope.target = "";
            $scope.selected = [];
            $scope.projectid = null;
            $scope.stateid = null;
            $scope.isshow.alltask = false;
            $scope.selected_target = [];
            $scope.listtask = [];
            $scope.show = 2;            
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

        function searchTarget(name) {
            // $scope.filteredresultData = $filter('filter')($scope.resultData, $scope.searchKeywords);
            // return $scope.onFilterChange();
            loadtarget(name);
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
        $scope.searchTarget = searchTarget;
        $scope.order = order;
        $scope.numPerPageOpt = [50, 200, 500, 1000];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        
        // getAllTarget(0);

        $scope.loadtask = function (projectid, isshowalltask, taskid,isedit) {
            debugger;
            $scope.items = [];
            if (!isedit) {
                $scope.selected = [];
                $scope.selected_target = [];
            }
            var project = $filter('filter')($scope.listproject, function (value) {
                return value.id == projectid;
            })[0];
            $scope.clientid = project.clientid;
            var obj = {};
            obj.projectid = projectid;
            // obj.flag = isshowalltask == true ? "A" : "N";
            obj.flag = "A";
            obj.taskid = taskid;
            var result = service.serverPost(config.urlgetnotmappingtask, targetModel.searchall_task, "", obj)
            result.then(function (resolve) {
                $scope.listtask = resolve.ResponseData;
                for (var i = 0; i < $scope.listtask.length; i++) {
                    $scope.items.push($scope.listtask[i].id);
                }
                //loadtarget("");
            }, function (reject) {
                alert('Not Resolved')
            });
        }

       // loadtask();
        function loadtarget(name) {
            debugger;
            $scope.items_target = [];
            var obj = {};
            obj.id = 0;
            // obj.flag = flag;
            obj.targetName = name;
            obj.stateid = $scope.stateid;
            obj.cityid = $scope.cityid;
            obj.clientid = $scope.clientid;
            obj.start = start;
            obj.end = end;
            obj.active = "ALL";
            var result = service.serverPost(config.urlGetTargetDD, targetModel.load_target, "", obj)
            result.then(function (resolve) {
                $scope.listtarget = resolve.ResponseData;
                if($scope.listtarget.length){
                    for (var i = 0; i < $scope.listtarget.length; i++) {
                        $scope.items_target.push($scope.listtarget[i]);
                        $scope.listtarget[i].isDisabled = false;
                    }
                    for (var i = 0; i < $scope.selected_target.length; i++) {
                        for (var j = 0; j < $scope.listtarget.length; j++) {
                            if ($scope.listtarget[j].id == $scope.selected_target[i].id) {
                                if ($scope.selected_target[i].iscompleted==1) {
                                    $scope.listtarget[j].isDisabled = true;
                                }
                            }
                        }
                    }
                }else
                    alert('No Target')
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        //loadtarget('T');

        $scope.loadalltarget = function (_flag) {
            loadtarget(_flag);
        }

        function loadgrid(projectid, clientid) {
            debugger;
            var obj = {};
            obj.projectid = projectid;
            obj.clientid = clientid;
            //obj.stateid = stateid;
            //obj.cityid = cityid;
            //obj.areaid = areaid;

            var result = service.serverPost(config.urlGetTargetgrid, targetModel.grid_searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadgrid(projectid, clientid)

        function getAllTarget(taskid,isdownload) {
            debugger;
            var obj = {};
            obj.taskid = taskid;
            var result = service.serverPost(config.urlGetTargetbytask, targetModel.searchall_bytask, "", obj)
            result.then(function (resolve) {
                if (isdownload) {
                    $scope.exceller(resolve.ResponseData);
                }
                else {
                    $scope.listalltarget = resolve.ResponseData;
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.cols = ["Target", "State", "City", "Area"];
        $scope.colstitle = ["targetname", "statename", "cityname", "areaname"];


        function toObject(arr, arrlength) {

            var arriobj = [];
            for (var p = 0; p < arrlength; p++) {
                arriobj.push(p == arrlength - 1 ? arr : "");
            }
            return arriobj;
        }

        $scope.exceller = function (listtarget) {
            debugger;
            $scope.fileName = "Task Target Mapping";
            $scope.exportData = [];
            $scope.exportData.push($scope.cols);
            for (var n = 0; n < listtarget.length; n++) {
                var selectdData = [];
                var selectObjec = listtarget[n];
                for (var m = 0; m < $scope.colstitle.length; m++) {
                    for (var key in selectObjec) {
                        if (key === $scope.colstitle[m]) {
                            selectdData.push(selectObjec[key]);
                        }
                    }
                }
                $scope.exportData.push(selectdData);
            }
            service.exceldownload($scope.fileName,$scope.exportData);
        }

        $scope.exceldownload = function () {
            function datenum(v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            };

            function getSheet(data, opts) {
                var ws = {};
                var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = { v: data[R][C] };
                        if (cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';

                        ws[cell_ref] = cell;
                    }
                }
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            };

            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            var wb = new Workbook(), ws = getSheet($scope.exportData);
            /* add worksheet to workbook */
            wb.SheetNames.push($scope.fileName);
            wb.Sheets[$scope.fileName] = ws;
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), $scope.fileName + '.xlsx');

        };

        function getAllTargetapping(taskid) {
            debugger;
            var obj = {};
            obj.taskid = taskid;
            $scope.selected_target = [];

            for (var j = 0; j < $scope.listtarget.length; j++) {
                $scope.listtarget[j].isDisabled = false;
            }


            var result = service.serverPost(config.urlGetAllTasktargetmapping, targetModel.searchall_bytask, "", obj)
            result.then(function (resolve) {
                var oResult = resolve.ResponseData;
                for (var i = 0; i < oResult.length; i++) {

                    for (var j = 0; j < $scope.listtarget.length; j++) {
                        if ($scope.listtarget[j].id == oResult[i].targetid) {
                            if (oResult[i].iscompleted==1) {
                                $scope.listtarget[j].isDisabled = true;
                            }
                        }
                    }
                    oResult[i].Target.iscompleted = 1;
                    $scope.selected_target.push(oResult[i].Target);
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.expandSelected = function (row) {
            debugger;
            $scope.listalltarget = [];
            $scope.currentPageresultData.forEach(function (val) {
                val.expanded = false;
            })
            debugger;
            row.expanded = true;
            getAllTarget(row.taskid);
        }

        $scope.getprojecttarget = function (row) {
            debugger;
            getAllTarget(row.taskid,true);
        }


        // $rootScope.$on('loadtarget', function (event, args) {
        //     debugger;
        //     getAllTarget(selectedId)
        // });

        $scope.saveTargetmapping = function () {

            debugger;
            var list = $scope.selected;
            var list1 = $scope.selected_target;
            var lstInputs = [];

            var obj = {};
            obj.taskid = $scope.selected.join(",");
            obj.lstInputs = [];

            for (var i = 0; i < list1.length; i++) {
                var newobj = {};
                newobj.targetid = list1[i].id;
                lstInputs.push(newobj);
            }
            obj.listinputs = lstInputs;
            materials.showSpinner();
            var result = service.serverPost(config.urlSaveTasktargetmapping, targetModel.task_target_mapping, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                materials.displayToast(appConstants.successClass, "Task & Target Mapped" + ' ' + appConstants.saveMsg);
                $scope.selected = [];
                $scope.selected_target = [];
                $scope.isshow.alltask = true;
                $scope.show = 1;
                $scope.loadtask($scope.projectid, false, 0);
               // loadgrid(projectid, clientid)
               
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId, "1");
        }

        $scope.loadDropDown = function (id, varId,loadstatus) {
            debugger;
            var ddlistModel = targetModel.ddlist_mapping;

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
                if(varId == "stateid"){
                    $scope.stateid = id;
                    $scope.cityid = 0;
                }
                if(varId == "cityid")
                    $scope.cityid = id;
                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    debugger;
                    $scope['list' + resolve.input] = resolve.ResponseData;
                    if($scope.stateid != 0 && $scope.stateid != null){
                        loadtarget("")
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
            var keyname = column == "city" ? "listall" : (column == "area" ? "listall" : 'list');
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
            debugger;
            projectid = $scope.selectedproject != undefined ? $scope.selectedproject.id : 0;
            clientid = $scope.selectedclient != undefined ? $scope.selectedclient.id : 0;
            stateid = $scope.selectedstate != undefined ? $scope.selectedstate.id : 0;
            cityid = $scope.selectedcity != undefined ? $scope.selectedcity.id : 0;
            areaid = $scope.selectedarea != undefined ? $scope.selectedarea.id : 0;

            if (column == "S") {
                $scope.loadDropDown(stateid, 'stateid', "2");
            }
            else if (column == "C") {
                $scope.loadDropDown(cityid, 'cityid', "2");
            }

            
            

            loadgrid(projectid, clientid)

            // selectedId = item.id;
            // eval('getAll' + column + '(' + item.id + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }


      

        $scope.toggle = function (item, list) {
            debugger;
            var idx = $scope.selected.indexOf(item);
            if (idx > -1) {
                $scope.selected.splice(idx, 1);
            }
            else {
                $scope.selected.push(item);
            }
            var taskid = $scope.selected.length > 0 ? $scope.selected.join(",") : 0;
            getAllTargetapping(taskid);
        };

        $scope.toggle_target = function (item, list) {

            var idx = $scope.selected_target.indexOf(item);
            if (idx > -1) {
                $scope.selected_target.splice(idx, 1);
            }
            else {
                $scope.selected_target.push(item);
            }
        };

        $scope.exists = function (item, list, status) {
            if (status == "TASK") {
                return $scope.selected.indexOf(item) > -1;
            }
            else {
                return $scope.selected_target.indexOf(item) > -1;
            }
            
        };

        $scope.isIndeterminate = function (selected, items) {
           // return ($scope.selected.length !== 0 && $scope.selected.length !== $scope.items.length);
            return (selected.length !== 0 && selected.length !== items.length);
        };


        $scope.isChecked = function (selected, items) {
            //return $scope.selected.length === $scope.items.length;
            return selected.length === items.length;
        };

        $scope.toggleAll = function (status) {
            if (status == "TASK") {
                if ($scope.selected.length === $scope.items.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.items.slice(0);
                }
            }
            else {
                if ($scope.selected_target.length === $scope.items_target.length) {
                    $scope.selected_target = [];
                } else if ($scope.selected_target.length === 0 || $scope.selected_target.length > 0) {
                    $scope.selected_target = $scope.items_target.slice(0);
                }
            }
            
        };

    }


   
})();


