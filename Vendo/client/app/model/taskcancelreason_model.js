(function () {
    'use strict';
    angular.module('app.table').constant('taskcancelreasonModel', {
        'add': {
            "taskcancelreasonname": "taskcancelreasonname",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "taskcancelreasonname": "taskcancelreasonname",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "taskcancelreasonname": "taskcancelreasonname",
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
