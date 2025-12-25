(function () {
    'use strict';
    angular.module('app.table').constant('locationtypeModel', {
        'add': {
           "locationtypename":"locationtypename",
"locationtypecode":"locationtypecode",
"status":"status"
        },
        'edit': {
            "id": "id",
           "locationtypename":"locationtypename",
"locationtypecode":"locationtypecode",
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
