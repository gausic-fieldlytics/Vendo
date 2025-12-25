(function () {
    'use strict';

    angular.module('app.table')
        .controller('AgencyAuditCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'progressModel',  'commonModel', AgencyAuditCtrl]);

    function AgencyAuditCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, progressModel,  commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.task = progressModel.add;
        $scope.listtask = [];
        $scope.listtargettask = [];
        $scope.taskbucket = {};
        $scope.deleteTask = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.task);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTask, progressModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.task + ' ' + appConstants.deleteMsg);
                        getAllTask(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        
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
        $scope.filepaths = config.filPath;

        function getAllTask(projectid) {
            var obj = {};
            obj.projectid = projectid;
            var result = service.serverPost(config.urlGettaskDD, progressModel.searchall_task, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listtask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
      //  getAllTask(0)
        function getaudittarget(selectedId) {
            var obj = {};
            obj.agencyid = sessionStorage.userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetagencyaudittask, progressModel.searchall_agency, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }
        getaudittarget(0);

        //$scope.expandSelected = function (row) {
        //    debugger;
        //    $scope.listtasktarget = [];
        //    $scope.currentPageresultData.forEach(function (val) {
        //        val.expanded = false;
        //    })
        //    debugger;
        //    row.expanded = true;
        //    $scope.loadtarget(row);
        //}
        $scope.expandSelected = function (row) {
            debugger;
            $scope.listtargettask = [];
            $scope.currentPageresultData.forEach(function (val) {
                val.expanded = false;
            })
            debugger;
            row.expanded = true;
            $scope.loadtask(row);
        }

        $scope.loadtask = function (rowData) {
            debugger;
            var obj = {};
            obj.targetid = rowData.targetid;
            obj.projectid = rowData.projectid;
            obj.taskid = 0;
            obj.stateid = 0;
            obj.cityid = 0;
            obj.agencyid = sessionStorage.userid;
            obj.fromdate =  null;
            var result = service.serverPost(config.urlgetagencyaudittasklist, progressModel.audit_task, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                debugger;
                $scope.listtargettask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadtarget = function (rowData) {
            debugger;
            var obj = {};
            obj.taskid = rowData.id;
            obj.agencyid = sessionStorage.userid;;
            var result = service.serverPost(config.urlGetagencyaudittarget, progressModel.target_agency, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                debugger;
                $scope.listtasktarget = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadtaskstep = function (_task, _target) {
            $scope.selectedtask = _task;
            $scope.selectedtarget = _target;
            $scope.remarks = null;
            gettaskbucket();
            // getAllTasksteps();
            getquestion();
            $scope.show = 2;
        }

        //$scope.loadtaskstep = function (_task) {
        //    $scope.selectedtask = _task;
        //    gettaskbucket();
        //    getAllTasksteps();
        //    $scope.show = 2;
        //}

        function gettaskbucket() {
            debugger;
            $scope.liststeps = [];
            $scope.listquestion = [];
            var obj = {};
            obj.taskid = $scope.selectedtask.taskid;
            obj.targetid = $scope.selectedtarget.targetid;
            var result = service.serverPost(config.urlGetTaskbucketById, progressModel.searchbyid, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                debugger;
                $scope.taskbucket = resolve.ResponseData;
                $scope.taskbucket.listrefimg = [];
                $scope.taskbucket.listuploadimg = [];
                if (resolve.ResponseData.refimage != null) {
                    $scope.taskbucket.listrefimg = resolve.ResponseData.refimage.split(",");
                    $scope.taskbucket.listrefimg.reverse();
                }
                if (resolve.ResponseData.imgpath != null) {
                    $scope.taskbucket.listuploadimg = resolve.ResponseData.imgpath.split(",");
                    $scope.taskbucket.listuploadimg.reverse();
                }

            }, function (reject) {
                alert('Not Resolved')
            });
        }

        //function gettaskbucket() {
        //    debugger;
        //    $scope.liststeps = [];
        //    var obj = {};
        //    obj.taskid = $scope.selectedtask.taskid;
        //    obj.targetid = $scope.selectedtask.id;
        //    var result = service.serverPost(config.urlGetTaskbucketById, progressModel.searchbyid, "", obj)
        //    result.then(function (resolve) {
        //        materials.hideSpinner();
        //        debugger;
        //        $scope.taskbucket = resolve.ResponseData;
        //        $scope.taskbucket.listrefimg = [];
        //        $scope.taskbucket.listuploadimg = [];
        //        if (resolve.ResponseData.refimage != null) {
        //            $scope.taskbucket.listrefimg = resolve.ResponseData.refimage.split(",")
        //        }
        //        if (resolve.ResponseData.imgpath != null) {
        //            $scope.taskbucket.listuploadimg = resolve.ResponseData.imgpath.split(",")
        //        }

        //    }, function (reject) {
        //        alert('Not Resolved')
        //    });
        //}

        function getquestion() {
            debugger;
            $scope.listquestion = [];
            var obj = {};
            obj.taskid = $scope.selectedtask.taskid;
            obj.targetid = $scope.selectedtarget.targetid;
            var result = service.serverPost(config.url_getalltaskchecklistanswer, progressModel.searchbyid, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.listquestion = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.downloadimg = function (path) {
            path = $scope.filepaths + path;
            //  window.open(path);
            $scope.open('lg', path);
        }

        $scope.open = function (size, img) {
            debugger;
            var obj = {};
            obj.img = img;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'taskimg.html',
                controller: 'taskimglCtrl',
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

        function getAllTasksteps() {
            debugger;
            $scope.liststeps = [];
            var obj = {};
            obj.id = $scope.selectedtask.taskid;
            var result = service.serverPost(config.urlGetTasksteps, progressModel.searchall_taskstep, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.liststeps = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = progressModel.ddlist;

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
        //$scope.removeUserpic = function () {

        //    $scope.editUserPic = undefined;
        //    $scope.task.refimage = undefined;
        //}

        //$scope.removestepImage = function (file, tasksteps) {
            
        //    if (tasksteps.sampleimage != null) {

        //        tasksteps.sampleimage = undefined;
        //    }
        //}

        //$scope.taskref = function (tskObj) {

        //    var objtask = tskObj;
        //    if (objtask.refimage != null) {

        //        $scope.uploadDocFilename = "";
        //        $scope.uploadDocExtension = "";
        //        $scope.uploadDocDisplayfilename = "";

        //        var file = objtask.refimage;
        //        var code = "EMPDOC";

        //        if (file.size != undefined) {

        //            var result = service.filePost(config.urlSaveFile, file, code);
        //            result.then(function (resolve) {

        //                if (resolve.ResponseData != null) {
        //                    $scope.taskData = resolve.ResponseData;
        //                    objtask.refimage = $scope.uploadDocFilename.concat($scope.taskData[0].filename);
        //                }
        //                $scope.uploadDocFilename = $scope.uploadDocFilename.concat($scope.taskData[0].filename);
        //                $scope.saveTask(objtask);

        //            }, function (reject) {
        //                console.log(reject.ResponseMessage);
        //            });

        //        }
        //        else {
        //            $scope.uploadexpFilename = "";
        //            $scope.saveTask(objtask);

        //        }
        //        return true;
        //    }
        //    else {
        //        $scope.uploadexpFilename = "";
        //        $scope.saveTask(objtask);
        //    }
        //};


        /////Start Task Steps/////

        //$scope.resultProofData = [];
        //$scope.resultProofData.push($scope.tasksteps);
        //$scope.addProofField = function () {

        //    $scope.tasksteps = {};
        //    $scope.resultStepData.push($scope.tasksteps);
        //}

        //function getAllTasksteps(selectedId) {

        //    var obj = {};
        //    obj.id = selectedId;
        //    var result = service.serverPost(config.urlGetTaskstepsById, taskstepsModel.searchbyid, "", obj)

        //    result.then(function (resolve) {
        //        materials.hideSpinner();
        //        $scope.resultStepData = resolve.ResponseData;

        //        init();
        //    }, function (reject) {
        //        alert('Not Resolved')
        //    });
        //}

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


       
        //function getAllTasksteppro(taskid, stepid) {

        //    var obj = {};
        //    obj.taskid = taskid;
        //    obj.taskstepid = stepid;
        //    var result = service.serverPost(config.urlGetTaskstepprogressById, taskstepprogressModel.searchbyid, "", obj)

        //    result.then(function (resolve) {
        //        materials.hideSpinner();
        //        $scope.resultProgressData = resolve.ResponseData;
        //        init();
        //    }, function (reject) {
        //        alert('Not Resolved')
        //    });
        //}

      

        //$scope.rowDataHide = function (row) {
        //    row.open = row.open
        //}

        //$scope.saveTask_steps = function (tskstpObj) {

        //    materials.showSpinner();
        //    var obj = tskstpObj;
        //    obj.sampleimage = $scope.uploadProofFilename;
        //    obj.status = 1;
        //    if (obj.id == null) {
        //        obj.createdby = 1;
        //        obj.createdat = new Date();
        //        var result = service.serverPost(config.urlSaveTasksteps, taskstepsModel.add, commonModel.trans, obj)
        //        result.then(function (resolve) {

        //            materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);
        //            //$scope.tasksteps = {};
        //            //getAllTasksteps(selectedId);
        //            materials.hideSpinner();
        //        }, function (reject) {
        //            alert('Not Resolved')
        //        });
        //    }
        //    else {
        //        obj.modifiedby = 1;
        //        obj.modifiedat = new Date();
        //        obj.status = 1;
        //        if (obj.ismandatory == true)
        //            obj.ismandatory = 1;
        //        else
        //            obj.ismandatory = 0;
        //        var result = service.serverPost(config.urlUpdateTasksteps, taskstepsModel.edit, commonModel.trans, obj)
        //        result.then(function (resolve) {
        //            //getAllTasksteps(selectedId);
        //            materials.hideSpinner();
        //            $scope.show = 1;

        //        }, function (reject) {
        //            alert('Not Resolved')
        //        });
        //    }
        //}

        //$scope.taskstepsUpload = function (tskstpObj) {


        //    tskstpObj.taskid = $scope.taskid;
        //    if (tskstpObj.step != undefined && tskstpObj.sequence != "" && tskstpObj.executionhrs != undefined && tskstpObj.weightage != undefined && tskstpObj.sampleimage != undefined && tskstpObj.sampleimage.length > 0) {

        //        $scope.uploadProofFilename = "";
        //        $scope.uploadProofExtension = "";
        //        $scope.uploadProofDisplayfilename = "";

        //        var file = tskstpObj.sampleimage;
        //        var code = "";
        //        if (file[0].size != undefined) {

        //            var result = service.filePost(config.urlSaveFile, file, code);
        //            result.then(function (resolve) {


        //                $scope.uploadProofFilename = "";
        //                $scope.uploadProofExtension = "";
        //                $scope.uploadProofDisplayfilename = "";

        //                $scope.proofData = resolve.ResponseData;

        //                for (var i = 0; i < $scope.proofData.length; i++) {

        //                    $scope.uploadProofFilename = $scope.uploadProofFilename.concat($scope.proofData[i].filename);
        //                    $scope.uploadProofExtension = $scope.uploadProofExtension.concat(config.urlEmployeeProof + "/" + $scope.proofData[i].extension + ',');
        //                    $scope.uploadProofDisplayfilename = $scope.uploadProofDisplayfilename.concat($scope.proofData[i].displayfilename + ',');

        //                }
        //                $scope.saveTask_steps(tskstpObj);

        //            }, function (reject) {
        //                console.log(reject.ResponseMessage);
        //            });

        //        }
        //        else {

        //            $scope.uploadProofFilename = tskstpObj.sampleimage;
        //            $scope.saveTask_steps(tskstpObj);
        //        }
        //        return true;
        //    }
        //    else {

        //        alert("Please fill all required field");
        //        return false;
        //    }

        //};

        /////End Task Steps///////

       

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
            ;
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



     //   var addobj = {
           
     //       "listinputs": [{
     //           "targetname": "targetname",
     //           "state": "state",
     //           "city": "city",
     //           "area": "area",
     //           "street": "street",
     //           "address": "address",
     //           "landmark": "landmark",
     //           "phoneno": "phoneno",
     //           "distributor": "distributor",
     //           "districontact": "districontact",
     //           "createdby": "createdby",
     //           "taskid": "taskid"
     //       }]
     //   };


     //   var approved = {
     //       "taskid": "taskid",
     //       "targetid": "targetid"
     //   };

        
     ////   

     //   $scope.verify = function (row, statusid) {
     //       debugger;
     //       row.isverycmtopen = false;
     //       if (statusid != 6) {
     //           var obj = {};
     //           obj.id = row.id;
     //           obj.statusid = statusid;
     //           obj.userid = sessionStorage.userid;
     //           obj.remarks = null;
     //           var result = service.serverPost(config.urlUpdateTaskstepprogressstatus, taskstepsModel.edit_status, "", obj)
     //           result.then(function (resolve) {
     //               materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);
     //               getAllTasksteps();
     //           }, function (reject) {
     //               alert('Not Resolved')
     //           });
     //       }
     //       else {
     //           for (var i = 0; i < $scope.liststeps.length; i++) {
     //               if ($scope.liststeps[i].id == row.id) {
     //                   $scope.liststeps[i].isverycmtopen = true;
     //               }
     //               else {
     //                   $scope.liststeps[i].isverycmtopen = false;
     //               }
     //           }
     //       }
     //   }


     //   $scope.updateverify = function (row, statusid) {
     //       debugger;
     //       var obj = {};
     //       obj.id = row.id;
     //       obj.statusid = statusid;
     //       obj.userid = sessionStorage.userid;
     //       obj.remarks = row.remarks;
     //       obj.userid = "";
     //       var result = service.serverPost(config.urlUpdateTaskstepprogressstatus, taskstepsModel.edit_status, "", obj)
     //       result.then(function (resolve) {
     //           materials.displayToast(appConstants.successClass, appConstants.tasksteps + ' ' + appConstants.saveMsg);
     //           getAllTasksteps();
     //       }, function (reject) {
     //           alert('Not Resolved')
     //       });
     //   }


        $scope.updateapproved = function (statusid,taskbucket) {
            debugger;
            var obj = {};
            //obj.targetid = $scope.selectedtask.id;
          //  obj.taskid = $scope.selectedtask.taskid;

            obj.taskid = $scope.selectedtask.taskid;
            obj.targetid = $scope.selectedtarget.targetid;
            obj.taskstatusid = statusid;
            obj.remark = $scope.remarks;
            obj.userid = taskbucket.userid;
            obj.auditby = null;
            materials.showSpinner();
            var result = service.serverPost(config.urlUpdateapprovedpaymentrequest, progressModel.approved, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                getaudittarget(0);
                var msg = statusid == 7 ? "Approved" : "Rejected";
                materials.displayToast(appConstants.successClass, msg + ' ' + appConstants.saveMsg);
                $scope.show = 1;
            }, function (reject) {
                materials.hideSpinner();
            });
        }


    }

    

})();


