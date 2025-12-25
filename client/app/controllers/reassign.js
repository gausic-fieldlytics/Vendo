(function () {
    'use strict';

    angular.module('app.table')
        .controller('RessignCtrl', ['$q',  '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'reassignModel', 'commonModel', RessignCtrl])
 
    function RessignCtrl($q, $scope, $http, $filter,$uibModal, $mdDialog, config, appConstants, service, materials, reassignModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.taskbucket = reassignModel.add;
        $scope.listuser = [];
        $scope.targetnodes = [];
        $scope.listagencytask = [];
        $scope.items = [];
        $scope.selected = [];
        $scope.ddlagencyid = null;
        $scope.usertype = 0;
        $scope.assignusertype = 0;
        $scope.listagency = [];
        $scope.selectedIndex = 0;
        $scope.ddlassignuserid = null;
        $scope.listtargetselection = [];
        $scope.assign_targetnodes = [];

        $scope.deleteTaskbucket = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.taskbucket);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTaskbucket, reassignModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.taskbucket + ' ' + appConstants.deleteMsg);
                        getAllTaskbucket(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTaskbucket = function (rowData) {

            $scope.show = 2;
            $scope.taskbucket = angular.copy(rowData);
            original = angular.copy($scope.taskbucket);

        }

        $scope.revert = function () {
            $scope.taskbucket = angular.copy(original);
			$scope.taskbucket = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.taskbucket, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.taskbucket, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTaskbucket = function (rowData) {
            debugger;
            $scope.ddltask = angular.copy(rowData);
            $scope.loadtarget();
        }

      
        //$rootScope.$on('loadtaskbucket', function (event, args) {
        //    debugger;
        //    $scope.loadtarget();
        //});

        //function loaduser () {
        //    debugger;
        //    var obj = {};
        //    obj.userid = sessionStorage.userid;
        //    var result = service.serverPost(config.urlGetsubagent, reassignModel.target, "", obj)
        //    result.then(function (resolve) {
        //        materials.hideSpinner();
        //        debugger;
        //        $scope.listuser = resolve.ResponseData;
        //    }, function (reject) {
        //        alert('Not Resolved')
        //    });
        //}
        //loaduser();

      
        

        $scope.addTaskbucket = function () {
            this.taskbucket = "";
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
        $scope.numPerPageOpt = [50, 200, 500, 1000];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function getAllTaskbucket(_id) {
            var obj = {};
            obj.agencyid = $scope.usertype == 0 ? _id : 0;
            obj.userid = $scope.usertype == 1 ? _id : 0;

            var result = service.serverPost(config.urlgetallagencytask, reassignModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                var oResult = resolve.ResponseData;
                loadtargetreeview(oResult);
            }, function (reject) {
                alert('Not Resolved')
            });
        }


        function loadtargeselectiontreeview(oProjectlist) {
            try {
                var listproject = oProjectlist;
                $scope.assign_targetnodes = [];
                for (var i = 0; i < listproject.length; i++) {

                    var procode = "P_" + generateUniqueString();
                    var name = listproject[i].projectname + " " + "(" + listproject[i].citycount + ")" + " " + listproject[i].amount;
                    var rootDir = { name: name, flag: "P", code: procode, id: procode + listproject[i].projectid, children: [], pid: procode, listselectid: [] };
                    var citytarget = listproject[i].listcitytarget;

                    for (var j = 0; j < citytarget.length; j++) {
                        var name = citytarget[j].cityname + " " + "(" + citytarget[j].areacount + ")" + " " + citytarget[j].amount;
                        var citycode = "C_" + generateUniqueString();
                        var citydir = { name: name, flag: "C", code: citycode, id: citycode + citytarget[j].cityid, children: [], pid: citycode, listselectid: [] };
                        var listarea = citytarget[j].listareatarget;

                        for (var k = 0; k < listarea.length; k++) {
                            var name = listarea[k].areaname + " " + "(" + listarea[k].targetcount + ")" + " " + listarea[k].amount;
                            var areacode = "A_" + generateUniqueString();
                            var areadir = { name: name, flag: "A", code: areacode, id: areacode + listarea[k].areaid, children: [], pid: areacode, listselectid: [] };
                            var listtarget = listarea[k].listtarget;

                            for (var l = 0; l < listtarget.length; l++) {
                                var name = listtarget[l].targetname + " " + "(" + listtarget[l].taskcount + ")" + " " + listtarget[l].amount;
                                var tarcode = "TAR_" + generateUniqueString();
                                var tardir = { name: name, flag: "TAR", code: tarcode, id: (tarcode + listtarget[l].targetid), projectid: listproject[i].projectid, children: [], pid: tarcode, listselectid: [] };
                                var listtask = listtarget[l].listcompletetask;

                                for (var m = 0; m < listtask.length; m++) {

                                    var name = listtask[m].taskname + " " + "(" + listtask[m].taskstepcount + ")" + " " + listtask[m].amount;
                                    var taskcode = "T_" + generateUniqueString();
                                    var taskdir = { name: name, flag: "T", code: tarcode, id: tarcode + listtask[m].taskid, projectid: listtask[m].projectid, children: [], pid: taskcode, listselectid: [] };
                                    tardir.children.push(taskdir);
                                }

                                areadir.children.push(tardir);
                            }

                            citydir.children.push(areadir);
                        }

                        rootDir.children.push(citydir);
                    }
                    $scope.assign_targetnodes.push(rootDir);
                }
                materials.hideSpinner();
            }
            catch (exception) {
                materials.hideSpinner();
            }

        }

        function loadtargetselection(userid) {
            var obj = {};
            obj.userid = userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlgettaskselection, reassignModel.targetselection, "", obj)
            result.then(function (resolve) {
                var oResult = resolve.ResponseData;
                $scope.listtargetselection = oResult;
                loadtargeselectiontreeview(oResult);
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }


        function getallassigntask() {
            $scope.items = [];
            var obj = {};
            obj.agencyid = sessionStorage.userid;;
            var result = service.serverPost(config.urlgetagencyassigntask, reassignModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listagencytask = resolve.ResponseData;
                for (var i = 0; i < $scope.listagencytask.length; i++) {
                    $scope.items.push($scope.listagencytask[i].id);
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }
       // getallassigntask();

        function loadtargetreeview(oProjectlist) {
            debugger;
            var listproject = oProjectlist;
            $scope.targetnodes = [];
            for (var i = 0; i < listproject.length; i++) {

                var procode = "P_" + generateUniqueString();

                var name = listproject[i].projectname + " " + "(" + listproject[i].citycount + ")" + " " + listproject[i].amount;
                var rootDir = { name: name, flag: "P", code: procode, id: procode + listproject[i].projectid, children: [] };

                var citytarget = listproject[i].listcitytarget;
                for (var j = 0; j < citytarget.length; j++) {
                    var name = citytarget[j].cityname + " " + "(" + citytarget[j].areacount + ")" + " " + citytarget[j].amount;
                    var citycode = "C_" + generateUniqueString();
                    var citydir = { name: name, flag: "C", code: citycode, id: citycode + citytarget[j].cityid, children: [] };


                    var listarea = citytarget[j].listareatarget;
                    for (var k = 0; k < listarea.length; k++) {
                        var name = listarea[k].areaname + " " + "(" + listarea[k].targetcount + ")" + " " + listarea[k].amount;
                        var areacode = "A_" + generateUniqueString();
                        var areadir = { name: name, flag: "A", code: areacode, id: areacode + listarea[k].areaid, children: [] };

                        debugger;
                        var listtarget = listarea[k].listtarget;
                        for (var l = 0; l < listtarget.length; l++) {
                            var name = listtarget[l].targetname + " " + "(" + listtarget[l].taskcount + ")" + " " + listtarget[l].amount;
                            var tarcode = "TAR_" + generateUniqueString();
                            var tardir = { name: name, flag: "TAR", code: tarcode, iscancel: listtarget[l].iscancel, id: (tarcode + listtarget[l].targetid), projectid: listproject[i].projectid, children: [] };


                            var listtask = listtarget[l].listcompletetask;
                            for (var m = 0; m < listtask.length; m++) {
                                var name = listtask[m].taskname + " " + "(" + listtask[m].taskstepcount + ")" + " " + listtask[m].amount;
                                var taskcode = "T_" + generateUniqueString();
                                var taskdir = { name: name, flag: "T", code: tarcode, id: tarcode + listtask[m].taskid, projectid: listtask[m].projectid, children: [] };


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


        $scope.loadtask = function (node) {
            var d = $scope.targetnodes;
            if (node.flag == "TAR") {
                debugger;
                getAllTaskbytarget(node, node.id.replace(node.code, ""), node.projectid);
            }
            else if (node.flag == "T") {
                getAllTasksteps(node, node.id.replace(node.code, ""), false);
            }

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


        function getAllTaskbytarget(targetlist, targetid, projectid) {
            debugger;
            targetlist.children = [];
            var obj = {};
            obj.targetid = targetid;
            obj.projectid = projectid;
            obj.flag = "N";
            obj.agencyid = sessionStorage.userid;
            var result = service.serverPost(config.urlGetallagencyTaskbytarget, reassignModel.bytarget, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                var oResult = resolve.ResponseData;
                for (var i = 0; i < oResult.length; i++) {
                    var name = oResult[i].tasktitle + " " + "(" + oResult[i].taskstepcount + ")" + " " + oResult[i].amount;
                    var tacode = "T_" + generateUniqueString();
                    var taskDir = { name: name, flag: "T", code: tacode, id: tacode + oResult[i].id, children: [] };
                    targetlist.children.push(taskDir);
                }

            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function getAllTasksteps(tasklist, taskid, isview) {
            if (isview) {
                tasklist.folders = [];
            }
            else {
                tasklist.children = [];
            }

            var obj = {};
            obj.id = taskid;
            var result = service.serverPost(config.urlGetTasksteps, reassignModel.steps, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();

                var oResult = resolve.ResponseData;
                for (var i = 0; i < oResult.length; i++) {


                    if (isview) {
                        var taskDir = { name: oResult[i].step, flag: "S", id: oResult[i].id, folders: [] };
                        tasklist.folders.push(taskDir);
                    }
                    else {
                        var taskDir = { name: oResult[i].step, flag: "S", id: oResult[i].id };
                        tasklist.children.push(taskDir);
                    }


                }

                //   init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.updatecancel = function () {
            debugger;

            var data = $scope.targetnodes;
            var lstinput = [];
            var lsttargetid = [];

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
                                    lstinput.push(lsttask[m].id.replace(lsttask[m].code, ""));
                                    lsttargetid.push(lsttarget[l].id.replace(lsttarget[l].code, ""));
                                }
                            }
                        }
                    }
                }
            }
            var newparam = {};
            newparam.taskid = lstinput.join(",");
            newparam.targetid = lsttargetid.join(",");

            newparam.agencyid = $scope.usertype == 0 ? $scope.ddlagencyid : null;
            newparam.userid = $scope.usertype == 1 ? $scope.ddlagencyid : null;


            if (lstinput.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.urlcanceltaskbucketbyagency, reassignModel.edit, "", newparam)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    $scope.targetnodes = [];
                    $scope.ddlsubagent = null;
                    materials.displayToast(appConstants.successClass, appConstants.targetcancel + ' ' + "");
                    getAllTaskbucket($scope.ddlagencyid)
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                alert('Select any one Target.')
            }
        }
        
        $scope.assignuser = function () {
            debugger;
            var data = $scope.assign_targetnodes;
            var lstinput = [];
            var obj = {};
            for (var i = 0; i < $scope.assign_targetnodes.length; i++) {
                var newcitytarget = $scope.assign_targetnodes[i].children;
                for (var j = 0; j < newcitytarget.length; j++) {
                    var areatarget = newcitytarget[j].children;
                    for (var k = 0; k < areatarget.length; k++) {
                        var lsttarget = areatarget[k].children;
                        for (var l = 0; l < lsttarget.length; l++) {
                            var lsttask = lsttarget[l].children;
                            for (var m = 0; m < lsttask.length; m++) {
                                if (lsttask[m].checked) {
                                    var newparam = {};
                                    newparam.taskid = lsttask[m].id.replace(lsttask[m].code, "");
                                    newparam.targetid = lsttarget[l].id.replace(lsttarget[l].code, "");
                                    newparam.userid = $scope.ddlassignuserid;
                                    lstinput.push(newparam);
                                  
                                }
                            }
                        }

                    }
                }
            }


            obj.listinputs = lstinput;
            if (lstinput.length > 0) {
                materials.showSpinner();
                var url = $scope.assignusertype == 0 ? config.urlSaveTaskbucket : config.urlSaveTaskbucketbymobile;
                var result = service.serverPost(url, reassignModel.taskbucket_add, "", obj)
                result.then(function (resolve) {
                    $scope.FilerGrid($scope.assignusertype, 'A');
                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.taskpicked + ' ' + appConstants.saveMsg);
                    setTimeout(function () {
                        loadtargetselection($scope.ddlassignuserid);
                    },1000);
                   
                    
                   
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                materials.displayToast(appConstants.successClass, "Select atlest one target." + ' ' + "");
            }
        }

        $scope.updateassign = function () {
            debugger;

            if ($scope.ddlsubagent != null) {

                var data = $scope.targetnodes;
                var lstinput = [];
                var lsttargetid = [];

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
                                        lstinput.push(lsttask[m].id.replace(lsttask[m].code, ""));
                                        lsttargetid.push(lsttarget[l].id.replace(lsttarget[l].code, ""));
                                    }
                                }
                            }

                        }
                    }
                }

                var _user = $.grep($scope.listuser, function (_obj) {
                    return _obj.id == $scope.ddlsubagent;
                })[0];

                
                var newparam = {};
                newparam.taskid = lstinput.join(",");
                newparam.targetid = lsttargetid.join(",");
                newparam.agencyid = _user.usertypecode == "AGNS" ? $scope.ddlsubagent : null;
                newparam.userid = _user.usertypecode == "ISP" ? $scope.ddlsubagent : null;
                newparam.oldagencyid = $scope.usertype == 0 ? $scope.ddlagencyid : null;
                newparam.olduserid = $scope.usertype == 1 ? $scope.ddlagencyid : null;

                if (lstinput.length > 0) {
                    materials.showSpinner();
                    var result = service.serverPost(config.urlUpdateagencyreassign, reassignModel.edit, "", newparam)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        $scope.targetnodes = [];
                        $scope.ddlsubagent = null;
                        $scope.ddlagencyid = null;
                        $scope.searchText = null;
                        $scope.selectedItem = null;
                        materials.displayToast(appConstants.successClass, appConstants.targetassign + ' ' );
                        getAllTaskbucket(0)
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
                else {
                    alert('Select any one Target.')
                }
            }
            else {
                alert('Select any one Agency.')
            }
        }

        $scope.updatereassign = function () {
            debugger;

            if ($scope.ddlselectsubagent != null) {
                var newobj = {};
                    var data = $scope.targetnodes;
                    var lstinput = [];
                    var lsttargetid = [];

                    for (var i = 0; i < $scope.listagencytask.length; i++) {
                       
                        lstinput.push($scope.listagencytask[i].id);
                    }

                    if (lstinput.length > 0) {
                        var newparam = {};
                        newparam.id = lstinput.join(",");;
                        newparam.agencyid = sessionStorage.userid;
                        newparam.userid = $scope.ddlselectsubagent;

                       // newobj.listinputs = lstinput;
                        materials.showSpinner();
                        var result = service.serverPost(config.urlUpdatereassign, reassignModel.reassign, "", newparam)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        $scope.ddlselectsubagent = null;
                        materials.displayToast(appConstants.successClass, appConstants.targetassign + ' ' + "");
                        getallassigntask();
                    }, function (reject) {
                        alert('Not Resolved')
                    });
                }
                else {
                    alert('Select any one Target.')
                }
            }
            else {
                alert('Select any one AR.')
            }
        }

        $scope.toggle = function (item, list) {

            var idx = $scope.selected.indexOf(item);
            if (idx > -1) {
                $scope.selected.splice(idx, 1);
            }
            else {
                $scope.selected.push(item);
            }
        };

        $scope.exists = function (item, list) {

            return $scope.selected.indexOf(item) > -1;
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



        //$scope.loadChilds = function (id, varId) {
        //    $scope.loadDropDown(id, varId);
        //}

        $scope.FilerassignGrid = function (usertype) {
            debugger;
            
            //$scope.loadDropDown( code);
        }

        $scope.FilerGrid = function (usertype,assigntype) {
            debugger;
            
            if (assigntype == "A") {
                $scope.searchassignagn = null;
                $scope.selectedassignItem = null;
                $scope.searchassignispText = null;
                $scope.selectedassignispItem = null;
                var code = usertype == 1 ? "ISP" : "AGNS";
                $scope.listagency = $filter('filter')($scope.listuser, { usertypecode: code }, true);
            }
            else {
                $scope.searchText = null;
                $scope.selectedItem = null;
                $scope.searchispText = null;
                $scope.selectedispItem = null;
                var code = usertype == 1 ? "ISP" : "AGNS";
                $scope.listagency = $filter('filter')($scope.listuser, { usertypecode: code }, true);
            }
            

            //$scope.loadDropDown( code);
        }

        $scope.loadDropDown = function (id) {
            debugger;
            var ddlistModel = reassignModel.ddlist;

            for (var key in ddlistModel) {
               
                var obj = {};
                var valParam = {};
                var keyParam = null;

                valParam = ddlistModel[key].split('~');
                //Only for selection changed
                //if (varId != '' && valParam[1] != varId) {
                //    continue;
                //}
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
                    $scope.listuser = resolve.ResponseData;
                    $scope.FilerGrid(0)
                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(null);
	 
        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

       

		$scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;

        function querySearch(query, column,isisp) {
            
            var key = 'list' + column;
            var suchname = isisp == "ISP" ? "username" : "agencyname";
            var results = query ? $scope[key].filter(createFilter(query, suchname)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(sourcefrom, usertype) {
            debugger;
            if (sourcefrom == "RA") {
                if ($scope.usertype == 1) {
                    $scope.ddlagencyid = $scope.selectedispItem != undefined ? $scope.selectedispItem.id : 0;
                }
                else {
                    $scope.ddlagencyid = $scope.selectedItem != undefined ? $scope.selectedItem.id : 0;
                }

                getAllTaskbucket($scope.ddlagencyid);
            }
            else {

                if (usertype == "AGN") {
                    $scope.ddlassignuserid = $scope.selectedassignItem != undefined ? $scope.selectedassignItem.id : 0;
                }
                else {
                    $scope.ddlassignuserid = $scope.selectedassignispItem != undefined ? $scope.selectedassignispItem.id : 0;
                }

                loadtargetselection($scope.ddlassignuserid, usertype);
            }
            

			//selectedId = item.id;
           // eval('getAll' + column + '(' + item.id + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

    }

})();


