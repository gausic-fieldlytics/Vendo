(function () {
    'use strict';
    //consumer
    angular.module('app.table')
        .controller('sidebarCtrl', ['$rootScope', '$scope', '$location', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', '$sessionStorage', sidebarCtrl]);
    function sidebarCtrl($rootScope, $scope, $location, $http, $filter, $mdDialog, config, appConstants, service, materials, $sessionStorage) {

       

        $scope.FirstName = $sessionStorage.get('userfirstname');

        function sidebarMenu(url, Index, menu) {
            service.getMethodClient(url)
               .then(function (result) {
                   debugger;
                   var oResult = result.data;
                   var userpermission = sessionStorage.userpermission;
                   var pages = [];
                   if (sessionStorage.usertypecode == appConstants.CODE_AGENCY) {
                       pages = oResult;
                   }
                   else {
                       if (userpermission != "") {
                           var lstdata = JSON.parse(userpermission);
                           var lstPages = lstdata.listrolepages;
                           for (var i = 0; i < lstPages.length; i++) {
                               for (var j = 0; j < oResult.length; j++) {
                                   if (oResult[j].pageid == lstPages[i].pageid) {
                                       pages.push(oResult[j]);
                                   }
                               }
                           }
                       }
                   }


                   $scope.sidebarmenu = pages;
                  // $scope.sidebarmenu = result.data;
                   if ($scope.sidebarmenu[0].listChilds != undefined) {
                       $scope['isOpen' + 0] = true;
                       $scope['isActive' + 0 + 0] = true;
                   }
                   $rootScope.sideMenuLoaded = true;
                   $scope.activeIndex = Index;
               }).catch(function (err) {
                   console.log(err);
               });
        };


        $scope.changesidebarsubmenu = function (index, pIndex, pmenu) {
            $scope.activeIndex = undefined;
            angular.forEach(pmenu.listChilds, function (obj, l_index) {
                $scope['isActive' + pIndex + l_index] = false;
            });
            $scope['isActive' + pIndex + index] = true;
            $rootScope.isActiveIndex = index;
        }

        $scope.changesidebarmenu = function (index, obj) {

            if (localStorage.getItem('activeIndex') !== undefined && localStorage.getItem('activeIndex') != index) {
                $scope['isOpen' + localStorage.getItem('activeIndex')] = false;
                angular.forEach($scope.sidebarmenu[localStorage.getItem('activeIndex')].listChilds, function (obj, l_index) {
                    $scope['isActive' + localStorage.getItem('activeIndex') + l_index] = false;
                });
            }

            if (!$scope['isOpen' + index] && obj.listChilds !== undefined) {
                $scope['isOpen' + index] = true;
            }
            else {
                $scope['isOpen' + index] = false;
            }

            if (obj.listChilds == undefined) {
                $scope.activeIndex = index;
            }

            localStorage.setItem('activeIndex', index);
            $rootScope.reservedata = null;
        };
        var url;
        //if (localStorage.getItem('MenuUrl') != undefined) {
        //    if (sessionStorage.UserId != null && sessionStorage.UserId != undefined) {
        //        var url = localStorage.getItem('MenuUrl');
        //        var index = localStorage.getItem('activeIndex');
        //        sidebarMenu(url, index);
        //    }
        //    else {
        //        $location.url('/page/signin');
        //    }

        //}
        $scope.states = {};
        $scope.states.activeItem = '1';

        $rootScope.$on('reloadSidebar', function (event, args) {
            debugger;
            var sidebarmenuType = args.id;
            var Index = sessionStorage.activeHeader;
            $scope.sidebarmenu = [];

            //if (localStorage.getItem('activeIndex') !== undefined) {
            //    delete $scope['isOpen' + localStorage.getItem('activeIndex')];
            //    if ($rootScope.isActiveIndex)
            //        delete $scope['isActive' + localStorage.getItem('activeIndex') + $rootScope.isActiveIndex];
            //}
            switch (sidebarmenuType) {
                case 'LUMaster':
                    url = config.urlGetLUMasterJson;
                    localStorage.setItem('MenuUrl', url);
                    sidebarMenu(url, Index, 'LUMaster');
                    break;
                case 'Master':
                    url = config.urlGetMasterJson;
                    localStorage.setItem('MasterUrl', url);
                    sidebarMenu(url, Index, 'Master');
                    break;
                case 'Task':
                    url = config.urlGetTaskJson;
                    localStorage.setItem('TaskUrl', url);
                    sidebarMenu(url, Index, 'Task');
                    break;
                case 'Reports':
                    url = config.urlGetReportsJson;
                    localStorage.setItem('ReportsUrl', url);
                    sidebarMenu(url, Index, 'Reports');
                    break;
                case "NewTask":
                    url = config.urlGetAgtJson;
                    localStorage.setItem('NewTaskUrl', url);
                    sidebarMenu(url, Index, 'NewTask');
                    break;
                case "AgentMaster":
                    url = config.urlGetAgMsttJson;
                    localStorage.setItem('NewTaskUrl', url);
                    sidebarMenu(url, Index, 'NewTask');
                    break;
                case "Audit":
                    url = config.urlGetAudittJson;
                    localStorage.setItem('AuditUrl', url);
                    sidebarMenu(url, Index, 'Audit');
                    break;
                case "Settings":
                    url = config.urlSettingsJson;
                    localStorage.setItem('SettingsUrl', url);
                    sidebarMenu(url, Index, 'Settings');
                    break;
            };
        });

        $scope.nevigate = function (_page) {
            debugger;
            //   _page
            window.location = _page.anchorlinks;
        }

    }
})
    ();