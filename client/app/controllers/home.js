(function () {
    'use strict';

    angular.module('app.table').controller('homeDashCtrl', ['$q', '$rootScope', '$scope', '$http', '$location', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'commonModel', homeDashCtrl]);

    function homeDashCtrl($q,$rootScope, $scope, $http,$location, $filter, $mdDialog, config, appConstants, service, materials,  commonModel) {

        $scope.booking = {};
        $scope.isSuperAdmin = sessionStorage.usertypecode == appConstants.CODE_USER ? true : false;

        debugger;
        var addobj = {
            "userid":"userid",
            "clientid":"clientid"
        };



        function loaddashboard() {
            debugger;
            var obj = {};
            obj.userid = sessionStorage.usertypecode == appConstants.CODE_USER ? 0 : sessionStorage.userid;
            obj.clientid = sessionStorage.clientid != '' ? sessionStorage.clientid : 0;
            var result = service.serverPost(config.urlgetadmindashboard, addobj, "", obj)
            result.then(function (resolve) {
                debugger
               $scope.booking = resolve.ResponseData;
               loadchart($scope.booking.listbookingcount, $scope.booking.listbookingstatus);
               loadbarchart($scope.booking.listtaskprocess)
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loaddashboard()


        $scope.redirectpage = function (_headindex) {
            //   $location.url(_page);
            var page = '#/form/user';
            if (_headindex == 2) {
                sessionStorage.activeHeader = _headindex;
                sessionStorage.activeHeadername = "Master";
                $rootScope.$emit('reloadSidebar', { id: "Master", index: _headindex });
                $rootScope.$emit('changeactive_header', {  index: _headindex });
            }
            else {
                page = '#/form/task'
                sessionStorage.activeHeader = _headindex;
                sessionStorage.activeHeadername = "Task";
                $rootScope.$emit('reloadSidebar', { id: "Task", index: _headindex });
                $rootScope.$emit('changeactive_header', {  index: _headindex });
            }
            
            window.location = page;
        }

        function loadchart(listbookingcount,listbookingstatus) {
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Task Status'
                },
                xAxis: {
                    categories: listbookingstatus,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Status count'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Task',
                    data: listbookingcount

                }]
            });
        }
        


        function loadbarchart(listtaskprocess) {

            // Create the chart
            Highcharts.chart('barcontainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Task Inprocess'
                },
                
                accessibility: {
                    announceNewData: {
                        enabled: true
                    }
                },
                xAxis: {
                    type: 'Task'
                },
                yAxis: {
                    title: {
                        text: 'Task working inprocess'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
                },

                series: [
                    {
                        name: "Task Process",
                        colorByPoint: true,
                        data: listtaskprocess
                    }
                ]
            });
        }
        
    }
})();


