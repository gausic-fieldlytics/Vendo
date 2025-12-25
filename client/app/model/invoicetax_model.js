(function () {
    'use strict';
    angular.module('app.table').constant('invoicetaxModel', {
        'add': {
           "invoiceid":"invoiceid",
"taxid":"taxid",
"taxvalue":"taxvalue",
"status":"status"
        },
        'edit': {
            "id": "id",
           "invoiceid":"invoiceid",
"taxid":"taxid",
"taxvalue":"taxvalue",
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
            "invoice":"invoice",
"tax":"tax"
        }
    });
})();
