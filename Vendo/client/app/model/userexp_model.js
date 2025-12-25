(function () {
    'use strict';
    angular.module('app.table').constant('userexpModel', {
        'add': {
            "userid": "userid",
            "companyname": "companyname",
            "address": "address",
            "cityid": "cityid",
            "fromdate": "fromdate",
            "todate": "todate",
            "isverified": "isverified",
            "verifieddate": "verifieddate",
            "remarks": "remarks",
            "verifiedby": "verifiedby",
            "expproof": "expproof",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "userid": "userid",
            "companyname": "companyname",
            "address": "address",
            "cityid": "cityid",
            "fromdate": "fromdate",
            "todate": "todate",
            "isverified": "isverified",
            "verifieddate": "verifieddate",
            "remarks": "remarks",
            "verifiedby": "verifiedby",
            "expproof": "expproof",
            "status": "status"
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
            "user": "user",
            "city": "city",
            "state": "state"
        }
    });
})();
