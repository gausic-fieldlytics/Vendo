(function () {
    'use strict';
    angular.module('app.table').constant('genderModel', {
        'add': {
            "gendername": "gendername",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "gendername": "gendername",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "gendername": "gendername",
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
