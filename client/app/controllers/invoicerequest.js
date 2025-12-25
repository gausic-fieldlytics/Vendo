(function () {
    'use strict';

    angular.module('app.table')
        .controller('InvoiceReqCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'invoiceReqModel', 'commonModel','reportModel', InvoiceReqCtrl]) 
    .controller('BulkPaymentCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', BulkPaymentCtrl]);

    function InvoiceReqCtrl($q, $rootScope, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, invoiceReqModel, commonModel,reportModel) {
        var selectedId = 0;
        var original;
        var init;
        this.task = invoiceReqModel.add;
        $scope.rate = 0;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(34);


        $scope.ddltarget = {};
        $scope.invoice = {};
        $scope.resultData = [];
        $scope.FilePath = config.filPath + config.urlpdfpath;
        $scope.items = [];
        $scope.selected = [];
        $scope.listallinvoice = [];

        
        $scope.balanceDue = function () {
            var paid = $scope.invoice.paidamt != undefined ? $scope.invoice.paidamt : 0;
            var penalty = $scope.invoice.penalty != undefined ? $scope.invoice.penalty : 0;
            return ($scope.invoice.balanceamount - (parseFloat(paid) + parseFloat(penalty)));
        }

        $scope.canSubmit = function () {
            return $scope.material_invoice_form.$valid && ($scope.balanceDue() > (-0.01));
           
        };


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
        $scope.showtaskdetail = true;
        $scope.showtaskstepsdetail = false;
        $scope.filepaths = config.filepath;

        $scope.isDefined = function (input) {
            return (!angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

        function loadtask(selectedId) {
            debugger;
            var obj = {};
            obj.projectid = selectedId;
            materials.showSpinner()
            var result = service.serverPost(config.urlGetInvoice, invoiceReqModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.resultData = resolve.ResponseData;
                $scope.listallinvoice = resolve.ResponseData;
                for (var i = 0; i < $scope.resultData.length; i++) {
                    $scope.items.push($scope.resultData[i]);
                }
                materials.hideSpinner();
                init();
            }, function (reject) {
                debugger;
                alert('Not Resolved')
            });
        }
        loadtask(0);

        $scope.loadtarget = function (rowData) {
            debugger;
            $scope.show = 2;
            $scope.invoice = angular.copy(rowData);
            $scope.invoice.isaccepted = true;
            $scope.invoice.paidstatusid = 5;
            $scope.invoice.penalty = 0;

            $scope.rate = 5;
            //$scope.ddltarget = rowData;
            //var obj = {};
            //obj.taskid = rowData.id;
            //var result = service.serverPost(config.urlGetTaskinvtarget, invoiceReqModel.target, "", obj)
            //result.then(function (resolve) {
            //    materials.hideSpinner();
            //    debugger;
            //    $scope.listtasktarget = resolve.ResponseData;
            //}, function (reject) {
            //    alert('Not Resolved')
            //});
        }

        $rootScope.$on('loadinvoice', function (event, args) {
            debugger;
            $scope.loadtarget($scope.ddltarget);
        });


        $rootScope.$on('loadinvoicereq', function (event, args) {

            loadtask(0);
        });

        $scope.calculateamt = function () {
            $scope.invoice.paidamt = $scope.invoice.balanceamount - ($scope.invoice.penalty != undefined ? $scope.invoice.penalty : 0);
        }


        $scope.savepayment = function (row) {
            debugger;
            materials.showSpinner();
            var obj = {};
            obj.id = $scope.invoice.id;


            //  obj.taskid = $scope.invoice.taskid;
            // obj.targetid = $scope.invoice.targetid;
            obj.requestuserid = $scope.invoice.workdoneby;
            obj.invoicepath = $scope.invoice.invoicepath;
            obj.paymentmodeid = $scope.invoice.paymentmodeid;


            obj.isaccepted = $scope.invoice.isaccepted == true || $scope.invoice.isaccepted == 1 ? 1 : 0;
            obj.rejectreason = $scope.invoice.rejectreason;
            obj.rejectedby = $scope.invoice.rejectedby;

            obj.paidstatusid = $scope.invoice.paidstatusid;
            var invoiceamt = $scope.invoice.totalamt != undefined ? $scope.invoice.totalamt : 0;
            var penaltyamt = $scope.invoice.penalty != undefined ? $scope.invoice.penalty : 0;
            // obj.totalamt = invoiceamt - penaltyamt;
            obj.totalamt = $scope.invoice.paidamt;
            
            obj.penalty = penaltyamt;
            obj.penaltyreason = penaltyamt != 0 ? $scope.invoice.penaltyreason:"";

            obj.userid = sessionStorage.userid;

            var mode = $.grep($scope.listpaymentmode, function (modeobj) {
                return modeobj.id == obj.paymentmodeid;
            })[0];

            var status = $.grep($scope.listpaymentstatus, function (statusobj) {
                return statusobj.id == obj.paidstatusid;
            })[0];

            obj.paymentmode = mode != undefined ? mode.paymentmodename : "";
            obj.paymentstatus = status != undefined ? status.paymentstatusname : "";
            obj.rating = $scope.rate != undefined ? $scope.rate : null;
            obj.paymentref = $scope.invoice.paymentref != undefined ? $scope.invoice.paymentref : null;
            obj.paymentdesc = $scope.invoice.paymentdesc != undefined ? $scope.invoice.paymentdesc : null;

           
            var result = service.serverPost(config.urlUpdateInvoice, invoiceReqModel.invoice_edit, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                materials.displayToast(appConstants.successClass, "Payment" + ' ' + appConstants.saveMsg);
                $scope.show = 1;
                loadtask(0);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = invoiceReqModel.ddlist;

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
        

        

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.projrctbytask = projrctbytask;
        $scope.selectedItemChangeTarget = selectedItemChangeTarget;
        /////Start Modal

        /////End Modal

        function querySearch(query, column) {
            
            var key = 'list' + column;
            if (column == "project")
                var results = query ? $scope[key].filter(createFilter(query, column + 'title')) : $scope[key], deferred;
            //else if (column == "target")
            //    var results = query ? $scope[key].filter(createFilter(query, column + 'title')) : $scope[key], deferred;
            else
                var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                if (column == "taskstatus")
                    $scope.searchText1 = undefined;
                else if (column == "project")
                    $scope.searchText = undefined;
                return results;
            }
        }
        function projrctbytask(project, columnn) {
            debugger;
            if (project != undefined) {
                getAllTaskbyid(project.id);
            }
            else {
                getTaskNoteDone(1);
                $scope.listtarget = {};
            }
                
        }

        function selectedItemChangeTarget(target, columnn) {
            debugger;
            if (target != undefined)
                getAllTargetbyproject(target.id);
            else
                getTaskNoteDone(1);
        }

        function selectedItemChange(item, column) {
           
            if (item != undefined) {
                selectedId = item.id;
                eval('getAll' + column + '(' + item.id + ')');
            }
            else
                getTaskNoteDone(1);


        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }


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

        $scope.cols = ["Agency", "User", "Invoice no", "Request Date", "Request Amount", "Accoount Holdername", "Bank", "Account Number", "Branch", "IFSC Code", "Paid Amount","Penalty", "Payment Ref no", "Payment Description"];
        $scope.colstitle = ["agencyname","firstname", "invoiceno", "invoicedate", "totalamt", "accholdername", "bankname", "accnumber", "branch", "ifsc"];
        
        $scope.downloadInvoice = function () {

            materials.showSpinner();            
            var obj = {};           
            obj.reporttype = "downloadinvoice";
            obj.listinputs = [];
            
            $scope.selected.forEach(function (target){
                var listtarget = {};                
                listtarget.invoiceno = target.invoiceno;
                listtarget.invoicepth = target.invoicepth;
                listtarget.username = target.agencyname != null ? target.agencyname : target.firstname;               
                obj.listinputs.push(listtarget);
            });
            var result = service.serverPost(config.url_pdfgenerate, invoiceReqModel.userprojectimagerunReport, "", obj);
            result.then(function (resolve) {
            materials.hideSpinner();
            var resultData = resolve.ResponseData; 
            var filename = resultData.split('\\')[2]; 
            $scope.selected_target = [];
            var path = config.filPath + resultData;
            fetch(path)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                var a = document.createElement('a');
                a.href  = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.style = 'display: none';
                a.click();
                a.remove();
            });           
            }, function (reject) {

            });

            //setTimeout(function () { newWin.close(); }, 1000);
            return true;
        };
        

        $scope.exceller = function () {
            debugger;
            $scope.fileName = "Invoice";
            $scope.exportData = [];

            $scope.exportData.push($scope.cols);
            for (var n = 0; n < $scope.currentPageresultData.length; n++) {

                var idx = $scope.items.indexOf($scope.currentPageresultData[n].id);
                if (idx > -1) {
                    var selectdData = [];
                    var selectObjec = $scope.currentPageresultData[n];
                    for (var m = 0; m < $scope.colstitle.length; m++) {
                        for (var key in selectObjec) {
                            if (key === $scope.colstitle[m]) {
                                switch (key) {
                                    case "invoicedate":
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
            }

            service.exceldownload($scope.fileName,$scope.exportData);
        }

        


        function handleFile(e) {

            $scope.isvalid = false;
            var _keyset = appConstants.BULK_PAYMENT_COL;
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
                                    newtarget.username = $scope.uploadedItems[m]["User"] != undefined ? $scope.uploadedItems[m]["User"] : null;
                                    newtarget.invoiceno = $scope.uploadedItems[m]["Invoice no"] != undefined ? $scope.uploadedItems[m]["Invoice no"] : null;
                                    newtarget.invoiceamt = $scope.uploadedItems[m]["Request Amount"] != undefined ? $scope.uploadedItems[m]["Request Amount"] : null;
                                    newtarget.paidamount = $scope.uploadedItems[m]["Paid Amount"] != undefined ? $scope.uploadedItems[m]["Paid Amount"] : null;
                                    newtarget.penalty = $scope.uploadedItems[m]["Penalty"] != undefined ? $scope.uploadedItems[m]["Penalty"] : null;
                                    newtarget.refno = $scope.uploadedItems[m]["Payment Ref no"] != undefined ? $scope.uploadedItems[m]["Payment Ref no"] : null;
                                    newtarget.description = $scope.uploadedItems[m]["Payment Description"] != undefined ? $scope.uploadedItems[m]["Payment Description"] : null;
                                    
                                    $scope.listalltask.push(newtarget);
                                }
                            }
                            else {
                                $scope.uploadedItems = [];
                                document.getElementById("files").value = "";
                                alert("Excel Format does not Match,Please check the column('User Name,Invoice No,Invoice Amount,Paid Amount,Payment Ref.no')");
                            }
                        }
                        else {
                        }
                        if (count == incount && $scope.isvalid) {
                            $scope.open('lg');
                        }
                        count++;
                    });
                    $scope.$apply();

                };
                reader.readAsArrayBuffer(f);
            }
        }
        $scope.listalltask = [];

        $scope.open = function (size) {

            var obj = {};
            obj.listallinvoice = $scope.listallinvoice;
            obj.listpayinvoice = $scope.listalltask;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'bulkpayment.html',
                controller: 'BulkPaymentCtrl',
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



    }

    function BulkPaymentCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {

        $scope.listpayment = [];
        $scope.listinvoice = [];

        $scope.listinvoice = items.listallinvoice;
        $scope.listpayment = items.listpayinvoice;

        $scope.publishdate = new Date();

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }

        var addobj = {
            "listinputs": [{
                "id": "id",
                "requestuserid": "requestuserid",
                "invoicepath": "invoicepath",
                "penalty":"penalty",
                "totalamt": "totalamt",
                "paymentref": "paymentref",
                "paymentdesc": "paymentdesc",
                "userid": "userid",
                "username": "username",
                "email": "email",
                "mobileno": "mobileno",
                "deviceid": "deviceid"
            }]
        };
       

        $scope.ok = function () {
            var obj = {};
            var tempArray = [];
            for (var i = 0; i < $scope.listpayment.length; i++) {
                var _invoice = $.grep($scope.listinvoice, function (modeobj) {
                    return modeobj.invoiceno == $scope.listpayment[i].invoiceno;
                })[0];
                if (_invoice != undefined) {
                    if (_invoice.id != null) {
                        var res = {};
                        res.id = _invoice.id;
                        res.requestuserid = _invoice.workdoneby;
                        res.invoicepath = _invoice.invoicepth;
                        res.totalamt = $scope.listpayment[i].paidamount;
                        res.penalty = $scope.listpayment[i].penalty != undefined ? $scope.listpayment[i].penalty : null;
                        
                        res.paymentref = $scope.listpayment[i].refno;
                        res.paymentdesc = $scope.listpayment[i].description != null ? $scope.listpayment[i].description : null;
                        res.userid = sessionStorage.userid;
                        res.username = _invoice.firstname;
                        res.email = _invoice.email;
                        res.mobileno = _invoice.mobileno;
                        res.deviceid = _invoice.deviceid;
                        tempArray.push(res);
                    }
                }
                
            }
            obj.listinputs = tempArray;
            if (tempArray.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.url_savebulkpayment, addobj, "", obj)
                result.then(function (resolve) {
                    materials.displayToast(appConstants.successClass, "Payment Processed ");
                    materials.hideSpinner();
                    $rootScope.$emit("loadinvoicereq", null);
                    $uibModalInstance.dismiss("cancel");
                }, function (reject) {

                });
            }
            else {
                alert("Invalid data");
            }
        }


        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

       
    }

})();


