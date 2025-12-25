(function () {
    'use strict';

    angular.module('app.table').controller('UserProjectImageReportCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'reportModel', 'commonModel', 'targetModel', UserProjectImageReportCtrl]);

    function UserProjectImageReportCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, reportModel,commonModel,targetModel) {

        var original;
        var init;
        var splitstring;
        $scope.listusertype = [{ id: 0, name: "All" }, { id: 2, name: "Agency" }, { id: 3, name: "ISP" }];
        $scope.listproject = [];
        $scope.listtask = [];
        $scope.listtarget = [];
        $scope.listuser = [];

        $scope.taskreport = {};
        $scope.taskreport.fromdate = new Date();
        $scope.taskreport.todate = new Date();
        $scope.taskreport.projectid = null;
        $scope.taskreport.taskid = null;
        $scope.taskreport.targetid = null;
        $scope.taskreport.auditby = null;
        $scope.taskreport.paidby = null;
        $scope.taskreport.usertypeid = 0;      
        $scope.taskreport.clientid = sessionStorage.clientid != '' ? sessionStorage.clientid : null;  
        $scope.resultData = [];
        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageresultData = $scope.filteredresultData.slice(start, end);
        };

        function onFilterChange() {
            $scope.select(1);
            $scope.getColumns();
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

        function getColumns(){
            var obj = $scope.filteredresultData[0];
            $scope.currentPageColumns =  Object.keys(obj).filter(function(key) {
                if (obj.hasOwnProperty(key) && typeof key == 'string') {
                    return key;
                }
            });
            $scope.cols = $scope.currentPageColumns;
            $scope.colstitle = $scope.currentPageColumns;
        }

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
        $scope.getColumns = getColumns;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.numPerPageOpt = [15, 25, 50, 100];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];


        function loadproject() {
            debugger;
            var obj = {};
            var result = service.serverPost(config.urlGetProjectDD, "", "", obj);
            result.then(function (resolve) {
                $scope.listproject = resolve.ResponseData;
            }, function (reject) {

            });
        }
        loadproject();


        $scope.loadtask = function (projectid) {
            debugger;
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGettaskDD, reportModel.taskprocesstask, "", obj);
            result.then(function (resolve) {
                $scope.listtask = resolve.ResponseData;
            }, function (reject) {

            });
        }

        function loadtarget(name) {
            debugger;
            var obj = {};
            obj.targetName = name;
            obj.stateid = 0;
            obj.cityid = 0;
            obj.start = 1;
            obj.end = 200;            
            obj.clientid = 0;           
            var result = service.serverPost(config.urlGetTargetDD, targetModel.load_target, "", obj)
            result.then(function (resolve) {
                $scope.listtarget = resolve.ResponseData;
            }, function (reject) {

            });
        }
        loadtarget();

        function getAllppmsuser(selectedId) {
            debugger
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetPpmsuser, reportModel.ppmsuser, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listuser = resolve.ResponseData;

            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getAllppmsuser();

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = reportModel.invoicereportddlist;

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
                if (valParam.length == 2) {
                    keyParam = valParam[0];
                    obj['u_' + valParam[1]] = "TC";
                }
                else if (valParam.length == 3) {
                    keyParam = valParam[0];
                    obj['u_' + valParam[1]] = id;
                    obj['u_' + valParam[2]] = "0";
                }
                else if (valParam.length == 4) {
                    keyParam = valParam[0];
                    obj['u_' + valParam[1]] = 0;
                    obj['u_' + valParam[2]] = 0;
                    obj['u_' + valParam[3]] = 0;
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {


                    if(sessionStorage.clientid != '' && resolve.input == 'client')
                        $scope['list' + resolve.input] = $filter('filter')(resolve.ResponseData,{id:sessionStorage.clientid});
                    else
                        $scope['list' + resolve.input] = resolve.ResponseData;



                }, function (reject) {
                    //  alert("Samp");
                });
            }
        }
        $scope.loadDropDown(0, '');


        $scope.runReport = function () {
            debugger;
            materials.showSpinner();
            var obj = {};
            obj.fromdate = $scope.taskreport.fromdate;
            obj.todate = $scope.taskreport.todate;
            obj.clientid = $scope.taskreport.clientid == undefined ? 0 : $scope.taskreport.clientid;
            obj.projectid = $scope.taskreport.projectid == undefined ? 0 : $scope.taskreport.projectid;
            obj.taskid = $scope.taskreport.taskid == undefined ? 0 : $scope.taskreport.taskid;
            obj.targetid = $scope.taskreport.targetid == undefined ? 0 : $scope.taskreport.targetid;
            obj.usertypeid = $scope.taskreport.usertypeid == undefined ? 0 : $scope.taskreport.usertypeid;
            
            var result = service.serverPost(config.url_report_user_project_image, reportModel.userprojectrunReport, "", obj);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                splitstring();
                materials.hideSpinner();
                init();
            }, function (reject) {

            });
        }
        $scope.filePath = config.filPath;
        splitstring = function() {
            $scope.resultData .forEach(function (val) {
                if(val['Execution Photo Link'] != null){
                    val['Execution Photo Link'] = val['Execution Photo Link'].split(',');
                    for (var i=0;i < val['Execution Photo Link'].length; i++){
                        val['Execution Photo Link'][i] = config.filPath + val['Execution Photo Link'][i];
                    }
                    val['Execution Photo Link'] = splitImageList(val['Execution Photo Link'], 4)
                    val.photoUrls = [];
                }
            });
        };

        function splitImageList(data, size) {            
            var result = [];
            while (data.length) {
                result.push(data.splice(0, size));
            }
            return result;
        }

        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        $scope.simulateQuery = false;

        $scope.isDisabled = false;

        $scope.querySearch = querySearch;

        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column) {
            if(column == "target")
                loadtarget(query);
            var key = 'list' + column;
            var val = column == "task" ? "tasktitle" : column + 'name';
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
            debugger;
            $scope.taskreport.projectid = $scope.selectedprojectitem != undefined ? $scope.selectedprojectitem.id : 0;
            $scope.taskreport.taskid = $scope.selectedtaskitem != undefined ? $scope.selectedtaskitem.id : 0;
            $scope.taskreport.targetid = $scope.selectedtargetitem != undefined ? $scope.selectedtargetitem.id : 0;
            $scope.taskreport.auditby = $scope.selecteduseritem != undefined ? $scope.selecteduseritem.id : 0;
            $scope.taskreport.paidby = $scope.selectedpaiditem != undefined ? $scope.selectedpaiditem.id : 0;
            
            if (flag == "P") {
                $scope.loadtask($scope.taskreport.projectid);
            }
        }


        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }


        $scope.exportData = function () {

            var blob = new Blob([document.getElementById("gridviewreport").innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "taskreport.xls");
        };  
        $scope.FilePath = config.filepath;
        $scope.logo = "logo.png";

        function isnull(_val) {
            return _val != null && _val != undefined ? _val : "";
        }

        $scope.Imagegenerate = function (reporttype) {
            materials.showSpinner();
            var logoPath = config.filPath + "logo.png";
            var barlogo = config.filPath + "barlogo.png";
            var obj = {};
            obj.task = "task";
            obj.reporttype = reporttype;
            obj.listinputs = [];
            
            $scope.selected_target.forEach(function (target){
                var listtarget = {};
                listtarget.client = target.client;
                listtarget.projectname = target["Project Name"];
                listtarget.taskid = target.taskid;
                listtarget.task = target.Task;
                listtarget.targetid = target.targetid;
                listtarget.targetname = target["Target Name"];
                listtarget.executiondate = target["Execution Date"];
                listtarget.photoUrls = target['photoUrls'].join(',');
                obj.listinputs.push(listtarget);
            });
            var result = service.serverPost(config.url_pdfgenerate, reportModel.userprojectimagerunReport, "", obj);
            result.then(function (resolve) {
            materials.hideSpinner();
            var resultData = resolve.ResponseData; 
            var filename = resultData.split('\\')[2]; 
            $scope.selected_target = [];
            var path = config.filPath + resultData;
            var a = document.createElement('a');
            a.href = path;
            a.download = filename; 
            document.body.appendChild(a);
            a.style.display = 'none';
            a.click();
            a.remove();
            // fetch(path)
            // .then(res => res.blob()) // Gets the response and returns it as a blob
            // .then(blob => {
            //     var a = document.createElement('a');
            //     a.href  = URL.createObjectURL(blob);
            //     a.download = filename;
            //     document.body.appendChild(a);
            //     a.style = 'display: none';
            //     a.click();
            //     a.remove();
            // });           
            }, function (reject) {

            });

            //setTimeout(function () { newWin.close(); }, 1000);
            return true;

        }

        function converdat(d) {

            var dat = d.getDate().toString();
            var month = (d.getMonth() + 1).toString();
            var rdate = (dat.length == 2 ? dat : "0" + dat) + "/" + (month.length == 2 ? month : "0" + month) + "/" + d.getFullYear().toString();
            return rdate;
        }       


        function toObject(arr, arrlength) {

            var arriobj = [];
            // for (var p = 0; p < arrlength; p++) {
            //     arriobj.push(p == arrlength - 1 ? arr : "");
            // }
            arriobj.push(arr);
            return arriobj;
        }

        $scope.exceller = function () {

            $scope.fileName = "User Project Detail Report";
            $scope.exportData = [];
            var headtitle = "User Project Detail Report";
            var headtitlefrom = "From Date " + ":" + materials.date_MMDDYYYY(new Date($scope.taskreport.fromdate));
            var headtitleto = "To Date" + ":" + materials.date_MMDDYYYY(new Date($scope.taskreport.todate));
            $scope.exportData.push(toObject(headtitle, $scope.cols.length));
            $scope.exportData.push(toObject(headtitlefrom, $scope.cols.length));
            $scope.exportData.push(toObject(headtitleto, $scope.cols.length));
            $scope.exportData.push(toObject("", $scope.cols.length));

            $scope.exportData.push($scope.cols);
            for (var n = 0; n < $scope.resultdata.length; n++) {
                var selectdData = [];
                var selectObjec = $scope.resultdata[n];
                for (var m = 0; m < $scope.colstitle.length; m++) {
                    for (var key in selectObjec) {
                        if (key === $scope.colstitle[m]) {
                            switch (key) {
                                //case "customername":
                                //    var _val = selectObjec[key];
                                //    _val = _val + "-" + selectObjec["mobileno"];
                                //    selectdData.push(_val);
                                //    break;
                                case "invoicedate":
                                case "auditdate":
                                case "paiddate":
                                    var _val = selectObjec[key] != null ? materials.stockconvertdatetime(new Date(selectObjec[key]), "D") : "";
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
                    for (var C = 0; C != data[R].length; ++C) 
                    {
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

        $scope.items_target = [];
        $scope.selected_target = [];
        $scope.isIndeterminate = function (selected, items) {
            // return ($scope.selected.length !== 0 && $scope.selected.length !== $scope.items.length);
             return (selected.length !== 0 && selected.length !== items.length);
         };
 
 
         $scope.isChecked = function () {
             return $scope.selected_target.length === $scope.filteredresultData.length;             
         };

         
         $scope.exists = function (item, itemdata, status) {
            var index = $scope.selected_target.find(items => items.photoUrls.indexOf(item) > -1);
            
            return index == undefined? false:true;           
        };

        $scope.toggle_target = function (item,itemdata) {          
            var project = [],task=[],target=[],image = undefined,idx = undefined;   
            project.push($scope.selected_target.find(items => ((items['Project Name'] === itemdata['Project Name']) && (items.Task === itemdata.Task) && (items['Target Name'] === itemdata['Target Name']))));
            if(project[0] != undefined){
                task.push(project.find(items => items.Task === itemdata.Task));
                if(task[0] != undefined) {   
                    target.push(task.find(items => items['Target Name'] === itemdata['Target Name']));
                    if(target[0] != undefined){                       
                        image = $scope.selected_target.find(items => items.photoUrls.indexOf(item) > -1);
                        if(image == undefined){
                           var index = $scope.selected_target.indexOf(target[0]);
                           return $scope.selected_target[index].photoUrls.push(item);
                        }
                        else{
                            var index = $scope.selected_target.indexOf(target[0]);
                            var idx = image.photoUrls.indexOf(item);
                            return $scope.selected_target[index].photoUrls.splice(idx, 1);
                        }
                    }
                }     
            }
            var image = $scope.selected_target.find(items => items.photoUrls.indexOf(item) > -1);
            idx = $scope.selected_target.indexOf(image);
           
            if (idx > -1) {
                return $scope.selected_target.splice(idx, 1);
            }
            else {
                var data = angular.copy(itemdata);
                data.photoUrls.push(item);
                return $scope.selected_target.push(data);
            }
        };

        $scope.toggleAll = function (status) {
            if($scope.selected_target.length == 0){
                $scope.filteredresultData.forEach(function(result){
                    result['Execution Photo Link'].forEach(function(rowData){
                        rowData.forEach(function(row){                            
                            result.photoUrls.push(row);                            
                        })
                    })
                    $scope.selected_target.push(result);
                });
             }
             else
                $scope.selected_target = [];                                 
        };
    }
})();


