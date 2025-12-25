(function () {
    'use strict';
    angular.module('app.table').constant('paymentstatusModel', {
        'add': {
            "paymentstatusname": "paymentstatusname",
            "paymentstatuscode": "paymentstatuscode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "paymentstatusname": "paymentstatusname",
            "paymentstatuscode": "paymentstatuscode",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "paymentstatusname": "paymentstatusname",
                "paymentstatuscode": "paymentstatuscode",
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
