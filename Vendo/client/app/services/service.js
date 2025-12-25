(function () {

    angular
      .module('app.table')
      .service('service', service);

    service.$inject = ['$http', '$window', 'config', '$q', 'Upload', '$sessionStorage', '$filter'];

    function service($http, $window, config, $q, Upload, $sessionStorage, $filter) {
        var prefix = 'u_';
        var sin_quote = '\'';
        var ok = 'OK';
        var status = 'status';
        var createdat = 'createdat';
        var createdby = 'createdby';
        var modifiedat = 'modifiedat';
        var modifiedby = 'modifiedby';


        // Start Convert to UTC Time //
        converttoUTCDate = function (date) {
            var utcdate;
            if (date != null && date != undefined && date != "") {
                if (angular.isString(date)) {
                    date = new Date(date);
                }
                if (angular.isDate(date)) {
                    utcdate = date.toISOString().split('T');
                    utcdate = new Date(utcdate[0] + " " + utcdate[1].split('Z')[0]);
                }
                else utcdate = null;
            } else utcdate = null;

            return utcdate;
        };

        // Start Convert to Local Time //
        converttoLocalDate = function (date) {

            var localdate;
            if (date != null && date != undefined && date != "") {
                date = new Date(date);

                if (angular.isDate(date)) {

                    localdate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
                    localdate = $filter('date')(localdate, 'yyyy-MM-ddTHH:mm:ss');
                }
                else localdate = null;
            } else localdate = null;

            return localdate;
        }


        Date.prototype.toMSJSON = function () {
            var date = '/Date(' + this.getTime() + ')/';
            return date;
        };

        getFormattedDate = function (dt) {
            var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
            return dt1;
        };

        formPostData = function (model, audit, dataobject) {

            if (model == '') return null;
            var out;
            var outObj = new Object();
            var outQRR = new Array();

            if (model == '') return null;
            var out;
            var outObj = new Object();

            for (key in model) {
                if (key.indexOf("lstInputs") == -1 && key.indexOf("listinputs") == -1) {
                    //if (listdate.indexOf(key) != -1) {

                    //    outObj[prefix + model[key]] = (dataobject[key] == undefined ? null : getFormattedDate(new Date(dataobject[key])).toMSJSON());
                    //}
                    //else {
                    outObj[prefix + model[key]] = (dataobject[key] == undefined ? "" : dataobject[key]);
                    //}

                }
                else if (key.indexOf("listinputs") != -1) {
                    var outQRR = new Array();
                    for (keys in dataobject["listinputs"]) {
                        var outObj1 = new Object();
                        for (key1 in model["listinputs"][0]) {
                            outObj1[prefix + model["listinputs"][0][key1]] = (dataobject[key][keys][key1] == undefined ? "" : dataobject[key][keys][key1]);
                        }
                        outQRR.push(outObj1);
                    }
                    outObj.listinputs = outQRR;
                }
                else {
                    for (keys in dataobject[key]) {
                        debugger;

                        var outObj1 = new Object();
                        for (key1 in model[key][0]) {
                            var outQRR = new Array();
                            for (key2 in dataobject[key][0][key1]) {
                                var outObj2 = new Object();
                                for (key3 in model[key][0][key1][0]) {
                                    outObj2[prefix + key3] = (dataobject[key][keys][key1][key2][key3] == undefined ? null : dataobject[key][keys][key1][key2][key3]);
                                }
                                outQRR.push(outObj2);
                            }
                            outObj1[key1] = outQRR;
                        }
                    }
                    outObj[key] = outObj1;
                }
            }

            
            if (audit != "" && audit != undefined) {
                for (key in audit) {
                    switch (key) {
                        case status:
                            out = 1;
                            break;
                        case createdat:
                            out = getFormattedDate(new Date()).toMSJSON();
                            break;
                        case createdby:
                            //out = sessionStorage.UserId;
                            out = sessionStorage.userid;
                            break;
                        case modifiedat:
                            out = getFormattedDate(new Date()).toMSJSON();
                            break;
                        case modifiedby:
                            //out = sessionStorage.UserId;
                            out = sessionStorage.userid;
                            break;
                    }
                    outObj[prefix + audit[key]] = out;
                }
            }
            return outObj;
        }

        appendCommonParam = function (key) {

            switch (key) {
                case status:
                    return 1;
                    break;
                case createdat:
                    return getFormattedDate(new Date()).toMSJSON();
                    break;
                case createdby:
                    return sessionStorage.userid;
                    break;
                case modifiedat:
                    return getFormattedDate(new Date()).toMSJSON();
                    break;
                case modifiedby:
                    return sessionStorage.userid;
                    break;
                default:
                    return undefined;

            }
        }

        serverGet = function (url) {
            var deferred = $q.defer();
            if (url != "" && typeof (url) != undefined && url != null) {
                $http.post(config.serviceUrl + url)
                  .success(function (data) {
                      if (data.ResponseStatus == ok) {
                          data.Status = 1;
                          deferred.resolve(data);
                      }
                  })
                     .error(function (data) {
                         data.Status = -1;
                         deferred.reject(data);
                     });
                return deferred.promise;
            }
        };

        serverDDGet = function (url, input, obj) {


            var hotelmasterid = sessionStorage.hotelmasterid;

            var superAdmin = false;

            if (hotelmasterid == 0) {
                superAdmin = true;
            }

            for (key in obj) {
                if (sessionStorage.hotelmasterid != 0) {
                    if (key.indexOf(prefix + "hotelmasterid") > -1) {
                        obj[key] = superAdmin == true ? ((obj[key] == undefined || obj[key] == "0") ? "0" : obj[key]) : (hotelmasterid == null || hotelmasterid == "0" ? (obj[key] == undefined ? "0" : obj[key]) : hotelmasterid);
                    }
                }
            }

            var deferred = $q.defer();
            var data = input;
            if (url != "" && typeof (url) != undefined && url != null) {
                $http.post(config.serviceUrl + url, obj)
                  .success(function (data) {
                      if (data.ResponseStatus == ok) {
                          data.Status = 1;
                          data.input = input;
                          deferred.resolve(data);
                      }
                  })
                     .error(function (data) {
                         data.Status = -1;
                         deferred.reject(data);
                     });
                return deferred.promise;
            }
        };

        serverDDGetPMS = function (url, input, obj) {

            var deferred = $q.defer();
            var data = input;
            if (url != "" && typeof (url) != undefined && url != null) {
                $http.post(config.servicePMSUrl + url, obj)
                  .success(function (data) {
                      if (data.ResponseStatus == ok) {
                          data.Status = 1;
                          data.input = input;
                          deferred.resolve(data);
                      }
                  })
                     .error(function (data) {
                         data.Status = -1;
                         deferred.reject(data);
                     });
                return deferred.promise;
            }
        };

        function isDate(dateVal) {
            try {
                if (dateVal.getFullYear() == 1970 || dateVal.getFullYear() == NaN || dateVal == "Invalid Date") {
                    return false;
                }
                else {

                    var temp = dateVal.getFullYear();
                    if (dateVal instanceof Date) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (err) {
                return false;
            }
        }

        serverPost = function (url, model, audit, dataobject) {

            
            for (var name in dataobject) {

                if (name == dataobject[name]) {
                    dataobject[name] = null;
                }
                if (isDate(dataobject[name])) {

                    dataobject[name] = getFormattedDate(dataobject[name]).toMSJSON();
                }


            }

            var deferred = $q.defer();
            var data = formPostData(model, audit, dataobject);
            if (url != "" && typeof (url) != undefined && url != null) {
                console.log(data);
                $http.post(config.serviceUrl + url, data)
                .success(function (data) {
                    if (data.ResponseStatus == ok) {
                        data.Status = 1;
                        deferred.resolve(data);
                    }
                })
                .error(function (data) {
                    data.Status = -1;
                    deferred.reject(data);
                });
                return deferred.promise;
            }
            return -1;
        };

        serverDelete = function (url, model, audit, dataobject) {

            var deferred = $q.defer();
            var data = formPostData(model, audit, dataobject);
            if (url != "" && typeof (url) != undefined && url != null) {
                $http.post(config.serviceUrl + url, data)
                .success(function (data) {
                    if (data.ResponseStatus == ok) {
                        data.Status = 1;
                        deferred.resolve(data);
                    }
                })
                .error(function (data) {
                    data.Status = -1;
                    deferred.reject(data);
                });
                return deferred.promise;
            }
            return -1;
        };

        getMethodClient = function (url) {
            return $http.get(url);
        };

        filePost = function (url, file) {
            var deferred = $q.defer();
            if (url != "" && typeof (url) != undefined && url != null && file) {
                Upload.upload({
                    url: config.fileUrl + url,
                    method: "POST",
                    file: file
                }).success(function (data) {
                    if (data.ResponseStatus == ok) {
                        data.Status = 1;
                        deferred.resolve(data);
                    }
                }).error(function (resp) {
                    data.Status = -1;
                    deferred.reject(data);
                });
                return deferred.promise;
            }
            return -1;
        };

        //filePost = function (url, file) {

        //    var deferred = $q.defer();
        //    if (url != "" && typeof (url) != undefined && url != null && file) {
        //        Upload.upload({
        //            url: config.fileUrl + url,
        //            method: "POST",
        //            file: file
        //        }).success(function (data) {
        //            if (data.ResponseStatus == ok) {
        //                data.Status = 1;
        //                deferred.resolve(data);
        //            }
        //        }).error(function (resp) {
        //            data.Status = -1;
        //            deferred.reject(data);
        //        });
        //        return deferred.promise;
        //    }
        //    return -1;
        //};

        //Convert html table to csv file
        exportTableToCSV = function ($table, filename, Title) {



            var $rows = $table.find('tr:has(td),tr:has(th)'),

              // Temporary delimiter characters unlikely to be typed by keyboard
              // This is to avoid accidentally splitting the actual contents
              tmpColDelim = String.fromCharCode(11), // vertical tab character
              tmpRowDelim = String.fromCharCode(0), // null character

              // actual delimiter characters for CSV format
              colDelim = '","',
              rowDelim = '"\r\n"',
              // Grab text from table into CSV formatted string
              result = '"' + $rows.map(function (i, row) {
                  var $row = $(row),
                    $cols = $row.find('td:visible,th:visible');

                  return $cols.map(function (j, col) {
                      var $col = $(col),
                        text = $col.text().trim();

                      return text.replace(/"/g, '""'); // escape double quotes

                  }).get().join(tmpColDelim);

              }).get().join(tmpRowDelim)
              .split(tmpRowDelim).join(rowDelim)
              .split(tmpColDelim).join(colDelim) + '"',

              csv = Title + '\n' + result,

              // Data URI
              csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);



            if (window.navigator.msSaveBlob) { // IE 10+
                //alert('IE' + csv);


                window.navigator.msSaveOrOpenBlob(new Blob([csv], {
                    type: "text/plain;charset=utf-8;"
                }), "csvname.csv")
            }
            else {
                $(this).attr({
                    'download': filename,
                    'href': csvData,
                    'target': '_blank'
                });
            }
        }
        // This must be a hyperlink

        //Convert html table to csv file
        exportTableToPrint = function (divId, Title) {
            $("#" + divId).print({
                globalStyles: true,
                mediaPrint: false,
                stylesheet: null,
                noPrintSelector: ".no-print",
                iframe: true,
                append: null,
                prepend: null,
                manuallyCopyFormValues: true,
                deferred: $.Deferred(),
                timeout: 750,
                title: Title,
                doctype: '<!doctype html>'
            });

        }

        printjsonobject = function (thead, tbody, type, title) {
            $("#report").empty();
            var theadrow = "", tbodyrow = "";

            theadrow += "<tr ><th colspan=" + thead.length + " style='background: #848bc5;text-align: left;line-height: 20px; padding: 8px;" +
                "color:white;font-size:14px;'>" + title + "</th></tr>";

            angular.forEach(thead, function (th) {
                theadrow += '<th style="border: 1px solid #dddddd; text-align: left; padding: 8px; background: #eee;">' + th + '</th>';
            });
            angular.forEach(tbody, function (tr) {
                tbodyrow += '<tr>';
                angular.forEach(tr, function (td) {
                    td = (td == null) ? "" : td;
                    tbodyrow += '<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' + td + '</td>';
                });
                tbodyrow += '</tr>';
            });
            var htmlFormat =
                '<div style="font-size:12px;">' +
    '<table style="font-family: arial, sans-serif; border-collapse: collapse; width: 100%;font-size:12px;background:white">' +
        '<tr>' + theadrow + '</tr>' + tbodyrow +
    '</table>' +
'</div>';
            $("#report").append(htmlFormat);
            if (type == "pdf")
                exportDivToPrint('report', title)
            else if (type == "csv")
                exportDivToCSV('report', title);
        }


        exportDivToPrint = function (elem, title) {

            var mywindow = window.open('', 'PRINT', 'height=400,width=600');
            mywindow.document.write('<html><head>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(document.getElementById(elem).innerHTML);
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/

            mywindow.print();
            mywindow.close();
            return true;
        }
        exportDivToCSV = function (elem, title) {

            var blob = new Blob([document.getElementById(elem).innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, title + ".xls");
        }

        filterRecord = function (array, key, value, isString) {

            var result = $.grep(array, function (obj, index) {
                if (isString)
                    return obj[key].toLowerCase() == value.toLowerCase();
                else
                    return obj[key] == value;
            })[0];

            return result;

        }

        getlistaccountype = function () {
            return [
               {
                   "label": "Prepaid",
                   "value": 'PRE'
               },
                {
                    "label": "Postpaid",
                    "value": 'POST'
                }
            ];
        }

        getlistwithdrawalstatus = function () {
            return [
               {
                   "label": "Requested",
                   "value": '1'
               },
                {
                    "label": "Accepeted",
                    "value": '2'
                },
                 {
                     "label": "Rejected ",
                     "value": '3'
                 },
                   {
                       "label": "Transferred ",
                       "value": '4'
                   }
            ];
        }

        getwithdrawalstatusbyid = function (id) {

            switch (id) {
                case 1:
                    return "Requested";
                    break;
                case 2:
                    return "Accepeted";
                    break;
                case 3:
                    return "Rejected";
                    break;
                case 4:
                    return "Transferred";
                    break;
            }
        }

        converttoUTCDate = function (date) {

            var utcdate;
            if (date != null && date != undefined && date != "") {
                if (angular.isString(date)) {
                    date = new Date(date);
                }
                if (angular.isDate(date)) {
                    utcdate = date.toISOString().split('T');
                    utcdate = new Date(utcdate[0] + " " + utcdate[1].split('Z')[0]);
                }
                else utcdate = null;
            } else utcdate = null;

            return utcdate;
        }

        converttoLocalDate = function (date) {

            var localdate;
            if (date != null && date != undefined && date != "") {
                date = new Date(date);

                if (angular.isDate(date)) {

                    localdate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
                    localdate = $filter('date')(localdate, 'yyyy-MM-ddTHH:mm:ss');
                }
                else localdate = null;
            } else localdate = null;

            return localdate;
        }


        return {
            serverGet: serverGet,
            serverDDGet: serverDDGet,
            serverPost: serverPost,
            serverDelete: serverDelete,
            getMethodClient: getMethodClient,
            filePost: filePost,
            exportTableToCSV: exportTableToCSV,
            exportTableToPrint: exportTableToPrint,
            printjsonobject: printjsonobject,
            filterRecord: filterRecord,
            getlistaccountype: getlistaccountype,
            getlistwithdrawalstatus: getlistwithdrawalstatus,
            getwithdrawalstatusbyid: getwithdrawalstatusbyid,
            serverDDGetPMS: serverDDGetPMS,
            converttoUTCDate: converttoUTCDate,
            converttoLocalDate: converttoLocalDate
        };

    }
})();

