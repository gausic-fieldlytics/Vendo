

/// 
(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            //routes = [              
            //    'form/elements', 'form/layouts', 'form/validation', 'form/wizard', 'dashboard/dashboard',              
            //    'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup', 'page/mainhome',
            //    'app/calendar', 'form/consumers', 'form/products', 'form/category', 'form/subcategory', 'form/productprice', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more']
            routes = [
                'form/layouts',
                'form/validation',
                'form/wizard',
                'dashboard/dashboard',
                'page/404',
                'page/500',
                'page/blank',
                'page/forgot-password',
                'page/invoice',
                'page/lock-screen',
                'page/profile',
                'page/signin',
                'page/signup',
                'page/mainhome',
                'page/home',
                'app/calendar',

                'page/agencysignup',

                'form/appversion',
                'form/area',
                'form/assignauditor',
                'form/agencyagent',
                'form/appvhistory',
                'form/autoincmaster',
                'form/city',
                'form/country',
                'form/companytype',
                'form/contact',
                'form/contacttype',
                'form/client',
                'form/department',
                'form/emailtemplate',
                'form/gender',
                'form/generalsetting',
                'form/invoice',
                'form/invoicetax',
                'form/location',
                'form/locationtype',
                'form/login',
                'form/payment',
                'form/ppmsuser',
                'form/paymentmode',
                'form/paymentstatus',
                'form/project',
                'form/prooftype',
                'form/register',
                'form/role',
                'form/skill',
                'form/state',
                'form/target',
                'form/targetfiles',
                'form/task',
                'form/progress',
                'form/taskbucket',
                'form/taskdone',
                'form/taskhistory',
                'form/taskpool',
                'form/taskstatus',
                'form/taskstepprogress',
                'form/tasksteps',
                'form/tax',
                'form/user',
                'form/userbankdet',
                'form/usercompany',
                'form/userloc',
                'form/userproof',
                'form/userskill',
                'form/userstatus',
                'form/usertype',
                'form/underdev',
                'form/invoicefrequency',
                'form/agencyinvoice',
                'form/projectstatus',
                'form/invoicerequest',
                'form/taskreport',
                'form/taskprocessreport',
                'form/newtask',
                'form/setting',
                'form/targetmapping',
                'page/tracking',
                'form/subagent',
                'form/taskprogress',
                'form/agencyaudit',
                'form/taskprogressfilter',
                'form/item',
                'form/collecteditemreport',
                'form/reassign',

                'form/projectreport',
                'form/auditreport',
                'form/invoicereport',
                'form/taskcancelreason',
                'form/agencyispreport',
                'form/invoiceotp',
                 'form/agencyterms',
                
            ]

            setRoutes = function (route) {
               
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html'
                };
                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function (route) {
                return setRoutes(route);
            });

            $urlRouterProvider
                .when('/', '/page')
                .otherwise('/page/signin');

        }]
        );

})();
