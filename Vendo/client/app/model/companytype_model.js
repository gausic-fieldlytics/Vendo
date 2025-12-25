(function () {
    'use strict';
    angular.module('app.table').constant('companytypeModel', {
        'add': {
           "companytypename":"companytypename",
"companytypecode":"companytypecode",
"status":"status"
        },
        'edit': {
            "id": "id",
           "companytypename":"companytypename",
"companytypecode":"companytypecode",
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
            
        }
    });
})();
