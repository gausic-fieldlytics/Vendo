(function () {
    'use strict';

    angular.module('app.table').controller('InvoiceReportCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'reportModel', 'commonModel', InvoiceReportCtrl]);

    function InvoiceReportCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, reportModel, commonModel) {

        var original;
        var init;
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

        function loadtarget() {
            debugger;
            var obj = {};
            var result = service.serverPost(config.urlGetTargetDD, "", "", obj);
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

            obj.projectid = $scope.taskreport.projectid == undefined ? 0 : $scope.taskreport.projectid;
            obj.taskid = $scope.taskreport.taskid == undefined ? 0 : $scope.taskreport.taskid;
            obj.targetid = $scope.taskreport.targetid == undefined ? 0 : $scope.taskreport.targetid;
            obj.auditby = $scope.taskreport.auditby == undefined ? 0 : $scope.taskreport.auditby;
            obj.paidby = $scope.taskreport.paidby == undefined ? 0 : $scope.taskreport.paidby;
            obj.usertypeid = $scope.taskreport.usertypeid == undefined ? 0 : $scope.taskreport.usertypeid;
            
            var result = service.serverPost(config.url_report_invoice, reportModel.invoicerunReport, "", obj);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {

            });
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

          '<tr >' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Invoice No</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Request By</th>' +

            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Request At</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Audit By</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Audit Date</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">Paid By</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;"> Paid Date</th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;"> Paid Amount </th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;"> Payment Mode </th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;"> Payment Ref </th>' +
            '<th style="border-bottom: 1px solid #ddd;font-size: 16px;"> Payment Des </th>' +
            '</tr>';

            for (var k = 0; k < $scope.currentPageresultData.length; k++) {
                var n = (k + 1) < 10 ? '0' + (k + 1) : (k + 1);
                var invoicedate = $scope.currentPageresultData[k].invoicedate != null ? materials.stockconvertdatetime(new Date($scope.currentPageresultData[k].invoicedate), "D") : "";
                var auditdate = $scope.currentPageresultData[k].auditdate != null ? materials.stockconvertdatetime(new Date($scope.currentPageresultData[k].auditdate), "D") : "";
                var paiddate = $scope.currentPageresultData[k].paiddate != null ? materials.stockconvertdatetime(new Date($scope.currentPageresultData[k].paiddate), "D") : "";

                body += '<tr>' +
                //'<td style="border-bottom: 1px solid #ddd;">' + n + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].invoiceno + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].username + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + invoicedate + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].auditusername + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + auditdate + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].paidusername + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + paiddate + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].paidamount + '</td>' +
                 '<td style="border-bottom: 1px solid #ddd;">' + $scope.currentPageresultData[k].paymentmodename + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.currentPageresultData[k].paymentref) + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.currentPageresultData[k].paymentdesc) + '</td>' +
                '</tr>';
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

        $scope.cols = ["Invoice No", "Request By", "Request At", "Audit By", "Audit Date", "Paid By", "Paid At", "Paid Amount", "Payment Mode", "Payment Ref", "Payment Des"];
        $scope.colstitle = ["invoiceno", "username", "invoicedate", "auditusername", "auditdate", "paidusername", "paiddate", "paidamount", "paymentmodename", "paymentref", "paymentdesc"];


        function toObject(arr, arrlength) {

            var arriobj = [];
            for (var p = 0; p < arrlength; p++) {
                arriobj.push(p == arrlength - 1 ? arr : "");
            }
            return arriobj;
        }

        $scope.exceller = function () {

            $scope.fileName = "Invoice Report";
            $scope.exportData = [];
            var headtitle = "Invoice Report";
            var headtitlefrom = "From Date " + ":" + materials.date_MMDDYYYY(new Date($scope.taskreport.fromdate));
            var headtitleto = "To Date" + ":" + materials.date_MMDDYYYY(new Date($scope.taskreport.todate));
            $scope.exportData.push(toObject(headtitle, $scope.cols.length));
            $scope.exportData.push(toObject(headtitlefrom, $scope.cols.length));
            $scope.exportData.push(toObject(headtitleto, $scope.cols.length));
            $scope.exportData.push(toObject("", $scope.cols.length));

            $scope.exportData.push($scope.cols);
            for (var n = 0; n < $scope.currentPageresultData.length; n++) {
                var selectdData = [];
                var selectObjec = $scope.currentPageresultData[n];
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

        


    }
})();


