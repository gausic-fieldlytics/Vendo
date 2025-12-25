(function () {
    'use strict';

    angular.module('app.table')
        .controller('TaskCtrl', ['$q','$rootScope', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskModel', 'taskstepsModel', 'taskstepprogressModel', 'invoicefrequencyModel', 'commonModel', '$sce', TaskCtrl])
         .controller('ProjecttargetCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', ProjecttargetCtrl])
    .directive('commaseparator', function ($filter) {
        'use strict';
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                ctrl.$formatters.unshift(function () {
                    return $filter('number')(ctrl.$modelValue);
                });
                ctrl.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[\,\.\-\+]/g, ''),
                        b = $filter('number')(plainNumber);
                    elem.val(b);
                    return plainNumber;
                });
            }
        };
    });

    function TaskCtrl($q,$rootScope, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, taskModel, taskstepsModel, taskstepprogressModel, invoicefrequencyModel, commonModel, $sce) {
        var selectedId = 0;
        var original;
        var init;
        this.task = taskModel.add;
        $scope.listalltarget = [];

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(24);

        $scope.FilePath = config.filPath;
        $scope.bindcurrency = $sce.trustAsHtml("&#8377;");
        $scope.selectedIndex = "0";
        var projectid = 0, statusid = 0;
        $scope.ddltaskid;
        $scope.isratehigh = false;
        $scope.task_max = new Date();
        $scope.task_min = new Date();
        $scope.task_tomin = new Date();
        $scope.grid = {};
        $scope.grid.fdate = null;
        $scope.grid.tdate = null;
        $scope.selecttxt = "";
        $scope.deleteTask = function (obj) {
            var confirm = materials.deleteConfirm(appConstants.task);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTask, taskModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.deleteMsg);
                        getAllTask(projectid, statusid);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.getselecteditemcount = function () {
            $scope.selecttxt = $scope.task.taskskillid != null ? $scope.task.taskskillid.length + " Skill selected" : "";
        }

        $scope.removeimg = function (_task) {

            var delobj = {
                "id": "id",
                "delstatus": "delstatus",
                "img":"img"
            };

            var confirm = materials.deleteConfirm(appConstants.img);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: _task.id,
                    delstatus: "TSK",
                    img: _task.refimage
                };
                var result = service.serverDelete(config.urlDeleteimg, delobj, "", delObj);
                result.then(function (resolve) {

                    materials.displayToast(appConstants.successClass, appConstants.img + ' ' + appConstants.deleteMsg);
                    _task.refimage = null;
                    getAllTask(projectid, statusid);
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        }

        $scope.removestepimg = function (_taskstep) {
            debugger;
            var delobj = {
                "id": "id",
                "delstatus": "delstatus",
                "img": "img"
            };

            var confirm = materials.deleteConfirm(appConstants.img);
            $mdDialog.show(confirm).then(function () {
                debugger;
                var delObj = {
                    id: _taskstep.id,
                    delstatus: "TSKSTP",
                    img: _taskstep.sampleimage
                };
                var result = service.serverDelete(config.urlDeleteimg, delobj, "", delObj);
                result.then(function (resolve) {

                    materials.displayToast(appConstants.successClass, appConstants.img + ' ' + appConstants.deleteMsg);
                    getAllTasksteps($scope.taskid);
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        }
        
        $scope.taskstepsDelete = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.tasksteps);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTasksteps, taskstepsModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.deleteMsg);
                        getAllTasksteps(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };


        $scope.editTask = function (rowData) {
            debugger;
            $scope.selectedIndex = "0";
            $scope.show = 2;
            $scope.taskid = rowData.id;

            $scope.resultStepData = [];
            $scope.listtaskchecklist = [];
           
          //  getAllTasksteps($scope.taskid);
            getAllquestion(rowData.id)
            //getalltaskitem($scope.taskid);
            $scope.task = angular.copy(rowData);
            $scope.task.isoptional = $scope.task.isoptional == true ? 1 : 0;
            $scope.task.startdate = new Date($scope.task.startdate);
            $scope.task.enddate = new Date($scope.task.enddate);
            $scope.task.taskpublishdate = $scope.task.taskpublishdate != null ? new Date($scope.task.taskpublishdate) : null;
            $scope.task.criticaldate = $scope.task.criticaldate != null ? new Date($scope.task.criticaldate) : null;
            if ($scope.task.taskskillid != null) {
                $scope.task.taskskillid = $scope.task.taskskillid.split(",");
            }
            $scope.selecttxt = $scope.task.taskskillid != null ? $scope.task.taskskillid.length + " Skill selected" : "";
            $scope.getselecteditemcount();
            $scope.loadfromdate($scope.task.projectid);
            $scope.task.listtaskimages = [];
            $scope.task.listitem = [];
            $scope.task.listquestion = [];
            
            if (rowData.refimage != null) {
                var lstimg = rowData.refimage.split(",");
                for (var i = 0; i < lstimg.length; i++) {
                    var imgobj = {};
                    imgobj.docfile = $scope.FilePath + lstimg[i];
                    $scope.task.listtaskimages.push(imgobj);
                }
            }
            original = angular.copy($scope.task);
        }

       

        $scope.remFiled_tsk = function () {
            
            $scope.Selectedtask = $scope.task;
            $scope.task = {};


        };

        
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.task, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTask = function (rowData) {
            $scope.show = 2;
            $scope.task = angular.copy(rowData);
            $scope.task.startdate = new Date($scope.task.startdate);
            $scope.task.enddate = new Date($scope.task.enddate);
            original = angular.copy($scope.task);
            if ($scope.task.refimage != null)
                $scope.task.refimage = config.filepath + $scope.task.refimage;
        }

        $scope.addTask = function () {
            $scope.task = {};
            $scope.task.isoptional = "1";
            $scope.task.taskstatusid = 1;
            $scope.task.startdate = new Date();
            $scope.task.enddate = new Date();
            $scope.task.taskpublishdate = new Date();
            $scope.task.criticaldate = new Date();
            
            $scope.selectedIndex = "0";
            $scope.resultStepData = [];
            $scope.listtaskchecklist = [];
            $scope.task.listtaskimages = [];
            $scope.task.listitem = [];
            $scope.task.listquestion = [];
            $scope.selecttxt = "";
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

        $scope.isDefined = function (input) {
            return (!angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

        $scope.isUnDefined = function (input) {
            return (!angular.isObject(input) && (angular.isUndefined(input) || input == null)) ? true : false;
        }
        $scope.isObject = function (input) {
            return (angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

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

        function getAllTask(projectid, statusid) {
            
            var obj = {};
            obj.statusid = statusid;
            obj.projectid = projectid;
            obj.fromdate = $scope.grid.fdate != null ? new Date($scope.grid.fdate) : null;
            obj.todate = $scope.grid.tdate != null ? new Date($scope.grid.tdate) : null;
            var result = service.serverPost(config.urlGetTask, taskModel.searchall, "", obj)

            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getAllTask(projectid, statusid);

        $rootScope.$on('loadtasktarget', function (event, args) {
            
            getAllTask(projectid, statusid);
        });

        function getAllTarget(stateid, cityid, areaid) {
            debugger;
            var obj = {};
            obj.stateid = stateid;
            obj.cityid = cityid;
            obj.areaid = areaid;
            var result = service.serverPost(config.urlGetTarget, taskModel.searchall_alltarget, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listalltarget = resolve.ResponseData;
            }, function (reject) {
                
            });
        }
        getAllTarget(0, 0, 0);



        $scope.loadgrid = function () {
            getAllTask(projectid, statusid);
        }
        function getTaskNoteDone(selectedId) {
            debugger;
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetTaskNotDone, taskModel.searchbyid, "", obj)

            result.then(function (resolve) {
                debugger;
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function getAllTaskbyid(selectedId) {
            debugger
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetTaskById, taskModel.searchbyid, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function getAllTaskbyStatus(selectedId) {
            
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetTaskByStatus, taskModel.searchbyid, "", obj)

            result.then(function (resolve) {
                
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadfromdate = function (projectid) {
            debugger;
            var selectedproject = $.grep($scope.listproject, function (obj) {
                return obj.id == projectid;
            })[0];
            $scope.task_max = new Date(selectedproject.enddate);

            $scope.task_min = new Date(selectedproject.startdate);
            $scope.task_tomin = new Date(selectedproject.startdate);
            
            //if (new Date($scope.task.startdate) > new Date($scope.task.enddate)) {
            //    $scope.task.enddate = new Date($scope.task.startdate);
            //}
        }


        $scope.chagetodate = function () {
            debugger;
            if (new Date($scope.task.startdate) > new Date($scope.task.enddate)) {
                $scope.task.enddate = new Date($scope.task.startdate);
            }
            $scope.task_tomin = new Date($scope.task.startdate);
            
        }

        $scope.upload = function () {
            $scope.isratehigh = false;
            var _obj = $scope.task;
            debugger;
            if (parseFloat(_obj.customerrate) > parseFloat(_obj.rate)) {
                var listimages = [];
                var defimg = "";
                var _obj = $scope.task;
                var imgcount = 0;
                var listtaskimages = _obj.listtaskimages;
                if (listtaskimages.length > 0) {
                    for (var i = 0; i < listtaskimages.length; i++) {
                        if (listtaskimages[i].docfile != undefined) {
                            if (angular.isObject(listtaskimages[i].docfile)) {
                                listimages.push(listtaskimages[i].docfile);
                                // var _imagname = ("#####" + imgcount)
                                //  defimg = defimg + "," + _imagname;
                                imgcount = imgcount + 1;
                            }
                            else {
                                var _path = listtaskimages[i].docfile.replace($scope.FilePath, '');
                                defimg = defimg == "" ? _path.trim() : defimg + "," + _path.trim();
                            }
                        }
                    }
                }

                if (listimages.length > 0) {
                    var postdata = '?' + config.urlFolderPath + '=' + config.urlTaskImage;
                    var result = service.filePost(config.urlSaveFile + postdata, listimages)
                    //  var result = service.filePost(config.urlSaveFile, listimages)
                    result.then(function (resolve) {
                        defimg = defimg != "" ? defimg + "," + resolve.ResponseData : resolve.ResponseData;
                        _obj.refimage = defimg;
                        $scope.saveTask(_obj);
                    }, function (reject) {
                        console.log('error')
                    });

                }
                else {
                    $scope.saveTask(_obj);
                }
            }
            else {
                $scope.isratehigh = true;
            }
        }

        //$scope.upload = function () {
        //    debugger;
        //    var _obj = $scope.task;
        //    debugger;


        //    if (angular.isObject(_obj.refimage)) {

        //        var postdata = '?' + config.urlFolderPath + '=' + config.urlTaskImage;
        //        materials.showSpinner();
        //        var result = service.filePost(config.urlSaveFile + postdata, _obj.refimage)
        //        result.then(function (resolve) {
        //            materials.hideSpinner();
        //            _obj.refimage = resolve.ResponseData;
        //           $scope.saveTask(_obj);
        //        }, function (reject) {
        //            materials.hideSpinner();
        //        });
        //    }
        //    else {
        //        $scope.saveTask(_obj);
        //    }
        //};
        
        $scope.saveTask = function (obj) {
            debugger;
            var tempTask = {};
            obj.startdate = new Date(obj.startdate);
            obj.enddate = new Date(obj.enddate);
            obj.taskpublishdate = new Date(obj.taskpublishdate);
            obj.criticaldate = new Date(obj.criticaldate);
            
            obj.isoptional = obj.isoptional == true || obj.isoptional == 1 ? 1 : 0;
            obj.taskskillid = obj.taskskillid.length > 0 ? obj.taskskillid.join(",") : null;

            var listinputs = [];

            var task_item = [];
            var task_question = [];

            
            var taskquestion = obj.listquestion;
            var lstquestionid = [];


            for (var i = 0; i < taskquestion.length; i++) {
                var newparam = {};
                newparam.id = null;

                if (taskquestion[i].id != undefined && taskquestion[i].id != null) {
                    lstquestionid.push(taskquestion[i].id);
                    newparam.id = taskquestion[i].id;
                }
                
                newparam.question = taskquestion[i].question;
                newparam.ismandatory = taskquestion[i].ismandatory == true || taskquestion[i].ismandatory == 1 ? 1 : 0;
                task_question.push(newparam);
            }

            var newobj = {};
            newobj.question = task_question;
            listinputs.push(newobj);


            obj.lstInputs = listinputs;
            obj.lstquestionid = lstquestionid.join(",");
            materials.showSpinner();
            if (obj.id == null) {
                obj.createdby = sessionStorage.userid;
                tempTask = angular.copy(obj);
                var result = service.serverPost(config.urlSaveTask, taskModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    debugger;
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.saveMsg);
                        getAllTask(projectid, statusid);
                        $scope.addTask();
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.modifiedby = sessionStorage.userid
                var result = service.serverPost(config.urlUpdateTask, taskModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    debugger;
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.updateMsg);
                        getAllTask(projectid, statusid);
                        $scope.show = 1;
                    }
                    else {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
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
        $scope.groupmemshow = true;
        $scope.groupcount = function (val) {

            if (val == 1) {
                $scope.groupmemshow = false;
            }
            else {
                $scope.groupmemshow = true;
            }
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = taskModel.ddlist;

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
                    obj['u_' + valParam[2]] = 0;
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    debugger;
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

       

        /////Start Task Steps/////

 

        $scope.childParam_step = function (form) {
            return form.$valid;
        }
        $scope.addtaskstepsField = function (list) {
            debugger;
            var obj = {};
            list.push(obj);
        }
        
        $scope.rmtaskstepsField = function (list) {
            list.splice(list.length - 1, 1);
        }
        

        $scope.uploadsteps = function () {
            debugger;
            var listupdoc = [];
            var count = 0;
            for (var j = 0; j < $scope.resultStepData.length; j++) {
                if ($scope.resultStepData[j].sampleimage != undefined && $scope.resultStepData[j].sampleimage != "") {
                    if (angular.isObject($scope.resultStepData[j].sampleimage)) {
                        listupdoc.push($scope.resultStepData[j].sampleimage);
                        $scope.resultStepData[j].sampleimage = "#####" + count;
                        count++;
                    }
                    else {
                        var path = $scope.resultStepData[j].sampleimage.replace($scope.FilePath, "");
                        $scope.resultStepData[j].sampleimage = path;
                    }
                }
            }
            if (listupdoc.length > 0) {
                var postdata = '?' + config.urlFolderPath + '=' + config.urlTaskstepImage;
                materials.showSpinner();
                var result = service.filePost(config.urlSaveFile + postdata, listupdoc)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    debugger;
                    var docData = resolve.ResponseData.split(",");
                    for (var i = 0; i < docData.length; i++) {
                        var _imagname = ("#####" + i);
                        for (var j = 0; j < $scope.resultStepData.length; j++) {
                            if ($scope.resultStepData[j].sampleimage == _imagname) {
                                $scope.resultStepData[j].sampleimage = docData[i];
                            }
                        }
                    }
                    $scope.savesteps();

                }, function (reject) {
                    materials.hideSpinner();
                });
            }
            else {
                $scope.savesteps();
            }
        }


        $scope.savesteps = function (docData) {
            debugger;
            var listinputs = [];
            var obj = {};
            obj.taskid = $scope.taskid;
        
            obj.listinputs = [];
            for (var i = 0; i < $scope.resultStepData.length; i++) {
                var newparam = {};
                newparam.step = $scope.resultStepData[i].step;
                newparam.taskid = $scope.taskid;
                newparam.sequence = $scope.resultStepData[i].sequence;
                newparam.executionhrs = $scope.resultStepData[i].executionhrs;
                newparam.notes = $scope.resultStepData[i].notes != undefined && $scope.resultStepData[i].notes!=null? $scope.resultStepData[i].notes:null;
                newparam.ismandatory =  $scope.resultStepData[i].ismandatory==true|| $scope.resultStepData[i].ismandatory==1?1:0;
                newparam.sampleimage = $scope.resultStepData[i].sampleimage;
                newparam.weightage = $scope.resultStepData[i].weightage;
            //    newparam.createdat = $scope.resultStepData[i].createdat;
                newparam.createdby = sessionStorage.userid;
                listinputs.push(newparam);
                //lstid = lstid == null ? $scope.resultStepData[i].prooftypeid : lstid + "," + $scope.resultStepData[i].prooftypeid;
                //   lstimg = lstimg == null ? $scope.resultStepData[i].proofimage : lstimg + "," + $scope.resultStepData[i].proofimage;
            }

            obj.listinputs = listinputs;
           // obj.lstid = lstid;
            //  obj.listimg = lstimg;
            var result = service.serverPost(config.urlSaveTasksteps, taskModel.step_add,"", obj)
         //   var result = service.serverPost(config.urlSaveBusinessproof, businessModel.proof_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);

                getAllTasksteps($scope.taskid);

            }, function (reject) {
                alert('Not Resolved')
            });

        }

        function getAllTasksteps(selectedId) {
            var obj = {};
            obj.id = selectedId;
            var result = service.serverPost(config.urlGetTasksteps, taskstepsModel.searchbyid, "", obj)

            result.then(function (resolve) {
                materials.hideSpinner();

                $scope.resultStepData = resolve.ResponseData;
                for (var i = 0; i < $scope.resultStepData.length; i++) {
                    if ($scope.resultStepData[i].sampleimage != null) {
                        $scope.resultStepData[i].sampleimage = $scope.FilePath + $scope.resultStepData[i].sampleimage;
                    }
                }
                
             //   init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        //$scope.expandSelected = function (row) {
        //    
        //    $scope.resultStepData = [];
        //    $scope.currentPageresultData.forEach(function (val) {
        //        val.expanded = false;
        //    })
        //    row.expanded = true;
        //    materials.showSpinner();
        //    getAllTasksteps(row.id);
        //}
        $scope.openModal = function (row) {


            $uibModal.open({
                template: document.getElementById('myModalContent.html').innerHTML,

                controller: ['$scope', '$uibModalInstance', 'materials', function ($scope, $uibModalInstance, materials) {
                    $scope.filepaths = config.filepath;

                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    function getAllTasksteps(selectedId) {

                        var obj = {};
                        obj.id = selectedId;
                        var result = service.serverPost(config.urlGetTaskstepsById, taskstepsModel.searchbyid, "", obj)

                        result.then(function (resolve) {
                            materials.hideSpinner();
                            $scope.resultStepData = resolve.ResponseData;

                            init();
                        }, function (reject) {
                            alert('Not Resolved')
                        });
                    }

                    $scope.verify = function (SelectedStep, status) {
                        debugger;
                        var vryobj = {};
                        if (status == "v") {
                            materials.showSpinner();

                            vryobj.taskid = SelectedStep.taskid;
                            vryobj.taskstepid = SelectedStep.id;
                            vryobj.comments = "Done";
                            vryobj.taskstatusid = 1;
                            vryobj.auditedby = 11;
                            vryobj.auditedat = new Date();
                            vryobj.status = 1;

                            if (SelectedStep.stepprogressid == null) {
                                var result = service.serverPost(config.urlSaveTaskstepprogress, taskstepprogressModel.add, "", vryobj)
                                result.then(function (resolve) {
                                    materials.hideSpinner();
                                    getAllTasksteps(SelectedStep.taskid);
                                    init();
                                }, function (reject) {
                                    alert('Not Resolved')
                                });
                            }
                            else {
                                vryobj.id = SelectedStep.stepprogressid;
                                var result = service.serverPost(config.urlUpdateTaskstepprogress, taskstepprogressModel.edit, "", vryobj)
                                result.then(function (resolve) {
                                    materials.hideSpinner();
                                    getAllTasksteps(SelectedStep.taskid);
                                    init();
                                }, function (reject) {
                                    alert('Not Resolved')
                                });
                            }

                        }
                        else if (status == "e") {

                            var confirm = materials.editConfirm(appConstants.task);
                            $mdDialog.show(confirm).then(function () {
                                vryobj.id = SelectedStep.stepprogressid;
                                vryobj.taskid = SelectedStep.taskid;
                                vryobj.taskstepid = SelectedStep.id;
                                vryobj.comments = "Done";
                                vryobj.taskstatusid = 2;
                                vryobj.auditedby = 11;
                                vryobj.auditedat = SelectedStep.auditedat;
                                vryobj.status = 1;
                                var result = service.serverPost(config.urlUpdateTaskstepprogress, taskstepprogressModel.edit, "", vryobj)
                                result.then(function (resolve) {
                                    materials.hideSpinner();
                                    getAllTasksteps(SelectedStep.taskid);
                                    init();
                                }, function (reject) {
                                    alert('Not Resolved')
                                });
                            });

                        }

                    }



                    getAllTasksteps(row.id);
                }]
            })
            //modalScope.modalInstance = modalInstance;
            //modalInstance.result.then(function (selectedObj) {
            //    if (selectedObj) {
            //        getAllTasksteps(row.id);
            //    }

            //}, function (response) {

            //});

        };



        function getAllTasksteppro(taskid, stepid) {

            var obj = {};
            obj.taskid = taskid;
            obj.taskstepid = stepid;
            var result = service.serverPost(config.urlGetTaskstepprogressById, taskstepprogressModel.searchbyid, "", obj)

            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultProgressData = resolve.ResponseData;
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        //$scope.expandProgress = function (pro) {
        //    
        //    $scope.resultProgressData = [];
        //    $scope.resultStepData.forEach(function (stp) {
        //        stp.expanded = false;
        //    })
        //    pro.expanded = true;
        //    materials.showSpinner();
        //    getAllTasksteppro(pro.taskid, pro.id);
        //}



        $scope.rowDataHide = function (row) {
            row.open = row.open
        }

        $scope.saveTask_steps = function (tskstpObj) {

            materials.showSpinner();
            var obj = tskstpObj;
            obj.sampleimage = $scope.uploadProofFilename;
            obj.status = 1;
            if (obj.id == null) {
                obj.createdby = 1;
                obj.createdat = new Date();
                var result = service.serverPost(config.urlSaveTasksteps, taskstepsModel.add, commonModel.trans, obj)
                result.then(function (resolve) {

                    materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);
                    //$scope.tasksteps = {};
                    //getAllTasksteps(selectedId);
                    materials.hideSpinner();
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                obj.modifiedby = 1;
                obj.modifiedat = new Date();
                obj.status = 1;
                if (obj.ismandatory == true)
                    obj.ismandatory = 1;
                else
                    obj.ismandatory = 0;
                var result = service.serverPost(config.urlUpdateTasksteps, taskstepsModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    //getAllTasksteps(selectedId);
                    materials.hideSpinner();
                    $scope.show = 1;

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }

        $scope.taskstepsUpload = function (tskstpObj) {


            tskstpObj.taskid = $scope.taskid;
            if (tskstpObj.step != undefined && tskstpObj.sequence != "" && tskstpObj.executionhrs != undefined && tskstpObj.weightage != undefined && tskstpObj.sampleimage != undefined && tskstpObj.sampleimage.length > 0) {

                $scope.uploadProofFilename = "";
                $scope.uploadProofExtension = "";
                $scope.uploadProofDisplayfilename = "";

                var file = tskstpObj.sampleimage;
                var code = "";
                if (file[0].size != undefined) {

                    var result = service.filePost(config.urlSaveFile, file, code);
                    result.then(function (resolve) {
                        debugger;

                        $scope.uploadProofFilename = "";
                        $scope.uploadProofExtension = "";
                        $scope.uploadProofDisplayfilename = "";

                        $scope.proofData = resolve.ResponseData;

                        for (var i = 0; i < $scope.proofData.length; i++) {

                            $scope.uploadProofFilename = $scope.uploadProofFilename.concat($scope.proofData[i].filename);
                            $scope.uploadProofExtension = $scope.uploadProofExtension.concat(config.urlEmployeeProof + "/" + $scope.proofData[i].extension + ',');
                            $scope.uploadProofDisplayfilename = $scope.uploadProofDisplayfilename.concat($scope.proofData[i].displayfilename + ',');

                        }
                        $scope.saveTask_steps(tskstpObj);

                    }, function (reject) {
                        console.log(reject.ResponseMessage);
                    });

                }
                else {

                    $scope.uploadProofFilename = tskstpObj.sampleimage;
                    $scope.saveTask_steps(tskstpObj);
                }
                return true;
            }
            else {

                alert("Please fill all required field");
                return false;
            }

        };

        function getAllquestion(taskid) {
            var obj = {};
            obj.taskid = taskid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGettaskchecklist, taskModel.ques_searchall, "", obj)
            result.then(function (resolve) {
                $scope.task.listquestion = resolve.ResponseData;
                original = angular.copy($scope.task);
                materials.hideSpinner();
            }, function (reject) {
                materials.hideSpinner();
            });
        }

        function getalltaskitem(taskid) {
            var obj = {};
            obj.taskid = taskid;
            var result = service.serverPost(config.urlGetAllTaskitem, taskModel.ques_searchall, "", obj)
            result.then(function (resolve) {
                $scope.task.listitem = resolve.ResponseData;
               
                getAllquestion(taskid);
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.savequestion = function () {
            debugger;
            var listinputs = [];
            var obj = {};
            obj.taskid = $scope.taskid;
            obj.listinputs = [];
            for (var i = 0; i < $scope.listtaskchecklist.length; i++) {
                var newparam = {};
                newparam.question = $scope.listtaskchecklist[i].question;
                newparam.taskid = $scope.taskid;
                newparam.ismandatory = $scope.listtaskchecklist[i].ismandatory == true || $scope.listtaskchecklist[i].ismandatory == 1 ? 1 : 0;
                listinputs.push(newparam);
            }

            obj.listinputs = listinputs;
            var result = service.serverPost(config.urlSavetaskchecklist, taskModel.qus_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.question + ' ' + appConstants.saveMsg);
                getAllquestion($scope.taskid);
            }, function (reject) {
                alert('Not Resolved')
            });
        }



        /////End Task Steps///////

       

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        /////Start Modal

        /////End Modal

        function querySearch(query, column) {
            
            var key = 'list' + column;
            if (column == "project")
                var results = query ? $scope[key].filter(createFilter(query, column + 'title')) : $scope[key], deferred;
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

        function selectedItemChange(item, column) {
            debugger;

            projectid = $scope.selectedprojectItem != undefined ? $scope.selectedprojectItem.id : 0;
            statusid = $scope.selectedstatusItem != undefined ? $scope.selectedstatusItem.id : 0;
            eval('getAll' + column + '(' + projectid + "," + statusid + ')');

           

        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

        function handleFile(e) {
            debugger;
           
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
                    materials.showSpinner();
                    for (i = 0, f = files[i]; i != files.length; ++i) {

                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var result;
                            var workbook = XLSX.read(data, { type: 'binary' });
                            // incount = workbook.SheetNames.length;
                            incount = 1;
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


                                            //newtarget.state = $scope.uploadedItems[m]["State"];
                                            //newtarget.city = $scope.uploadedItems[m]["City"];
                                            //newtarget.area = $scope.uploadedItems[m]["Area"];
                                            //newtarget.street = $scope.uploadedItems[m]["Street"] != undefined ? $scope.uploadedItems[m]["Street"] : null;
                                            //newtarget.address = $scope.uploadedItems[m]["Address"];
                                            //newtarget.landmark = $scope.uploadedItems[m]["Land Mark"] != undefined ? $scope.uploadedItems[m]["Land Mark"] : null;
                                            //newtarget.phoneno = $scope.uploadedItems[m]["Contact"];
                                            //newtarget.distributor = $scope.uploadedItems[m]["Distributor"];
                                            //newtarget.districontact = $scope.uploadedItems[m]["Distributor Contact"];
                                            //newtarget.pickuplocation = $scope.uploadedItems[m]["Pickup Location"];
                                            //newtarget.supportcontact = $scope.uploadedItems[m]["Support Contact"];
                                            //newtarget.supportnumber = $scope.uploadedItems[m]["Support Number"];
                                            //newtarget.lat = $scope.uploadedItems[m]["Latitude"];
                                            //newtarget.lng = $scope.uploadedItems[m]["Longitude"];

                                            var _targetname = $scope.uploadedItems[m]["Target"];
                                            _targetname = _targetname != null ? _targetname.toLowerCase().trim() : "";

                                            var target = $filter('filter')($scope.listalltarget, function (value) {
                                                return value.targetname.toLowerCase().trim() == _targetname;
                                            })[0];


                                          if (target != null) {
                                              newtarget.targetid = target.id;
                                                $scope.listalltask.push(newtarget);
                                                newtarget.targetname = $scope.uploadedItems[m]["Target"];
                                                $scope.listtarget.push(newtarget);
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
                                else {
                                }
                                if (count == incount && $scope.isvalid) {
                                    materials.hideSpinner();
                                    $scope.open('lg', $scope.ddltaskid, $scope.listtarget, true, $scope.listalltask);
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
            debugger;
            $('#files').change(handleFile);
        });
        $scope.open = function (size, taskid, listtarget, showaddbtn,listtaskmapping) {
            debugger;

            var obj = {};
            obj.taskid = taskid;
            obj.listtarget = listtarget;
            obj.showaddbtn = showaddbtn;
            obj.listtaskmapping = listtaskmapping;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Projecttarget.html',
                controller: 'ProjecttargetCtrl',
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
                debugger;
            });
        };

        $scope.uploadprojecttarget = function (taskid) {
            $scope.ddltaskid = taskid
            $scope.listtarget = [];
            $("#files").trigger("click");
        }


        $scope.getprojecttarget = function (task,status) {
            debugger;
            $scope.listtarget = [];
            var obj = {};
            obj.taskid = task.id;
            var result = service.serverPost(config.urlGetProjecttarget, taskModel.searchall_target, "", obj)
            result.then(function (resolve) {
                var listtarget = resolve.ResponseData;
                if (status == "V") {
                    $scope.listtarget = listtarget;
                    $scope.open('lg', task.id, listtarget, false,null);
                }
                else {
                    $scope.exceller(listtarget, task);
                }
                //if (listtarget.length > 0) {
                //    $scope.listtarget = listtarget;
                //    $scope.open('lg', taskid, listtarget, false);
                //}
                //else {
                //    $scope.ddltaskid = taskid
                //    $scope.listtarget = [];
                //    $("#files").trigger("click");
                //}
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.cols = ["Target", "State", "City", "Area"];
        $scope.colstitle = ["targetname", "state", "city", "area"];


        function toObject(arr, arrlength) {

            var arriobj = [];
            for (var p = 0; p < arrlength; p++) {
                arriobj.push(p == arrlength - 1 ? arr : "");
            }
            return arriobj;
        }

        $scope.exceller = function (listtarget, task) {
            debugger;
            $scope.fileName = "Task Target Mapping";
            $scope.exportData = [];
            var headtitle = "Task" + ":" + task.tasktitle;
            $scope.exportData.push(toObject(headtitle, $scope.cols.length-1));
            $scope.exportData.push(toObject("", $scope.cols.length));
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

        
    }

    function ProjecttargetCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        debugger;
        $scope.taskid = items.taskid;
        $scope.ishowbtn = items.showaddbtn;
        $scope.listtarget = items.listtarget;
        $scope.listtaskmapping = items.listtaskmapping;

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


        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }
        //var addobj = {
        //    "taskid": "taskid",
        //    "listinputs": [{
        //        "taskid": "taskid",
        //        "targetname": "targetname",
        //        "state": "state",
        //        "city": "city",
        //        "area": "area",
        //        "street": "street",
        //        "address": "address",
        //        "landmark": "landmark",
        //        "phoneno": "phoneno",
        //        "distributor": "distributor",
        //        "districontact": "districontact",
        //        "lat": "lat",
        //        "lng": "lng",
        //        "pickuplocation": "pickuplocation",
        //        "supportcontact": "supportcontact",
        //        "supportnumber": "supportnumber",
        //        "createdby": "createdby"
        //    }]
        //};
        var addobj = {
            "flag": "flag",
            "listinputs": [{
                "taskid": "taskid",
                "targetid": "targetid"
            }]
        };
        $scope.inserttarget = function () {
            debugger;
            var tempArray = [];
            for (var i = 0; i < $scope.listtaskmapping.length; i++) {
                    var res = angular.copy($scope.listtarget[i]);
                    res.taskid = $scope.taskid;
                    res.targetid = $scope.listtaskmapping[i].targetid;
                    tempArray.push(res);
                }
               // obj.listinputs = temparray;

            var obj = {};
            obj.flag = "TASK_TARGET";
            obj.listinputs = tempArray;
            materials.showSpinner();
            var result = service.serverPost(config.url_bulklookup, addobj, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                $rootScope.$emit("loadtasktarget", null);
                $uibModalInstance.dismiss("cancel");
            }, function (reject) {
                materials.hideSpinner();
                materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.tryMSG);
            });
        }

        //$scope.inserttarget = function () {
        //    debugger;
        //    var obj = {};
        //    obj.taskid = $scope.taskid;
        //    var tempArray = [];
        //    for (var i = 0; i < $scope.listtarget.length; i++) {
        //        var res = angular.copy($scope.listtarget[i]);
        //        res.taskid = $scope.taskid;
        //        res.createdby = sessionStorage.userid;
        //        tempArray.push(res);
        //    }
        //    obj.listinputs = tempArray;
        //    materials.showSpinner();
        //    var result = service.serverPost(config.urlSaveProjecttarget, addobj, "", obj)
        //    result.then(function (resolve) {
        //        debugger;
        //        materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
        //        materials.hideSpinner();
        //        // $rootScope.$emit("loadproject", null);
        //        $uibModalInstance.dismiss("cancel");
        //    }, function (reject) {

        //    });
        //}

        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }

})();


