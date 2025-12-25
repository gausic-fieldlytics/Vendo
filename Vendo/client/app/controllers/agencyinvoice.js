(function () {
    'use strict';

    angular.module('app.table')
        .controller('AgencyInvoiceCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'agencyinvoiceModel', 'commonModel', AgencyInvoiceCtrl])

    function AgencyInvoiceCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, agencyinvoiceModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.task = agencyinvoiceModel.add;
        $scope.liststeps = [];
        $scope.listtarget = [];
        $scope.ddltask = {};
        $scope.FilePath = config.filPath;
        $scope.nodes = [];
        $scope.targetnodes = [];
        $scope.listpaymentstatus = [];
        $scope.selectedinvoiceIndex = 0;
        $scope.pdfpath = config.filPath + config.urlpdfpath;
        $scope.filepath;
        $scope.saveparam = {};
        $scope.savelist = [];
        $scope.savepath = null;
        $scope.showinvoiceotp = false;
        $scope.invoiceotp = null;


        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.task, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };





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
        $scope.showtaskdetail = true;
        $scope.showtaskstepsdetail = false;
        $scope.filepaths = config.filepath;


        function loadtargetreeview(oProjectlist) {

            var listproject = oProjectlist;
            $scope.targetnodes = [];
            debugger;
            for (var i = 0; i < listproject.length; i++) {

                var procode = "P_" + generateUniqueString();

                var name = listproject[i].projectname + " " + "(" + listproject[i].citycount + ")" + " " + listproject[i].amount;
                var rootDir = { name: name, flag: "P", code: procode, id: procode + listproject[i].projectid, amount: listproject[i].amount, children: [] };

                var citytarget = listproject[i].listcitytarget;
                for (var j = 0; j < citytarget.length; j++) {
                    var name = citytarget[j].cityname + " " + "(" + citytarget[j].areacount + ")" + " " + citytarget[j].amount;
                    var citycode = "C_" + generateUniqueString();
                    var citydir = { name: name, flag: "C", code: citycode, id: citycode + citytarget[j].cityid, amount: citytarget[j].amount, children: [] };


                    var listarea = citytarget[j].listareatarget;
                    for (var k = 0; k < listarea.length; k++) {
                        var name = listarea[k].areaname + " " + "(" + listarea[k].targetcount + ")" + " " + listarea[k].amount;
                        var areacode = "A_" + generateUniqueString();
                        var areadir = { name: name, flag: "A", code: areacode, id: areacode + listarea[k].areaid, amount: listarea[k].amount, children: [] };

                        debugger;
                        var listtarget = listarea[k].listtarget;
                        for (var l = 0; l < listtarget.length; l++) {
                            var name = listtarget[l].targetname + " " + "(" + listtarget[l].taskcount + ")" + " " + listtarget[l].amount;
                            var tarcode = "TAR_" + generateUniqueString();
                            var tardir = { name: name, flag: "TAR", code: tarcode, id: tarcode + listtarget[l].targetid, amount: listtarget[l].amount, projectid: listtarget[l].projectid, children: [] };

                            var listtask = listtarget[l].listcompletetask;

                            for (var m = 0; m < listtask.length; m++) {
                                var name = listtask[m].taskname + " " + "(" + listtask[m].taskstepcount + ")" + " " + listtask[m].amount;
                                var taskcode = "T_" + generateUniqueString();
                                var taskdir = { name: name, flag: "T", code: taskcode, id: taskcode + listtask[m].taskid, amount: listtask[m].amount, projectid: listtask[m].projectid };
                                tardir.children.push(taskdir);

                            }
                            areadir.children.push(tardir);
                        }

                        citydir.children.push(areadir);
                    }

                    rootDir.children.push(citydir);
                }
                $scope.targetnodes.push(rootDir);
            }
        }
        $scope.loadtask = function (node) {
            if (node.children) {
                var list = node.children;
                var checkcount = 0;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].checked) {
                        checkcount++;
                    }
                }
                if (list.length == checkcount) {
                    node.checked = true;
                }
            }
        }


        function generateUniqueString() {
            var length = 5;
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }


            return result + "_";

        }

        function loadgenarateinvoice() {
            var obj = {};
            obj.agencyid = sessionStorage.userid;
            var result = service.serverPost(config.urlGetagencytaskbucket, agencyinvoiceModel.invoicetask, "", obj)
            result.then(function (resolve) {
                debugger;
                var oResult = resolve.ResponseData;
                loadtargetreeview(oResult);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadgenarateinvoice();


        function getpaymenttranaction(flag) {
            var obj = {};
            obj.userid = sessionStorage.userid;
            obj.paymentflag = flag;
            obj.fromdate = null;
            obj.todate = null;
            var result = service.serverPost(config.urlGetPaymenttransaction, agencyinvoiceModel.transaction, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listpaymentstatus = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getpaymenttranaction('COM');

        $scope.getpayment = function (flag) {

           getpaymenttranaction(flag);
        }


        $scope.generateinvoice = function () {
            debugger;
            var amount = 0;
            var data = $scope.targetnodes;
            var obj = {};
            var lstinput = [];
            var listtarget = [];
            var listinvoice = [];
            for (var i = 0; i < $scope.targetnodes.length; i++) {
                var newcitytarget = $scope.targetnodes[i].children;
                for (var j = 0; j < newcitytarget.length; j++) {
                    var areatarget = newcitytarget[j].children;
                    for (var k = 0; k < areatarget.length; k++) {
                        var lsttarget = areatarget[k].children;
                        for (var l = 0; l < lsttarget.length; l++) {
                            var lsttask = lsttarget[l].children;
                            for (var m = 0; m < lsttask.length; m++) {
                                if (lsttask[m].checked) {
                                    debugger;
                                    listtarget.push(lsttarget[l].id.replace(lsttarget[l].code, ""));
                                    lstinput.push(lsttask[m].id.replace(lsttask[m].code, ""));

                                    var newobj = {};
                                    newobj.taskid = lsttask[m].id.replace(lsttask[m].code, "");
                                    newobj.targetid = lsttarget[l].id.replace(lsttarget[l].code, "");
                                    listinvoice.push(newobj);

                                    amount = amount + lsttask[m].amount;
                                }
                            }
                        }
                    }
                }
            }

            var newparam = {};
            newparam.taskid = lstinput.join(",")
            newparam.targetid = listtarget.join(",")
            newparam.userid = sessionStorage.userid;
            newparam.totalamount = amount;
            if (lstinput.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.urlcreateinvoice, agencyinvoiceModel.createinvoice, "", newparam)
                result.then(function (resolve) {
                    debugger;
                    materials.hideSpinner();
                    $scope.saveparam = newparam;
                    $scope.savelist = listinvoice;
                    $scope.savepath = resolve.ResponseData;
                    $scope.showinvoiceotp = false;
                    $scope.invoiceotp = null;
                    if (resolve.ResponseData != "") {

                        $scope.filepath = $scope.pdfpath + resolve.ResponseData;
                        $scope.show = 2;
                        var bigFrame = $('#invoiceframe');
                        bigFrame.attr('src', $scope.filepath);
                        // saveinvoice(newparam, listinvoice, resolve.ResponseData)
                    }
                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
            }
            else {
                materials.displayToast(appConstants.warningClass, "" + ' ' + "Select atlest one target.");
            }
            
        }

        $scope.sendotp = function () {
            debugger;
            var invoiceparam = {};
            invoiceparam.contactno = "";
            invoiceparam.userid = sessionStorage.userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlsendinvoiceotp, agencyinvoiceModel.send_invoice_otp, "", invoiceparam)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                materials.displayToast(appConstants.successClass, "" + ' ' + appConstants.otpMsg);
                $scope.invoiceotp = null;
                $scope.showinvoiceotp = true;
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }


        $scope.saveinvoice = function (param, listinvoice, invoicepath) {
            param.listinputs = listinvoice;
            param.invoicepath = invoicepath;
            param.signature = "";
            param.otp = $scope.invoiceotp;
            debugger;
            materials.showSpinner();
            var result = service.serverPost(config.urlSaveagencyInvoice, agencyinvoiceModel.invoice_add, "", param)
            result.then(function (resolve) {
                materials.hideSpinner();
                if (resolve.ResponseData > 0) {
                    materials.displayToast(appConstants.successClass, appConstants.invoice + ' ' + appConstants.saveMsg);
                    loadgenarateinvoice();
                    $scope.show = 1;
                }
                else {
                    materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.otpErrorMsg);
                }
                
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = agencyinvoiceModel.ddlist;

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


        function selectedItemChangeTarget(target, columnn) {

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




    }


})();


