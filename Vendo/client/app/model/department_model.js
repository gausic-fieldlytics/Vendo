(function () {
    'use strict';
    angular.module('app.table').constant('departmentModel', {
        'add': {
           "departmentname":"departmentname",
           "departmentcode": "departmentcode",
           "createdat": "createdat",
           "createdby": "createdby",
           "status": "status"
        },
        'edit': {
            "id": "id",
           "departmentname":"departmentname",
"departmentcode":"departmentcode",
"modifiedat": "modifiedat",
"modifiedby": "modifiedby",
"status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "departmentname": "departmentname",
                "departmentcode": "departmentcode",
            }]
        },
        'delete': {
            "id": "id",
            "modifiedby": "modifiedby",
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
