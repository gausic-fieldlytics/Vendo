(function () {
    'use strict';

    angular.module('app.table').controller('ProjectReportCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'reportModel', 'commonModel', ProjectReportCtrl]);

    function ProjectReportCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, reportModel, commonModel) {

        var original;
        var init;

        $scope.projectreport = {};
        $scope.projectreport.fromdate = new Date();
        $scope.projectreport.todate = new Date();
        $scope.projectreport.clientid = sessionStorage.clientid != '' ? sessionStorage.clientid : null;
        $scope.projectreport.statusid = null;

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

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = reportModel.projectreportddlist;

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
                    debugger;
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
            obj.fromdate = $scope.projectreport.fromdate;
            obj.todate = $scope.projectreport.todate;
            obj.statusid = $scope.projectreport.statusid == undefined ? 0 : $scope.projectreport.statusid;
            obj.clientid = $scope.projectreport.clientid == undefined ? 0 : $scope.projectreport.clientid;
            var result = service.serverPost(config.url_getprojectreport, reportModel.projectrunReport, "", obj);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                materials.showSpinner();
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
            var val = column == "client" ? "companyname" : column + 'name';
            var results = query ? $scope[key].filter(createFilter(query, val)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange() {
              $scope.projectreport.clientid = $scope.selectedclientitem != undefined ? $scope.selectedclientitem.id : 0;
            $scope.projectreport.statusid = $scope.selectedstatusitem != undefined ? $scope.selectedstatusitem.id : 0;
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
            saveAs(blob, "projectreport.xls");
        };
        $scope.FilePath = config.filepath;
        $scope.logo = "logo.png";

        function isnull(_val) {
            return _val != null && _val != undefined ? _val : "";
        }

        $scope.print = function (rowData) {

            var logoPath = config.filPath + config.urlpdfpath + "logo.png";
            var barlogo = config.filPath + config.urlpdfpath + "barlogo.png";

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

            '<h3 style="margin: 0px;color:#ece6ab;float:right">' + "Project Report" + '</h3>' + '<br />' + '<br />' +
             '<h4 style="margin: 0px;float:right">' + "From Date :" + converdat(new Date($scope.projectreport.fromdate)) + '</h4>' + '<br />' +
            '<h4 style="margin: 0px;float:right">' + "To Date :" + converdat(new Date($scope.projectreport.todate)) + '</h4>' + '<br />' +

            '<img style="padding-bottom:5px" src="' + barlogo + '" />' +

            '<div style="' + bodystyle + '">' +

            '<table class="printtable" style="width: 100%; text-align: center; font-weight: 600; font-size: 14px; line-height: 20px;  cellspacing="0" cellpadding="2">' +

          '<tr >';
            for (var a = 0; a < $scope.cols.length; a++) {
                    body += '<th style="border-bottom: 1px solid #ddd;font-size: 16px;">' + $scope.cols[a] + '</th>'
                }
            + '</tr>';

            for (var k = 0; k < $scope.filteredresultData.length; k++) {
                var n = (k + 1) < 10 ? '0' + (k + 1) : (k + 1);
                body += '<tr>' +
                //'<td style="border-bottom: 1px solid #ddd;">' + n + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.filteredresultData[k].projecttitle + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.filteredresultData[k].companyname + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + $scope.filteredresultData[k].projectstatusname  + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + materials.stockconvertdatetime(new Date($scope.filteredresultData[k].startdate), "D") + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + materials.stockconvertdatetime(new Date($scope.filteredresultData[k].enddate), "D") + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.filteredresultData[k].pon) + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.filteredresultData[k].pov) + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.filteredresultData[k].revenue) + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.filteredresultData[k].cost) + '</td>' +
                '<td style="border-bottom: 1px solid #ddd;">' + isnull($scope.filteredresultData[k].taskcount) + '</td>' +
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

        $scope.cols = [ "Project", "Client", "Status", "From", "TO", "PO #", "PO Value", "Revenue", "Cost", "Task Count"];
        $scope.colstitle = ["projecttitle", "companyname", "projectstatusname", "startdate", "enddate", "pon", "pov", "revenue", "cost", "taskcount"];
     

        function toObject(arr, arrlength) {
           
            var arriobj = [];
            // for (var p = 0; p < arrlength; p++) {
            //     arriobj.push(p == arrlength-1 ? arr : "");
            // }
            arriobj.push(arr);
            return arriobj;
        }

        $scope.exceller = function () {

            $scope.fileName = "Project Report";
            $scope.exportData = [];
            var headtitle = "Project Report";
            var headtitlefrom = "From Date " + ":" + materials.date_MMDDYYYY(new Date($scope.projectreport.fromdate));
            var headtitleto = "To Date" + ":" + materials.date_MMDDYYYY(new Date($scope.projectreport.todate));
            $scope.exportData.push(toObject(headtitle, $scope.cols.length));
            $scope.exportData.push(toObject(headtitlefrom, $scope.cols.length));
            $scope.exportData.push(toObject(headtitleto, $scope.cols.length));
            $scope.exportData.push(toObject("", $scope.cols.length));

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


