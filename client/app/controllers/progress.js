(function () {
    'use strict';

    angular.module('app.table')
        .controller('ProgressCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'progressModel', 'commonModel',  ProgressCtrl])

    .controller('taskimglCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', taskimglCtrl]);

    function ProgressCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, progressModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.task = progressModel.add;
        $scope.remrksstatus = false;

        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(33);

        $scope.selectedtask;
        $scope.selectedtarget;

        $scope.listtask = [];
        $scope.listquestion = [];
        $scope.taskbucket = {};
        var projectid = 0, taskid = 0, stateid = 0, cityid = 0, agencyid = 0;
        $scope.grid = {};
        $scope.grid.fromdate = null;

       
        $scope.getSelectedRating = function (rating) {
            debugger;
            console.log(rating);
        }
        $scope.rate = 3;


        $scope.isReadonly = false;

      

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
            obj.clientid = 0;

            var result = service.serverPost(config.urlGettaskDD, progressModel.searchall_task, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listtask = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
      //  getAllTask(0)

        $scope.loadgrid = function () {
            debugger;
            // loadtask(projectid, taskid, stateid, cityid, agencyid);
            getaudittarget(projectid, taskid, stateid, cityid, agencyid);
        }

        function getaudittarget() {
            var obj = {};
            obj.projectid = projectid;
            obj.taskid = taskid;
            obj.stateid = stateid;
            obj.cityid = cityid;
            obj.agencyid = agencyid;
            obj.fromdate = $scope.grid.fromdate != null ? new Date($scope.grid.fromdate) : null;
            materials.showSpinner();
            var result = service.serverPost(config.urlgetaudittarget, progressModel.searchall, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                materials.hideSpinner();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        getaudittarget(projectid, taskid, stateid, cityid, agencyid);

        //function loadtask(projectid, taskid, stateid, cityid, agencyid) {
        //    var obj = {};
        //    obj.projectid = projectid;
        //    obj.taskid = taskid;
        //    obj.stateid = stateid;
        //    obj.cityid = cityid;
        //    obj.agencyid = agencyid;
        //    obj.fromdate = $scope.grid.fromdate != null ? new Date($scope.grid.fromdate) : null;
        //    materials.showSpinner();
        //    var result = service.serverPost(config.urlGetTaskNotDone, progressModel.searchall, "", obj)
        //    result.then(function (resolve) {
        //        $scope.resultData = resolve.ResponseData;
        //        materials.hideSpinner();
        //        init();
        //    }, function (reject) {
        //        alert('Not Resolved')
        //    });
        //}
        //loadtask(projectid, taskid, stateid, cityid, agencyid);

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
            obj.taskid = taskid;
            obj.stateid = stateid;
            obj.cityid = cityid;
            obj.agencyid = agencyid;
            obj.fromdate = $scope.grid.fromdate != null ? new Date($scope.grid.fromdate) : null;
            var result = service.serverPost(config.urlgetaudittask, progressModel.audit_task, "", obj)
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
            var result = service.serverPost(config.urlGetTasktarget, progressModel.target, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                debugger;
                $scope.listtasktarget = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }


        $scope.loadtaskstep = function (_task,_target) {
            $scope.selectedtask = _task;
            $scope.selectedtarget = _target;
            $scope.remarks = null;
            gettaskbucket();
           // getAllTasksteps();
            getquestion();
            $scope.show = 2;
        }

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

        $scope.downloadimg = function (path,taskname) {           
           path = $scope.filepaths + path;
           fetch(path)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                var a = document.createElement('a');
                a.href  = URL.createObjectURL(blob);
                a.download = taskname+'.jpg';
                document.body.appendChild(a);
                a.style = 'display: none';
                a.click();
                a.remove();
            });           
           $scope.open('lg', path);
        }

        $scope.open = function (size,img) {
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
                    obj['u_' + valParam[1]] = valParam[0] == "agency" ? "AGNS" : id;
                    obj['u_' + valParam[2]] = 0;
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

        function selectedItemChange(flag) {
            debugger;
            projectid = $scope.selectedprojectitem != undefined ? $scope.selectedprojectitem.id : 0;
            taskid = $scope.selectedtaskitem != undefined ? $scope.selectedtaskitem.id : 0;
            stateid = $scope.selectedstateitem != undefined ? $scope.selectedstateitem.id : 0;
            cityid = $scope.selectedcityitem != undefined ? $scope.selectedcityitem.id : 0;

            agencyid = $scope.selectedagencyitem != undefined ? $scope.selectedagencyitem.id : 0;

            if (flag == "S") {
                $scope.loadDropDown(stateid, "stateid");
            }
            else if (flag == "P" ) {
                $scope.loadDropDown(projectid, "projectid");
               
            }

            getaudittarget(projectid, taskid, stateid, cityid, agencyid);
           // loadtask(projectid, taskid, stateid, cityid, agencyid);

            //if (item != undefined) {
            //    selectedId = item.id;
            //    eval('getAll' + column + '(' + item.id + ')');
            //}
            //else
            //    getTaskNoteDone(1);


        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }



        $scope.updateapproved = function (statusid,taskbucket) {
            debugger;
            var obj = {};
         //   $scope.selectedtask;
          //  $scope.selectedtarget;
            obj.targetid = $scope.selectedtarget.targetid;
            obj.taskid = $scope.selectedtask.taskid;
            obj.taskstatusid = statusid;
            obj.remark = $scope.remarks;
            obj.userid = taskbucket.userid;
            obj.projectid = taskbucket.projectid;
            obj.auditby = sessionStorage.userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlUpdateapprovedpaymentrequest, progressModel.approved, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                // loadtask(projectid, taskid, stateid, cityid, agencyid);
                getaudittarget(projectid, taskid, stateid, cityid, agencyid);
                var msg = statusid == 7 ? "Approved" : "Rejected";
                materials.displayToast(appConstants.successClass, msg + ' ' + appConstants.saveMsg);
                $scope.show = 1;

            }, function (reject) {
                //  alert('Not Resolved')
            });
        }


    }

    
    function taskimglCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        debugger;
        $scope.upimag = items.img;
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }

})();


