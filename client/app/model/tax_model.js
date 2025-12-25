(function () {
    'use strict';
    angular.module('app.table').constant('taxModel', {
        'add': {
            "taxname": "taxname",
            "taxcode": "taxcode",
            "taxpercent": "taxpercent",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "taxname": "taxname",
            "taxcode": "taxcode",
            "taxpercent": "taxpercent",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "taxname": "taxname",
                "taxcode": "taxcode",
                "taxpercent": "taxpercent",
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
