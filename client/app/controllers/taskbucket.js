(function () {
    'use strict';

    angular.module('app.table')
        .controller('TaskbucketCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'taskbucketModel', 'commonModel', TaskbucketCtrl])
        .controller('taskexcelCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', taskexcelCtrl])
    function TaskbucketCtrl($q, $rootScope, $scope, $http, $filter,$uibModal, $mdDialog, config, appConstants, service, materials, taskbucketModel, commonModel) {
		var selectedId = 0;
        var original;
        var init;
        this.taskbucket = taskbucketModel.add;
        $scope.listuser = [];
        $scope.targetnodes = [];
        $scope.listagencytask = [];
        $scope.items = [];
        $scope.selected = [];
        $scope.listcollecteditem = [];
        $scope.listproject = [];
        $scope.ddlprojectid = 0;
        $scope.deleteTaskbucket = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.taskbucket);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTaskbucket, taskbucketModel.delete, commonModel.trans, delObj);
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

      
        $rootScope.$on('loadtaskbucket', function (event, args) {
           init();
        });

        function loaduser () {
            debugger;
            var obj = {};
            obj.userid = sessionStorage.userid;
            var result = service.serverPost(config.urlGetsubagent, taskbucketModel.target, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                debugger;
                $scope.listuser = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        
        init();
                
        function init(){
            loaduser();
            getAllTaskbucket();
            loadcollecteditem();
            getagencypickproject();
        }

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

        function getAllTaskbucket(selectedId) {
            var obj = {};
            obj.agencyid = sessionStorage.userid;;
            var result = service.serverPost(config.urlgetagencytask, taskbucketModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                var oResult = resolve.ResponseData;
                loadtargetreeview(oResult);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        
        function getallassigntask() {
            $scope.items = [];
            var obj = {};
            obj.agencyid = sessionStorage.userid;;
            var result = service.serverPost(config.urlgetagencyassigntask, taskbucketModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.items = [];
                $scope.selected = [];
                $scope.listagencytask = resolve.ResponseData;
                for (var i = 0; i < $scope.listagencytask.length; i++) {
                    $scope.items.push($scope.listagencytask[i].id);
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadassigntask = function () {
            debugger;
            getallassigntask();
        }

       

        $scope.getcollecteditem = function () {
            loadcollecteditem();
        }

        function loadcollecteditem() {
            var obj = {};
            obj.userid =  sessionStorage.userid;
            obj.projectid = $scope.ddlprojectid;
            var result = service.serverPost(config.urlgettaskcollecteditem, taskbucketModel.targetselection, "", obj)
            result.then(function (resolve) {

                var oResult = resolve.ResponseData;
                $scope.listcollecteditem = oResult;
               // loadtargetreeview(oResult);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        
        function getagencypickproject() {
            var obj = {};
            obj.agencyid = sessionStorage.userid;;
            var result = service.serverPost(config.urlgetagencypickproject, taskbucketModel.searchall, "", obj)
            result.then(function (resolve) {
                debugger;
                $scope.listproject = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        


        function loadtargetreeview(oProjectlist) {
            debugger;
            var listproject = oProjectlist;
            $scope.targetnodes = [];
            for (var i = 0; i < listproject.length; i++) {

                var procode = "P_" + generateUniqueString(); //Project
                var name = listproject[i].projectname + " " + "(" + listproject[i].citycount + ")" + " " + listproject[i].amount;
                var rootDir = { name: name, flag: "P", code: procode, id: procode + listproject[i].projectid,pid: null, children: [] };
                var citytarget = listproject[i].listcitytarget;

                for (var j = 0; j < citytarget.length; j++) {

                    var name = citytarget[j].cityname + " " + "(" + citytarget[j].areacount + ")" + " " + citytarget[j].amount; //City
                    var citycode = "C_" + generateUniqueString();
                    var citydir = { name: name, flag: "C", code: citycode, id: citycode + citytarget[j].cityid, children: [], pid: procode, listselectid: [] };
                    var listarea = citytarget[j].listareatarget;

                    for (var k = 0; k < listarea.length; k++) {
                        var name = listarea[k].areaname + " " + "(" + listarea[k].targetcount + ")" + " " + listarea[k].amount; //Area
                        var areacode = "A_" + generateUniqueString();
                        var areadir = { name: name, flag: "A", code: areacode, id: areacode + listarea[k].areaid, children: [], pid: citycode, listselectid: [] };
                        var listtarget = listarea[k].listtarget;

                        for (var l = 0; l < listtarget.length; l++) {
                            var name = listtarget[l].targetname + " " + "(" + listtarget[l].taskcount + ")" + " " + listtarget[l].amount; //Target
                            var tarcode = "TAR_" + generateUniqueString();
                            var tardir = { name: name, flag: "TAR", code: tarcode, id: (tarcode + listtarget[l].targetid), projectid: listproject[i].projectid, children: [], pid: areacode, listselectid: [] };
                            var listtask = listtarget[l].listcompletetask;

                            for (var m = 0; m < listtask.length; m++) {
                                var name = listtask[m].taskname + " " + "(" + listtask[m].taskstepcount + ")" + " " + listtask[m].amount; //Task
                                var taskcode = "T_" + generateUniqueString();
                                var taskdir = { name: name, flag: "TASK", code: tarcode, id: tarcode + listtask[m].taskid, projectid: listtask[m].projectid, children: [], pid: tarcode, listselectid: [] };
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
            debugger;
            var d = $scope.targetnodes;
            //if (node.flag == "TAR") {
            //    debugger;
            //    getAllTaskbytarget(node, node.id.replace(node.code, ""), node.projectid);
            //}
            //else if (node.flag == "TASK") {
            //    getAllTasksteps(node, node.id.replace(node.code, ""), false);
            //}

            if (node.flag == "TASK") {
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
         //   targetlist.children = [];
            var obj = {};
            obj.targetid = targetid;
            obj.projectid = projectid;
            obj.flag = "N";
            obj.agencyid = sessionStorage.userid;
            var result = service.serverPost(config.urlGetallagencyTaskbytarget, taskbucketModel.bytarget, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                var tempArray = [];
                var oResult = resolve.ResponseData;
                for (var i = 0; i < oResult.length; i++) {
                    var name = oResult[i].tasktitle + " " + "(" + oResult[i].taskstepcount + ")" + " " + oResult[i].amount;
                    var tacode = "T_" + generateUniqueString();
                    var taskDir = { name: name, flag: "TASK", code: tacode, id: tacode + oResult[i].id, children: [] };
                    tempArray.push(taskDir);
                }
                targetlist.children=  tempArray
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
            var result = service.serverPost(config.urlGetTasksteps, taskbucketModel.steps, "", obj)
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
            newparam.agencyid = sessionStorage.userid;
          //  newparam.userid = $scope.ddlsubagent;

            if (lstinput.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.urlcanceltaskbucketbyagency, taskbucketModel.edit, "", newparam)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    $scope.targetnodes = [];
                    $scope.ddlsubagent = null;
                    materials.displayToast(appConstants.successClass, appConstants.targetcancel + ' ' + "");
                    getAllTaskbucket(0)
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                alert('Select any one Target.')
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

                //for (var i = 0; i < $scope.targetnodes.length; i++) {
                //    var newcitytarget = $scope.targetnodes[i].children;
                //    for (var j = 0; j < newcitytarget.length; j++) {
                //        var areatarget = newcitytarget[j].children;
                //        for (var k = 0; k < areatarget.length; k++) {
                //            var lsttarget = areatarget[k].children;
                //            for (var l = 0; l < lsttarget.length; l++) {
                //                var lsttask = lsttarget[l].children;
                //                for (var m = 0; m < lsttask.length; m++) {
                //                    if (lsttask[m].checked) {

                //                        lstinput.push(lsttask[m].id.replace(lsttask[m].code, ""));
                //                        lsttargetid.push(lsttarget[l].id.replace(lsttarget[l].code, ""));
                //                    }
                //                }
                //            }

                //        }
                //    }
                //}

                var newparam = {};
                newparam.taskid = lstinput.join(",");
                newparam.targetid = lsttargetid.join(",");
                newparam.agencyid = sessionStorage.userid;
                newparam.userid = $scope.ddlsubagent;

                if (lstinput.length > 0) {
                    materials.showSpinner();
                    var result = service.serverPost(config.urlUpdateTaskbucket, taskbucketModel.edit, "", newparam)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        $scope.targetnodes = [];
                        $scope.ddlsubagent = null;
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
                alert('Select any one AR.')
            }
        }

        $scope.updatereassign = function () {
            debugger;

            if ($scope.ddlselectsubagent != null) {
                var newobj = {};
                var data = $scope.targetnodes;
                var lstd = $scope.selected;
                    var lstinput = [];
                    var lsttargetid = [];
                    for (var i = 0; i < $scope.selected.length; i++) {
                        lstinput.push($scope.selected[i]);
                    }
                    //for (var i = 0; i < $scope.listagencytask.length; i++) {
                    //    lstinput.push($scope.listagencytask[i].id);
                    //}

                    if (lstinput.length > 0) {
                        var newparam = {};
                        newparam.id = lstinput.join(",");;
                        newparam.agencyid = sessionStorage.userid;
                        newparam.userid = $scope.ddlselectsubagent;

                       // newobj.listinputs = lstinput;
                        materials.showSpinner();
                        var result = service.serverPost(config.urlUpdatereassign, taskbucketModel.reassign, "", newparam)
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



        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {
           
            var ddlistModel = taskbucketModel.ddlist;

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

        function querySearch(query, column) {
            var key = 'list' + column;
            var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function selectedItemChange(item, column) {
			selectedId = item.id;
            eval('getAll' + column + '(' + item.id + ')');
        }

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.animationsEnabled = true;

        $(document).ready(function () {
            $('#files').change(handleFile);
        });

        function handleFile(e) {
            
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
                   
                    for (i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function (e) {
                            materials.showSpinner();
                            var data = e.target.result;
                            var result;
                            var workbook = XLSX.read(data, { type: 'binary' });
                            //incount = workbook.SheetNames.length;
                            incount = 1;
                            var sheet_name_list = workbook.SheetNames;
                            $scope.listalltask = [];
                            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                                //Convert the cell value to Json
                                console.log('123')
                                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                console.log();
                                //   var roa = workbook.Sheets[y];
                                result = [];
                                if (roa.length > 0) {
                                    result = roa;
                                }
                                columncount = 0;
                                $scope.uploadedItems = result;
                                //$scope.listalltask = result;
                               
                                
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
                                            var _taskname = $scope.uploadedItems[m]["Task"];                                           
                                            var _targetname = $scope.uploadedItems[m]["Target"];
                                            var _arname = $scope.uploadedItems[m]["AR Name"];
                                            // var _statename = $scope.uploadedItems[m]["State"];
                                            // var _cityname = $scope.uploadedItems[m]["City"];
                                            // var _areaname = $scope.uploadedItems[m]["Area"];

                                            // _statename = _statename != null ? _statename.toLowerCase().trim() : "";
                                            // _cityname = _cityname != null ? _cityname.toLowerCase().trim() : "";
                                            // _areaname = _areaname != null ? _areaname.toLowerCase().trim() : "";

                                            var ar = $filter('filter')($scope.listuser, function (value) {
                                                var arname = value.lastname != null ? (value.firstname.toLowerCase().trim() +" "+value.lastname.toLowerCase().trim()): value.firstname.toLowerCase().trim();
                                                return arname == _arname.toLowerCase().trim();  
                                            })[0];
                                            var target,task;
                                            $filter('filter')($scope.targetnodes, function (value) {
                                                $filter('filter')(value.children, function (value1) {   
                                                    $filter('filter')(value1.children, function (value2) {
                                                        $filter('filter')(value2.children, function (value3) {
                                                            var _target = value3.name.toLowerCase().trim().split(' ').slice(0,-2).join(' ');
                                                            if(_target == _targetname.toLowerCase().trim())
                                                                return target = value3;
                                                            // if(_target != null){
                                                            //     return _target[0].toLowerCase().trim() == _targetname.toLowerCase().trim()
                                                            //    if(_target.toLowerCase().trim() == _targetname.toLowerCase().trim())
                                                            //     target = _target[0];
                                                            // }
                                                        })[0];
                                                        $filter('filter')(value2.children, function (value3) {
                                                            var _target = value3.name.toLowerCase().trim().split(' ').slice(0,-2).join(' ');
                                                            if(_target == _targetname.toLowerCase().trim())
                                                            $filter('filter')(value3.children, function (value4) {
                                                                var _task = value4.name.toLowerCase().trim().split(' ').slice(0,-2).join(' ');
                                                                if(_task == _taskname.toLowerCase().trim())
                                                                    return task = value4;
                                                                //var _task = value4.name.toLowerCase().trim().match(_taskname.toLowerCase().trim())
                                                                // if(_task != null){
                                                                //     return _task[0].toLowerCase().trim() == _taskname.toLowerCase().trim();
                                                                // }
                                                            })[0];                                                            
                                                        })
                                                    })
                                                })                                              
                                            }); 

                                            // var city = $filter('filter')($scope.listallcity, function (value) {
                                            //     return value.cityname.toLowerCase().trim() == _cityname;
                                            // })[0];

                                            // var area = $filter('filter')($scope.listallarea, function (value) {
                                            //     return value.areaname.toLowerCase().trim() == _areaname;
                                            // })[0];


                                             newtarget.arid = ar != null ? ar.id : null;
                                             newtarget.targetid = target != null ? target.id.replace(target.code, "") : null;
                                             newtarget.taskid = task != null ? task.id.replace(task.code, "") : null;
                                             newtarget.arname = $scope.uploadedItems[m]["AR Name"];
                                             newtarget.taskname = $scope.uploadedItems[m]["Task"];
                                             newtarget.targetname = $scope.uploadedItems[m]["Target"];
                                            // newtarget.cityid = city != null ? city.id : null;
                                            // newtarget.areaid = area != null ? area.id : null;

                                            // newtarget.state = $scope.uploadedItems[m]["State"];
                                            // newtarget.city = $scope.uploadedItems[m]["City"];
                                            // newtarget.area = $scope.uploadedItems[m]["Area"];
                                            // newtarget.street = $scope.uploadedItems[m]["Street"] != undefined ? $scope.uploadedItems[m]["Street"] : null;
                                            // newtarget.address = $scope.uploadedItems[m]["Address"];
                                            // newtarget.phoneno = $scope.uploadedItems[m]["Contact"];
                                            // newtarget.pickuplocation = $scope.uploadedItems[m]["Pickup Location"];
                                            // newtarget.landmark = $scope.uploadedItems[m]["Land Mark"] != undefined ? $scope.uploadedItems[m]["Land Mark"] : null;

                                            // newtarget.distributor = $scope.uploadedItems[m]["Distributor"];
                                            // newtarget.districontact = $scope.uploadedItems[m]["Distributor Contact"];

                                            // newtarget.supportcontact = $scope.uploadedItems[m]["Support Contact"];
                                            // newtarget.supportnumber = $scope.uploadedItems[m]["Support Number"];
                                            // newtarget.lat = $scope.uploadedItems[m]["Latitude"];
                                            // newtarget.lng = $scope.uploadedItems[m]["Longitude"];



                                            if (newtarget.arid != null && newtarget.targetid != null && newtarget.taskid != null) {
                                                $scope.listalltask.push(newtarget);
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
                                
                                if (count == incount && $scope.isvalid) {
                                    materials.hideSpinner();
                                     $scope.open('lg');
                                   // alert();
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

        $scope.open = function (size) {
            
            var obj = {};
            obj.task = $scope.listtask;
            obj.target = $scope.listalltask;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'taskexcellist.html',
                controller: 'taskexcelCtrl',
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
    }

    function taskexcelCtrl($q,$rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        
        $scope.listtarget = [];
        $scope.listtask = [];
        $scope.listtask = items.task;
        $scope.listtarget = items.target;
        $scope.listbinddata = [];
        $scope.publishdate = new Date();
        
        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.listbinddata = $scope.listtarget;
        };

        $scope.currentPage = 1;
        $scope.numPerPage = 25;
        $scope.select = select;
        $scope.listbinddata = $scope.select($scope.currentPage);

        $scope.cancel = function () {
            materials.hideSpinner();
            $uibModalInstance.dismiss("cancel");
        };
        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }
        var addobj = {
            // "createdby": "createdby",
            //  "clientid": "clientid",
            "flag": "flag",
            "listinputs": [{
                "taskid": "taskid",
                "targetid": "targetid",
                "agencyid": "agencyid",              
                "userid": "userid",              
            }]
        };
        function getdate(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;

            return year + '-' + month + '-' + day;
        }

        $scope.ok = function () {        
            var tempArray = [];
            for (var i = 0; i < $scope.listtarget.length; i++) {
                var inputobj = angular.copy($scope.listtarget[i]);
                var newparam = {};
                newparam.taskid = inputobj.taskid;
                newparam.targetid = inputobj.targetid;
                newparam.agencyid = sessionStorage.userid;
                newparam.userid = inputobj.arid;

                tempArray.push(newparam);
            }

            var obj = {};
            obj.flag = "TASKBUCKET";
            obj.listinputs = tempArray;
            materials.showSpinner();
            var result = service.serverPost(config.urlBulkUpdateTaskbucket, addobj, "", obj)
            result.then(function (resolve) {
                materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
                materials.hideSpinner();
                $rootScope.$emit("loadtaskbucket", null);
                $uibModalInstance.dismiss("cancel");
            }, function (reject) {
                materials.hideSpinner();
                materials.displayToast(appConstants.warningClass, "" + ' ' + appConstants.tryMSG);
            });
        }

        //$scope.ok = function () {
            
        //    //  
        //  //  if ($scope.selecteditem != undefined) {
        //        var obj = {};
        //        //obj.clientid = $scope.selecteditem != undefined ? $scope.selecteditem.id : null;
        //        //  obj.publishdate = getdate(new Date($scope.publishdate));
        //        //   obj.createdby = sessionStorage.userid;
        //        var tempArray = [];
        //        for (var i = 0; i < $scope.listtarget.length; i++) {

        //            var res = angular.copy($scope.listtarget[i]);
        //            //res.taskid = $scope.selecteditem != undefined ? $scope.selecteditem.id : null;
        //            res.createdby = sessionStorage.userid;
        //            res.islocked = 0;

        //            //res.projecttitle = $scope.listalltask[i].projecttitle;
        //            //res.projectdesc = $scope.listalltask[i].projectdesc;
        //            //for (var j = 0; j < $scope.listalltask[i].listtask.length; j++) {
        //            //    $scope.listalltask[i].listtask[j].listtarget = JSON.stringify($scope.listalltask[i].listtask[j].listtarget);
        //            //}
        //            // res.listtask = JSON.stringify($scope.listalltask[i].listtask);
        //            tempArray.push(res);
        //        }
        //        obj.listinputs = tempArray;
        //        materials.showSpinner();
        //        var result = service.serverPost(config.url_bulktarget, addobj, "", obj)
        //        result.then(function (resolve) {
                    
        //            materials.displayToast(appConstants.successClass, appConstants.target + ' ' + appConstants.saveMsg);
        //            materials.hideSpinner();
        //            $rootScope.$emit("loadtarget", null);
        //            $uibModalInstance.dismiss("cancel");
        //        }, function (reject) {

        //        });
        //    //}
        //    //else {
        //    //    alert("Select Task")
        //    //}
        //}


        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        //  $scope.selectedItemChange = selectedItemChange;
        
        function querySearch(query, column) {
            var key = 'list' + column;
            var keyname = column == "task" ? "tasktitle" : column;
            var results = query ? $scope[key].filter(createFilter(query, keyname)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        //function selectedItemChange(item, column) {
        //    selectedId = item.id;
        //    eval('getAll' + column + '(' + item.id + ')');
        //}

        function createFilter(query, name) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

    }
})();


