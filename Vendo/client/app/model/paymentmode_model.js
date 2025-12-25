(function () {
    'use strict';
    angular.module('app.table').constant('paymentmodeModel', {
        'add': {
            "paymentmodename": "paymentmodename",
            "paymentmodecode": "paymentmodecode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "paymentmodename": "paymentmodename",
            "paymentmodecode": "paymentmodecode",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "paymentmodename": "paymentmodename",
                "paymentmodecode": "paymentmodecode",
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
