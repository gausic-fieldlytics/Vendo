(function () {
    'use strict';
    angular.module('app.table').constant('userlocpreferModel', {
        'add': {
           "userid":"userid",
"lat":"lat",
"lng":"lng",
"radius":"radius",
"cityid":"cityid",
"stateid":"stateid",
"area":"area",
"pincode":"pincode",
"status":"status"
        },
        'edit': {
            "id": "id",
           "userid":"userid",
"lat":"lat",
"lng":"lng",
"radius":"radius",
"cityid":"cityid",
"stateid":"stateid",
"area":"area",
"pincode":"pincode",
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
            "user":"user",
"city":"city",
"state":"state"
        }
    });
})();
