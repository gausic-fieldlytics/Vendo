(function () {
    'use strict';

    angular.module('app.table').controller('TargetfilesCtrl', ['$q', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'targetfilesModel', 'commonModel', TargetfilesCtrl]);

    function TargetfilesCtrl($q, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, targetfilesModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        this.targetfiles = targetfilesModel.add;

        $scope.deleteTargetfiles = function (obj) {

            var confirm = materials.deleteConfirm(appConstants.targetfiles);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: obj.id
                };
                var result = service.serverDelete(config.urlDeleteTargetfiles, targetfilesModel.delete, commonModel.trans, delObj);
                result.then(function (resolve) {
                    
                    if (resolve.ResponseStatus == "OK") {
                        materials.displayToast(appConstants.successClass, appConstants.targetfiles + ' ' + appConstants.deleteMsg);
                        getAllTargetfiles(selectedId);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    }
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.editTargetfiles = function (rowData) {

            $scope.show = 2;
            $scope.targetfiles = angular.copy(rowData);
            original = angular.copy($scope.targetfiles);

        }

        $scope.revert = function () {
            $scope.targetfiles = angular.copy(original);
            $scope.targetfiles = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.targetfiles, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function () {
            return $scope.material_login_form.$valid && !angular.equals($scope.targetfiles, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewTargetfiles = function (rowData) {
            $scope.show = 2;
            $scope.targetfiles = angular.copy(rowData);
            original = angular.copy($scope.targetfiles);
        }

        $scope.addTargetfiles = function () {
            this.targetfiles = "";
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

     //   $scope.GetEvntDD = function () {
     //       
     //       $scope.allgroups = false;
     //       var evnobj = {
     //           params: {
     //               ChapterId: 250
     //           }
     //       };

     //       $http.get("http://pbsj.qwicksoft.com/Bookingservice.svc" + "/GetEventDD ", evnobj)
     //.then(function (response) {
     //    
     //    $scope.resultDataPBSJ = JSON.parse( resolve.Data);
     //});
     //   }

        function getAllTargetfiles(selectedId) {
            
            var obj = {};
            obj.taskid = selectedId;
           
            var result = service.serverPost(config.urlGetTargetfiles, targetfilesModel.searchall, "", obj)
            
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                //$scope.GetEvntDD();
                init();
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveTargetfiles = function (p_obj) {
            var obj = p_obj;
            obj.executiondate = new Date(obj.executiondate);
            obj.status = 1;
            if (obj.id == null) {
                var result = service.serverPost(config.urlSaveTargetfiles, targetfilesModel.add, commonModel.trans, obj)
                result.then(function (resolve) {
                    
                    materials.displayToast(appConstants.successClass, appConstants.targetfiles + ' ' + appConstants.saveMsg);
                    $scope.targetfiles = {};
                    getAllTargetfiles(selectedId);

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                
                var result = service.serverPost(config.urlUpdateTargetfiles, targetfilesModel.edit, commonModel.trans, obj)
                result.then(function (resolve) {
                    getAllTargetfiles(selectedId);
                    $scope.show = 1;

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
        }


        $scope.Uploadfile = function (fileObj) {
            
            var objfile = fileObj;
            if (objfile.filepath != null) {

                $scope.uploadDocFilename = "";
                $scope.uploadDocExtension = "";
                $scope.uploadDocDisplayfilename = "";

                var file = objfile.filepath;
                var code = "EMPDOC";

                if (file.size != undefined) {

                    var result = service.filePost(config.urlSaveFile, file, code);
                    result.then(function (resolve) {

                        if (resolve.ResponseData != null) {
                            $scope.taskData = resolve.ResponseData;
                            objfile.filepath = $scope.uploadDocFilename.concat($scope.taskData[0].filename);
                        }
                        $scope.uploadDocFilename = $scope.uploadDocFilename.concat($scope.taskData[0].filename);
                        $scope.saveTargetfiles(objfile);

                    }, function (reject) {
                        console.log(reject.ResponseMessage);
                    });

                }
                else {
                    $scope.uploadexpFilename = "";
                    $scope.saveTargetfiles(objfile);

                }
                return true;
            }
            else {
                $scope.uploadexpFilename = "";
                $scope.saveTargetfiles(objfile);
            }
        };


        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = targetfilesModel.ddlist;

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

        $scope.removeUserpic = function () {
            $scope.editUserPic = undefined;
            $scope.targetfiles.filepath = undefined;
        }

        getAllTargetfiles(0);

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
        $scope.filepaths = config.filepath;
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

    }
})();


