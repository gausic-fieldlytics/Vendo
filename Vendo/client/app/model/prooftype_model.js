(function () {
    'use strict';
    angular.module('app.table').constant('prooftypeModel', {
        'add': {
            "prooftypename": "prooftypename",
            "proofcode": "proofcode",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "prooftypename": "prooftypename",
            "proofcode": "proofcode",
            "status": "status"
        }, 'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "prooftypename": "prooftypename",
                "proofcode": "proofcode",
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
