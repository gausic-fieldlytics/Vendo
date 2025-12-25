(function () {
    'use strict';

    angular.module('app.table').controller('TaskStepTypeCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'tasksteptypeModel', 'commonModel', TaskStepTypeCtrl]);

    function TaskStepTypeCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, tasksteptypeModel, commonModel) {

        var original;
        var init;
        this.tasksteptype = tasksteptypeModel.add;
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(46);

        $scope.deleteTasksteptype = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.tasksteptype);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTasksteptype, tasksteptypeModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    debugger;
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.tasksteptype + ' ' + appConstants.deleteMsg);
                        getAllTasksteptype();
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTasksteptype = function (rowData) {

            $scope.show = 2;
            $scope.tasksteptype = angular.copy(rowData);
            getAllstep(rowData.id)
            original = angular.copy($scope.tasksteptype);

        }

        function getAllstep(tasksteptypeid) {
            var obj = {};
            obj.tasksteptypeid = tasksteptypeid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetTasksteptypedetailById, tasksteptypeModel.ques_searchall, "", obj)
            result.then(function (resolve) {
                $scope.tasksteptype.liststeps = resolve.ResponseData;
                original = angular.copy($scope.tasksteptype);
                materials.hideSpinner();
            }, function (reject) {
                materials.hideSpinner();
            });
        }
        $scope.revert = function () {
            $scope.addTasksteptype();
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        
        $scope.canRevert = function () {
            return !angular.equals($scope.tasksteptype, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.tasksteptype, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTasksteptype = function (rowData) {
            $scope.show = 2;
            $scope.tasksteptype = angular.copy(rowData);
            original = angular.copy($scope.tasksteptype);
        }

        $scope.addTasksteptype = function () {
            this.tasksteptype = {};
            this.tasksteptype.liststeps = [];
            
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
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllTasksteptype() {
            debugger;
            var result = service.serverGet(config.urlGetTasksteptype);
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.validatechild = function (form) {
            return form.$valid;
        }
        
        $scope.addFieldimg = function (list) {
            var obj = {};
            list.push(obj);
        }

        $scope.removeField = function (list) {
            list.splice(list.length - 1, 1);
        }

        $scope.removeimgField = function (list,idx) {
            list.splice(idx, 1);
        }
        
        getAllTasksteptype();

        $scope.onchnage = function(){
            var obj = this.tasksteptype;
        }
        $scope.saveTasksteptype = function () {
            debugger
            var obj = this.tasksteptype;
            var listinputs = [];
            var task_step = [];
            var tasksteps = obj.liststeps;
            var lststepid = [];
            for (var i = 0; i < tasksteps.length; i++) {
                var newparam = {};
                newparam.id = null;

                if (tasksteps[i].stepid != undefined && tasksteps[i].stepid != null) {
                    lststepid.push(tasksteps[i].stepid);
                    newparam.id = tasksteps[i].stepid;
                }
                
                newparam.step = tasksteps[i].step;
                newparam.sequence = tasksteps[i].sequence;
                task_step.push(newparam);
            }

            var newobj = {};
            newobj.step = task_step;
            listinputs.push(newobj);


            obj.lstInputs = listinputs;
            obj.lststepid = lststepid.join(",");
            var _itemname = obj.tasksteptype;           
            var _item = $filter('filter')($scope.resultData, function(value){
                return (value.tasksteptype.toUpperCase().trim() == _itemname.toUpperCase().trim());
            })[0];
            if(_item == undefined){ 
                if (obj.id == null) {
                    var result = service.serverPost(config.urlSaveTasksteptype, tasksteptypeModel.add, commonModel.trans, obj)
                    result.then(function (resolve) {
                        debugger;
                        $scope.tasksteptype = {};
                        materials.displayToast(appConstants.successClass, appConstants.tasksteptype + ' ' + appConstants.saveMsg);                    
                        getAllTasksteptype();
                        $scope.show = 1;
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
                else {
                    var result = service.serverPost(config.urlUpdateTasksteptype, tasksteptypeModel.edit, commonModel.trans, obj)
                    result.then(function (resolve) {
                        $scope.tasksteptype = {};
                        materials.displayToast(appConstants.successClass, appConstants.tasksteptype + ' ' + appConstants.updateMsg);
                        getAllTasksteptype();
                        $scope.show = 1;

                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
            } else {                        
                materials.displayToast(appConstants.successClass, appConstants.taskclosecallreason + ' ' + appConstants.existMsg);
                $scope.tasksteptype = obj;
            }
        }

        $scope.loadDropDown = function () {
            var ddlistModel = tasksteptypeModel.ddlist;
            for (var key in ddlistModel) {
                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, ddlistModel[key]), ddlistModel[key]);
                result.then(function (resolve) {
                    $scope['list' + ddlistModel[resolve.input]] = resolve.ResponseData;
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown();
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        function handleFile(e) {
            debugger;
            $scope.isvalid = false;
            var _keyset = appConstants.CLOSECALL_REASON_COL;
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
                                            newtarget.name = $scope.uploadedItems[m]["Reason"];
                                            newtarget.imagerequired = $scope.uploadedItems[m]["ImageRequired"].toLowerCase() == "true"? true:false;
                                            $scope.listalltask.push(newtarget);
                                        }
                                    }
                                    else {
                                        $scope.uploadedItems = [];
                                        document.getElementById("files").value = "";
                                        alert("Excel Format does not Match...");
                                    }
                                }
                                else {
                                }
                                if (count == incount && $scope.isvalid) {
                                    $('#openpopup').click();
                                    //  $scope.open('lg');
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

        $(document).ready(function () {
            $('#files').change(handleFile);
        });

        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }

        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.savebulkitem = function () {
            debugger;
            var obj = {};
            obj.flag = "STEPTYPE";
            // obj.listinputs = $scope.listalltask;
            obj.listinputs = $scope.listalltask.map(element => {
                element.imagerequired = element.imagerequired == true || element.imagerequired == 1 ? 1 : 0;
                return element;
            });
            //obj.listinputs = $scope.listalltask.map(element => element.imagerequired = element.imagerequired == true || element.imagerequired == 1 ? 1 : 0);        
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, tasksteptypeModel.bulk_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.tasksteptype + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                getAllTasksteptype();
            }, function (reject) {

            });
        }
    }
})();


