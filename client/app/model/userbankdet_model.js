(function () {
    'use strict';
    angular.module('app.table').constant('userbankdetModel', {
        'add': {
            "userid": "userid",
            "bankname": "bankname",
            "accnumber": "accnumber",
            "accholdername": "accholdername",
            "branch": "branch",
            "ifsc": "ifsc",
            "address": "address",
            "remarks": "remarks",
            "image": "image",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "userid": "userid",
            "bankname": "bankname",
            "accnumber": "accnumber",
            "accholdername": "accholdername",
            "branch": "branch",
            "ifsc": "ifsc",
            "address": "address",
            "remarks": "remarks",
            "image": "image",
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
            "user": "user"
        }
    });
})();
