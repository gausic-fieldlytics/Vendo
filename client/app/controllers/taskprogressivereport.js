(function () {
    'use strict';

    angular.module('app.table').controller('TaskProgressiveReportCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'reportModel', 'commonModel', 'targetModel', TaskProgressiveReportCtrl]);

    function TaskProgressiveReportCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, reportModel,commonModel,targetModel) {

        var original;
        var init;
        var addimagePath;
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
            obj.clientid = 0;
            obj.end = 200;
            var result = service.serverPost(config.urlGetTargetDD, targetModel.load_target,"", obj);
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
            obj.auditby = $scope.taskreport.auditby == undefined ? 0 : $scope.taskreport.auditby;
            obj.paidby = $scope.taskreport.paidby == undefined ? 0 : $scope.taskreport.paidby;
            obj.usertypeid = $scope.taskreport.usertypeid == undefined ? 0 : $scope.taskreport.usertypeid;
            
            var result = service.serverPost(config.url_report_user_project_detail, reportModel.userprojectrunReport, "", obj);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                addimagePath();
                materials.hideSpinner();
                init();
            }, function (reject) {

            });
        }
        
        addimagePath = function() {
            $scope.resultData .forEach(function (val) {
                if(val['Execution Photo Link'] != null)
                    val['Execution Photo Link'] = config.filPath + val['Execution Photo Link'];
            });
        };

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

        $scope.print = function (rowData) {

            var logoPath = config.filepath + "logo.png";
            var barlogo = $scope.FilePath + "barlogo.png";

            var divToPrint = document.getElementById('DivIdToPrint');

            var newWin = window.open('', 'Print-Window');

            newWin.document.open();

            newWin.document.write('<html><body onload="window.print()">');

            var headerStyle = "color:black;background:white;margin:0px 0px 0px 0px;font-size:15px;border:1px solid black;border-bottom:0px";
            var bodystyle = "width: 100%;background:white;font-size:8px";


            var body =
                 '<div style="height: 100%; width: 100%; font-family: Arial;">' +
           '<div style="text-align: center; border-bottom: 0px;">' +
            '<div style="float:left;padding:10px;">' + '<img src="' + logoPath + '" style="max-height:90px;"  />' + '</div>' +

            '<h3 style="margin: 0px;color:#ece6ab;float:right">' + "Invoice Report" + '</h3>' + '<br />' + '<br />' +
             '<h4 style="margin: 0px;float:right">' + "From Date :" + converdat(new Date($scope.taskreport.fromdate)) + '</h4>' + '<br />' +
            '<h4 style="margin: 0px;float:right">' + "To Date :" + converdat(new Date($scope.taskreport.todate)) + '</h4>' + '<br />' +

            '<img style="padding-bottom:5px" src="' + barlogo + '" />' +

            '<div style="' + bodystyle + '">' +

            '<table class="printtable" style="width: 100%; text-align: center; font-weight: 600; font-size: 14px; line-height: 20px;  cellspacing="0" cellpadding="2">' +

           '<tr >';
             
            angular.forEach($scope.currentPageColumns, function(value, key){
                body += '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">'+value+'</th>' ;             
            });
            body += '</tr>';
            
            
            for (var k = 0; k < $scope.resultData.length; k++) {
                var n = (k + 1) < 10 ? '0' + (k + 1) : (k + 1);
                var invoice90date = $scope.resultData[k].invoicedate != null ? materials.stockconvertdatetime(new Date($scope.resultData[k].invoicedate), "D") : "";
                var auditdate = $scope.resultData[k].auditdate != null ? materials.stockconvertdatetime(new Date($scope.resultData[k].auditdate), "D") : "";
                var paiddate = $scope.resultData[k].paiddate != null ? materials.stockconvertdatetime(new Date($scope.resultData[k].paiddate), "D") : "";

                body += '<tr>';
                // for (var l = 0;  l < $scope.resultdata[k].length; l++) {
                //     body +='<td style="border-bottom: 1px solid #ddd;">' + $scope.resultdata[k][l] + '</td>' ;
                // }
                // $scope.resultdata[k].forEach(function(val){
                //     body +='<td style="border-bottom: 1px solid #ddd;">' + val + '</td>' ;
                // });
                for( var key in $scope.resultData[k]){
                    body +='<td style="border-bottom: 1px solid #ddd;">' + $scope.resultData[k][key] + '</td>' ;
                    // var myValue = $scope.resultdata[k][key];
                    // key will be your dynamically created keyname
                }
                body +='</tr>';
            }

            body += '</table>' +
            '</div>';



            newWin.document.write(body);

            newWin.document.write('</body></html>');

            newWin.document.close();

            setTimeout(function () { newWin.close(); }, 1000);
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
            for (var n = 0; n < $scope.resultData.length; n++) {
                var selectdData = [];
                var selectObjec = $scope.resultData[n];
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


    }
})();


