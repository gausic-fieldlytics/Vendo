(function () {
    'use strict';
    angular.module('app.table').constant('cityModel', {
        'add': {
            "cityname": "cityname",
            "stateid": "stateid",
            "lat": "lat",
            "lng": "lng",
            "createdat": "createdat",
            "createdby": "createdby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "cityname": "cityname",
            "stateid": "stateid",
            "lat": "lat",
            "lng": "lng",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "cityname": "cityname",
                "stateid": "stateid",
            }]
        },
        'delete': {
            "id": "id",
            "modifiedby": "modifiedby",

        },
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "stateid": "stateid",
        },
        'ddlist': {
            "state": "state"
        }
    });
})();
