(function () {
    'use strict';
    angular.module('app.table').constant('appvhistoryModel', {
        'add': {
           "userid":"userid",
"datetime":"datetime",
"userstatusid":"userstatusid",
"remarks":"remarks"
        },
        'edit': {
            "id": "id",
           "userid":"userid",
"datetime":"datetime",
"userstatusid":"userstatusid",
"remarks":"remarks"
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id"
        },
        'searchall': {           
        },
        'ddlist': {
            "user":"user",
"userstatus":"userstatus"
        }
    });
})();
