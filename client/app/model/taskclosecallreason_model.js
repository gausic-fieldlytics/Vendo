(function () {
    'use strict';
    angular.module('app.table').constant('taskclosecallreasonModel', {
        'add': {
            "name": "name",
            "imagerequired":"imagerequired",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "name": "name",
            "imagerequired":"imagerequired",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "name": "name",
                "imagerequired":"imagerequired"
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
