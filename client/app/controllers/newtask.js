(function () {
    'use strict';

    angular.module('app.table')
        .controller('NewTaskCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'newtaskModel', 'commonModel', NewTaskCtrl])
         .controller('TaskinfoCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', TaskinfoCtrl])
        .directive('treeView',["$compile", function ($compile) {
        return {
            restrict: 'E',
            scope: {
                localNodes: '=model',
                localClick: '&click'
            },
            link: function (scope, tElement, tAttrs, transclude) {
               
                var maxLevels = (angular.isUndefined(tAttrs.maxlevels)) ? 10 : tAttrs.maxlevels;
                var hasCheckBox = (angular.isUndefined(tAttrs.checkbox)) ? false : true;
                scope.showItems = [];
                scope.showHide = function (ulId) {
                    var hideThis3 = document.getElementsByClassName(ulId);
                    if(angular.element(hideThis3).hasClass('plus')){
                        angular.element(hideThis3).addClass("minus");
                        angular.element(hideThis3).removeClass("plus");
                    }else{
                        angular.element(hideThis3).addClass("plus");
                        angular.element(hideThis3).removeClass("minus");
                    }
                    var hideThis = document.getElementById(ulId);
                    var showHide = angular.element(hideThis).attr('class');
                    angular.element(hideThis).attr('class', (showHide === 'show' ? 'hide' : 'show'));
                }
                scope.showIcon = function (node) {
                    if (!angular.isUndefined(node.children)) return true;
                }
                scope.checkIfChildren = function (node) {
                    if (!angular.isUndefined(node.children)) return true;
                }

                scope.istask = function (node) {
                    return node.flag == "T" || node.flag == "S" ? false : true;
                }

                /////////////////////////////////////////////////
                /// SELECT ALL CHILDRENS
                // as seen at: http://jsfiddle.net/incutonez/D8vhb/5/

                function checkparentnode(node) {

                    for (var i in item.children) {
                        if (item.children[i].children) {
                            parentCheckChange(item.children[i]);
                        }
                    }
                }


                function parentCheckChange(item) {
                    
                    for (var i in item.children) {
                        item.children[i].checked = item.checked;
                        if (item.children[i].children) {
                            parentCheckChange(item.children[i]);
                        }
                    }
                }

                scope.checkChange = function (node, event) {
                    var targetnodes = scope.$parent.targetnodes;
                    if (node.children) {
                        parentCheckChange(node);
                    }

                    //if (node.checked) {
                    //    getcurrentparent(node, targetnodes);
                    //}
                    

                }

                function getparent(item,pid) {
                    var parent = null;
                    for (var i in item.children) {
                        if (pid == item.children[i].code) {
                            parent = item.children[i];
                            break;
                        }
                        else {
                            if (item.children[i].children) {
                                getparent(item.children[i], pid);
                            }
                        }
                    }
                    return parent;
                }

                function getcurrentparent(node, targetnodes) {
                    var parentnode =null; 
                    for (var a = 0; a < targetnodes.length; a++) {
                         parentnode = getparent(targetnodes[a], node.pid);
                        if (parentnode != null) {
                            break;
                        }
                    }
                    if (parentnode != null) {
                        debugger;
                    }
                }


                function findparentcheck(item) {

                    for (var i in item.children) {
                        item.children[i].checked = item.checked;
                        if (item.children[i].children) {
                            parentCheckChange(item.children[i]);
                        }
                    }
                }

                /////////////////////////////////////////////////

                function renderTreeView(collection, level, max) {
                    
                    var text = '';
                    text += '<li class="titler{{ n.children.length }}"   ng-repeat="n in ' + collection + '" >';
                    text += '<span ng-show=showIcon(n) class="show-hide plus" ng-class="n.id" ng-click=showHide(n.id);localClick({node:n});$event.stopPropagation();><i class="fa fa-plus-square"></i><i class="fa fa-minus-square"></i></span>';
                    text += '<span ng-show=!showIcon(n) style="padding-right: 13px"></span>';

                    if (hasCheckBox) {
                        text += '<input ng-if=istask(n) class="tree-checkbox" type=checkbox ng-model=n.checked ng-change=checkChange(n,$event)>';
                    }

                    text += '<span  class="edit" ng-click=localClick({node:n})> '


                    text += '<label class="target_{{n.iscancel}}" >{{n.name}}</label>';

                    if (level < max) {
                        
                        text += '<ul id="{{n.id}}"  class="hide" ng-if=checkIfChildren(n)>' + renderTreeView('n.children', level + 1, max) + '</ul> </li>';
                    } else {
                        text += '</li>';
                    }
                  
                   
                    return text;
                }// end renderTreeView();

                try {
                    var text = '<ul class="tree-view-wrapper">';
                    text += renderTreeView('localNodes', 1, maxLevels);
                    text += '</ul>';
                    tElement.html(text);
                    $compile(tElement.contents())(scope);
                }
                catch (err) {
                    tElement.html('<b>ERROR!!!</b> - ' + err);
                    $compile(tElement.contents())(scope);
                }
            }
        };
    }]);

    function NewTaskCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, newtaskModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.task = newtaskModel.add;
        $scope.liststeps = [];
        $scope.listtarget = [];
        $scope.listtargetselection= [];
        $scope.ddltask = {};
        $scope.FilePath = config.filPath;
        $scope.nodes = [];
        $scope.targetnodes = [];
        $scope.listtaskpreview = [];
        $scope.listprojecttask = [];
        $scope.editTask = function (rowData) {
            $scope.showtaskdetail = true;
            $scope.showtaskstepsdetail = false;
            $scope.show = 2;
            $scope.taskid = rowData.id;
            getAllTasksteps($scope.taskid);
            $scope.task = angular.copy(rowData);
            $scope.task.startdate = new Date($scope.task.startdate);
            $scope.task.enddate = new Date($scope.task.enddate);
            $scope.invoicefreq = $scope.task.frequency;
            if ($scope.task.refimage != null)
                $scope.task.refimage = config.filepath + $scope.task.refimage;
            original = angular.copy($scope.task);

        }

       
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


        $scope.options = {
            collapsible: false,
            onNodeSelect: function (node, breadcrums) {
                
                if (node.flag == "T") {
                    node.folders = [];
                    getAllTasksteps(node, node.Id,true);
                }
            }
        };
        

        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        function loadtreeview(oProjectlist) {
            
            var listproject = materials.groupBy(oProjectlist, "projectid")
            $scope.directory = {};
            $scope.directory.folders = [];
            
            for (var i = 0; i < listproject.length; i++) {
                var tasklist = listproject[i];
                var rootDir = { };
                rootDir.folders = [];
                var totalamount = 0;
                for (var j = 0; j < tasklist.length; j++) {
                    var name = tasklist[j].tasktitle + " " + "(" + tasklist[j].taskstepcount + ")" + " " + tasklist[j].amount;
                    var taskDir = { name: name, flag: "T", Id: tasklist[j].taskid };
                    taskDir.folders = [];
                    rootDir.folders.push(taskDir);
                    totalamount = totalamount + parseFloat(tasklist[j].amount);
                }
                var name = listproject[i][0].projecttitle + " " + "(" + tasklist.length + ")" + " " + totalamount;
                rootDir.name= name;
                rootDir.flag = "P";
                rootDir.Id= listproject[i][0].projectid
                $scope.directory.folders.push(rootDir);
            }
        }
       
        function loadtargetreeview(oProjectlist) {
            try {
                var listproject = oProjectlist;
                $scope.targetnodes = [];
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
                    $scope.targetnodes.push(rootDir);
                }
                materials.hideSpinner();
            }
            catch (exception) {
                materials.hideSpinner();
            }
            
        }

        $scope.loadtaskstep = function (node) {
            
            if (node.flag == "T") {
                getAllTasksteps(node, node.id.replace(node.flag, ""));
            }
           
        }

        $scope.checkparent = function (node) {
            debugger;
            var nod = $scope.targetnodes;
        }

        $scope.loadtask = function (node) {
            
            var d = $scope.targetnodes;
            
            if (node.flag == "T") {
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

        function getAllTasksteps(tasklist, taskid, isview) {
            
            if (isview) {
                tasklist.folders = [];
            }
            else {
                tasklist.children = [];
            }
            
            var obj = {};
            obj.id = taskid;
            var result = service.serverPost(config.urlGetTasksteps, newtaskModel.steps, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                if (isview) {
                    tasklist.folders = [];
                }
                else {
                    tasklist.children = [];
                }

                var oResult = resolve.ResponseData;
                for (var i = 0; i < oResult.length; i++) {
                    if (isview) {
                        var taskDir = { name: oResult[i].step, flag: "S", id: oResult[i].id };
                        tasklist.folders.push(taskDir);
                    }
                    else {
                        var taskDir = { name: oResult[i].step, flag: "S", id: oResult[i].id, checkbox: false };
                        tasklist.children.push(taskDir);
                    }
                }

                //   init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function generateUniqueString() {
            var length = 5;
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result+ "_";
           
        }

        function getAllTaskbytarget(targetlist, targetid, projectid) {
            
            targetlist.children = [];
            var obj = {};
            obj.targetid = targetid;
            obj.projectid = projectid;
            obj.flag = "N";
            var result = service.serverPost(config.urlGetTaskbytarget, newtaskModel.bytarget, "", obj)
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

        $scope.expandSelected_tr = function (row, expendstatus) {
            
            $scope.listprojecttask = [];
            if (!expendstatus) {
                $scope.listtaskpreview.forEach(function (val) {
                    val.expanded = false;
                })
                row.expanded = true;
                $scope.listprojecttask = row.listtask;
               // $scope.liststocktransaction = row.stocktransaction;
               // $scope.GetStockAudit(row.id, true);
            }
            else {
                row.expanded = false;
            }
        }

        function loadtaskpreview() {
            var obj = {};
            obj.userid = sessionStorage.userid;
            obj.count = 0;
            obj.limit = 10;
            var result = service.serverPost(config.urlgettaskpreview, newtaskModel.taskpreview, "", obj)
            result.then(function (resolve) {
                
                var oProjectlist = resolve.ResponseData;
                var groupdata = materials.groupBy(oProjectlist, "projectid");
                $scope.listtaskpreview = [];
                for (var i = 0; i < groupdata.length; i++) {
                    var _obj = {};
                    _obj.projecttitle = groupdata[i][0].projecttitle;
                    _obj.projectid = groupdata[i][0].projectid;
                    _obj.listtask = groupdata[i];
                    $scope.listtaskpreview.push(_obj);
                }
                
            //    loadtreeview($scope.resultData);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadtaskpreview();

       
        function loadtargetselection() {
            var obj = {};
            obj.userid = sessionStorage.userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlgettaskselection, newtaskModel.targetselection, "", obj)
            result.then(function (resolve) {
                
                var oResult = resolve.ResponseData;
                $scope.listtargetselection = oResult;
                loadtargetreeview(oResult);
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadtargetselection();

        $scope.loadtasksteps=function(task) {
            
            var obj = {};
            obj.id = task.taskid;
            var result = service.serverPost(config.urlGetTasksteps, newtaskModel.steps, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                var oResult = resolve.ResponseData;
                $scope.open("lg", task, oResult);
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }


        $scope.open = function (size, task,listtasksteps) {
            
            var obj = {};
            obj.taskinfo = task;
            obj.tasksteps = listtasksteps;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'Taskinfo.html',
                controller: 'TaskinfoCtrl',
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
      
        

        $scope.savetaskbucket = function () {
            
            var data = $scope.targetnodes;
            var obj = {};
            var lstinput = [];
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

                                    var newparam = {};
                                    newparam.taskid = lsttask[m].id.replace(lsttask[m].code, "");
                                    newparam.targetid = lsttarget[l].id.replace(lsttarget[l].code, "");
                                    newparam.userid = sessionStorage.userid;
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
                var result = service.serverPost(config.urlSaveTaskbucket, newtaskModel.taskbucket_add, "", obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.taskpicked + ' ' + appConstants.saveMsg);
                    loadtargetselection();
                    loadtaskpreview();
                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                materials.displayToast(appConstants.successClass, "Select atlest one target." + ' ' + "");
            }
           

        }

       

        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = newtaskModel.ddlist;

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

    function TaskinfoCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        
        $scope.filepaths = config.filPath;
        $scope.task = items.taskinfo;
        $scope.listtasksteps = items.tasksteps
        $scope.listimg = [];
        if (items.taskinfo.refimage != null) {
            $scope.listimg = items.taskinfo.refimage.split(",");
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }

})();


