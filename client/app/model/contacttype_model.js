(function () {
    'use strict';
    angular.module('app.table').constant('contacttypeModel', {
        'add': {
            "contacttypename": "contacttypename",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "contacttypename": "contacttypename",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "contacttypename": "contacttypename",
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
