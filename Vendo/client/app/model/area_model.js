(function () {
    'use strict';
    angular.module('app.table').constant('areaModel', {
        'add': {
            
            "stateid": "stateid",
            "cityid": "cityid",
            "areaname": "areaname",
            "pincode": "pincode",
            "createdat": "createdat",
            "createdby": "createdby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "stateid": "stateid",
            "cityid": "cityid",
            "areaname": "areaname",
            "pincode": "pincode",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
               // "statename": "statename",
                // "cityname": "cityname",
                 "stateid": "stateid",
                "cityid": "cityid",
                "areaname": "areaname",
                "pincode": "pincode",
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
            "cityid": "cityid"
        },
        'searchall_city': {
            "stateid": "stateid",
        },
        'ddlist': {
            "state": "state",
            "city": "city~stateid"
        }
    });
})();
