(function () {
    'use strict';
    angular.module('app.table').constant('skillModel', {
        'add': {
            "skillname": "skillname",
            "skillcode": "skillcode",
            "description": "description",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "skillname": "skillname",
            "skillcode": "skillcode",
            "description": "description",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "skillname": "skillname",
                "skillcode": "skillcode",
            }]
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
