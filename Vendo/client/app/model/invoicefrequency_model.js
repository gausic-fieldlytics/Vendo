(function () {
    'use strict';
    angular.module('app.table').constant('invoicefrequencyModel', {
        'add': {
           "taskid":"taskid",
"frequency":"frequency",
"userid":"userid",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"frequency":"frequency",
"userid":"userid",
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
            "task":"task",
"user":"user"
        }
    });
})();
