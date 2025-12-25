(function () {
    'use strict';
    angular.module('app.table').constant('commonModel', {
        'trans': {
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'master': {
            "createdat": "createdat",
            "createdby": "createdby",
            "status": "status"
        },
        'mobmaster': {
            "createdat": "createdat",
            "status": "status"
        },
        'statusmaster': {
            "status": "status"
        }
    });
})();