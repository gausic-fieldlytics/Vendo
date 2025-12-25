(function () {
    'use strict';

    angular.module('app.page')
     .controller('homeCtrl', ['$rootScope', '$http', '$scope', '$window', '$location', 'service', 'config', '$q', 'appConstants', 'materials', '$sessionStorage', homeCtrl]);
    function homeCtrl($rootScope, $http, $scope, $window, $location, service, config, $q,appConstants, materials, $sessionStorage) {

       
        var url = sessionStorage.usertypecode == appConstants.CODE_USER ? config.urlGetHeaderMenu : config.urlGetAGTHeaderMenu;
        
        $scope.getFirstName = function () {
            
            $scope.FirstName = sessionStorage.logincustomername;
        }
        $rootScope.$on('empty_header', function (event, args) {
            debugger;
            $scope.headermenu = [];
        });
       
        $scope.homemenu = [];
        function homeMenu(url) {
            sessionStorage.activeHeader = 0;
            service.getMethodClient(url)
               .then(function (result) {
                   debugger;
                   if (result.data.length > 0) {
                       $scope.homemenu = [];
                       if (sessionStorage.usertypecode == appConstants.CODE_AGENCY) {
                           $scope.homemenu = result.data;
                       }
                       else {
                           if (sessionStorage.userpermission != "") {


                               var userpermission = JSON.parse(sessionStorage.userpermission);
                               var lstPages = userpermission.listrolepages;
                               var grop_data = materials.groupBy(lstPages, "headerid");

                               var headerdata = result.data;
                               var tempArray = [];

                               for (var j = 0; j < headerdata.length; j++) {
                                   switch (headerdata[j].id) {
                                       case 'Home':
                                           if (userpermission.homeshow) {
                                               tempArray.push(headerdata[j]);
                                           }
                                           break;
                                       case 'LUMaster':
                                           if (userpermission.lookupshow) {
                                               var _page = getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                               
                                           }
                                           break;
                                       case 'Master':
                                           if (userpermission.mastershow) {
                                               var _page = getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                           }
                                           break;
                                       case "Task":
                                           if (userpermission.projectshow) {
                                               var _page = getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                           }
                                           break;
                                       //case "NewTask":
                                       //    if (userpermission.agencyshow) {
                                       //        var _page =getfirstpage(grop_data, headerdata[j]);
                                       //        if (_page != null) {
                                       //            tempArray.push(_page);
                                       //        }
                                       //    }
                                           break;
                                       case "Audit":
                                           if (userpermission.auditshow) {
                                               var _page =getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                           }
                                           break;
                                       case "Settings":
                                           if (userpermission.settingshow) {
                                               var _page =getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                           }
                                           break;
                                       case "Reports":
                                           if (userpermission.reportshow) {
                                               var _page =getfirstpage(grop_data, headerdata[j]);
                                               if (_page != null) {
                                                   tempArray.push(_page);
                                               }
                                           }
                                           break;
                                   }
                               }

                               $scope.homemenu = tempArray;
                               $sessionStorage.put('HeaderMenus', $scope.homemenu);
                           }
                       }
                       //$rootScope.$emit('HeaderDetails', { Name: sessionStorage.UserName, Menus: $scope.homemenu });
                   }
               }).catch(function (err) {
                   console.log(err);
               });
        };
        homeMenu(url);

        function sidebarMenu(data) {
            $scope.homemenu = [];
            $scope.homemenu = data;      
        }

        function getfirstpage(grop_data,_header) {
            debugger;
            var newobj = null;
            for (var i = 0; i < grop_data.length; i++) {
                if (grop_data[i][0].headerid == _header.headerid) {
                    for (var j = 0; j < grop_data[i].length; j++) {
                        if (grop_data[i][j].pageid == _header.pageid) {
                            newobj = _header;
                            break;
                        }
                    }
                    if (newobj == null) {
                        newobj = _header;
                        newobj.anchorlinks = grop_data[i][0].pageurl;
                        break;
                    }
                }
            }
            
            return newobj;
        }


        $scope.redirect = function (id, url, index) {
            debugger;
            $('.headeractive').removeClass('headeractive');
            $(event.target).addClass('headeractive');
            $rootScope.$emit('show_profile', {});
            $scope.activeIndex = 0;
            sessionStorage.activeHeader = index;
            sessionStorage.activeHeadername = id;
            $rootScope.reservedata = null;
            $rootScope.sideMenuLoaded = false;
            $rootScope.sidebarmenuId = id;
            $sessionStorage.put('HeaderMenus', $scope.homemenu);
            $rootScope.$emit('HeaderMenus', { Menus: $scope.homemenu });
            $rootScope.$emit('reloadSidebar', { id: id, index: index });

           localStorage.setItem('activeIndex', $scope.activeIndex);
           localStorage.setItem('MenuUrl', url);
           window.location = url;
        }
    }




})();



