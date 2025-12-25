(function () {
    'use strict';
    angular.module('app.table').constant('stateModel', {
        'add': {
            "statename": "statename",
            "lat": "lat",
            "lng": "lng",
            
            "statecode": "statecode",
            "createdat": "createdat",
            "createdby": "createdby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "statename": "statename",
            "lat": "lat",
            "lng": "lng",
            "statecode": "statecode",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "statename": "statename",
                "statecode": "statecode"
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
        },
        'ddlist': {

        }
    });
})();
