(function () {
    'use strict';
    angular.module('app.table').constant('projectstatusModel', {
        'add': {
            "projectstatusname": "projectstatusname",
            "projectstatuscode": "projectstatuscode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "projectstatusname": "projectstatusname",
            "projectstatuscode": "projectstatuscode",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "projectstatusname": "projectstatusname",
                "projectstatuscode": "projectstatuscode",
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
