(function () {
    'use strict';
    //consumer
    angular.module('app.table').controller('headerCtrl', ['$rootScope', '$scope', '$http', '$filter', '$mdDialog', '$window', 'config', 'appConstants', 'service', 'materials', '$location', '$sessionStorage', headerCtrl]);
    function headerCtrl($rootScope, $scope, $http, $filter, $mdDialog, $window, config, appConstants, service, materials, $location, $sessionStorage) {

        $scope.UserName = sessionStorage.UserName;
        $scope.isagency = sessionStorage.usertypecode == appConstants.CODE_USER ? false : true;
       
        function headerMenu(url) {
            debugger;
            $scope.selectedy = sessionStorage.activeHeader;
            
            $scope.headermenu = $sessionStorage.get('HeaderMenus');
            setTimeout(function () {
                $rootScope.$emit('reloadSidebar', { id: sessionStorage.activeHeadername, index: sessionStorage.activeHeader });
            }, 500);
        };
        headerMenu(config.urlGetHeaderMenu);



        $rootScope.$on('HeaderMenus', function (event, args) {
            $scope.headermenu = args.Menus;
        });

        $rootScope.$on('empty_header', function (event, args) {
            debugger;
           
            $scope.headermenu = [];
        });
      
        $rootScope.$on('show_profile', function (event, args) {
            debugger;
            $scope.isagency = sessionStorage.usertypecode == appConstants.CODE_USER ? false : true;
        });

        $rootScope.$on('changeactive_header', function (event, args) {
            debugger;
            $scope.selectedy = args.index;
        });

        $rootScope.$on('dashboradmenu', function (event, args) {
            $scope.redirect(args.Menus.Id, args.Menus.url, "", args.Menus.index)
        });

        $scope.selectd = function (index) {
            $scope.selectedy = index;
            sessionStorage.activeHeader = index;
        };

        $scope.redirect = function (id, url, event, index) {
           
            sessionStorage.activeHeader = index;
            sessionStorage.activeHeadername = id;
            $scope.selectedd = sessionStorage.activeHeader;
            $('.selectedm').removeClass('selectedm');
            $(this).addClass("selectedm");
            $scope.activeIndex = index;
            $rootScope.reservedata = null;
            $rootScope.sideMenuLoaded = false;
            $rootScope.sidebarmenuId = id;
            $rootScope.$emit('reloadSidebar', { id: id, index: index });
            localStorage.setItem('activeIndex', index);
            window.location = url;
        }
        //On Click Menu Click

        $rootScope.$on('HeaderDetails', function (event, args) {
            $scope.UserName = args.Name;
            $scope.headermenu = args.Menus;
            $scope.redirect("Dashboard", "#/page/home", "", 0);
        });



        $rootScope.$on('logout', function (event, args) {
            $scope.logout();
        });

        $scope.logout = function () {
            debugger;
            for (var prop in $rootScope) {
                if (typeof $rootScope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {
                    delete $rootScope[prop];
                }
            }
            delete sessionStorage.userid;
            delete sessionStorage.loginid;
            delete sessionStorage.UserName;
            delete sessionStorage.usertypeid;
            delete sessionStorage.userstatusid;
            delete sessionStorage.HeaderMenus;
            delete sessionStorage.activeIndex;
            delete sessionStorage._HeaderMenus;
            localStorage.clear();
            sessionStorage.clear();

            $sessionStorage.empty();
            $location.url('/page/signin');
        };

        function connectSignalr(userid) {
          
            $.connection.hub.url = config.signalr;
            if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
                //if (userid != 0) {
              
                    initalizeSignalR(userid);
                //}
            }
            else {
                console.log("SignalR Connection Exist");
            }
            var tryingToReconnect = false;

            //$.connection.hub.reconnecting(function () {
            //    console.log("SignalR Reconnecting");
            //    tryingToReconnect = true;
            //});

            //$.connection.hub.reconnected(function () {
            //    console.log("SignalR Reconnected");
            //    tryingToReconnect = false;
            //});

            //$.connection.hub.disconnected(function () {
            //    console.log("SignalR Disconnected");
            //    if ($.connection.hub.lastError) {
            //        console.log($.connection.hub.lastError.message);
            //    }

            //    if (tryingToReconnect) {
            //        setTimeout(function () {
            //            console.log("SignalR Re-initalize");
            //            //   initalizeSignalR();
            //        }, 5000); // Restart connection after 5 seconds.
            //    }

            //});
            //$.connection.hub.connectionSlow(function () {
            //    console.log("SignalR Connection Slow");
            //});
        }
        connectSignalr()
        function initalizeSignalR(userid) {
          
            var notificationHub = $.connection.notificationHub;

            notificationHub.client.sendNotification = function (msg) {
              
                $rootScope.$emit('tracking_signalR', { data: msg });
            //    $rootScope.$emit('tracking_signalR', msg);
            };
            $.connection.hub.logging = true;
            $.connection.hub.start().done(function (obj) {
                console.log("SignalR Succeed : ");
                console.log("SignalR Connection Id : " + obj.id);



            
            }).fail(function () {
                console.log('Could not Connect!');
            });
        }

    }
})
();