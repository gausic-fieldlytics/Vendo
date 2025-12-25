(function () {
    'use strict';
    angular.module('app.table').constant('taskstatusModel', {
        'add': {
            "taskstatusname": "taskstatusname",
            "taskstatuscode": "taskstatuscode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "taskstatusname": "taskstatusname",
            "taskstatuscode": "taskstatuscode",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "taskstatusname": "taskstatusname",
                "taskstatuscode": "taskstatuscode",
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
