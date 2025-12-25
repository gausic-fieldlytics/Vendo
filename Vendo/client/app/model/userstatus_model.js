(function () {
    'use strict';
    angular.module('app.table').constant('userstatusModel', {
        'add': {
            "userstatusname": "userstatusname",
            "userstatuscode": "userstatuscode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "userstatusname": "userstatusname",
            "userstatuscode": "userstatuscode",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "userstatusname": "userstatusname",
                "userstatuscode": "userstatuscode",
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
