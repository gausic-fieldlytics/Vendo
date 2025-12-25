(function () {
    'use strict';
    angular.module('app.table').constant('itemModel', {
        'add': {
            "itemname": "itemname",
            "itemcode": "itemcode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "itemname": "itemname",
            "itemcode": "itemcode",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "itemname": "itemname",
                "itemcode": "itemcode",
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
