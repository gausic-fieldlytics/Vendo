(function () {
    'use strict';
    angular.module('app.table').constant('userlocModel', {
        'add': {
           "userid":"userid",
"lat":"lat",
"lng":"lng",
"taskid":"taskid",
"datetime":"datetime"
        },
        'edit': {
            "id": "id",
           "userid":"userid",
"lat":"lat",
"lng":"lng",
"taskid":"taskid",
"datetime":"datetime"
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
"task":"task"
        }
    });
})();
