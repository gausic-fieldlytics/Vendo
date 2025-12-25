(function () {
    'use strict';
    angular.module('app.table').constant('userskillModel', {
        'add': {
           "skillid":"skillid",
"userid":"userid",
"experience":"experience",
"remarks":"remarks",
"status":"status"
        },
        'edit': {
            "id": "id",
           "skillid":"skillid",
"userid":"userid",
"experience":"experience",
"remarks":"remarks",
"status":"status"
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
            "skill":"skill",
"user":"user"
        }
    });
})();
