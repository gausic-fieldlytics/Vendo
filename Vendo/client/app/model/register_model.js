(function () {
    'use strict';
    angular.module('app.table').constant('registerModel', {
        'add': {
            "firstname": "firstname",
            "lastname": "lastname",
            "email": "email",
            "contactno": "contactno",
            "genderid": "genderid",
            "stateid": "stateid",
            "cityid": "cityid",
            "otp": "otp",
            "createdat": "createdat",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "firstname": "firstname",
            "lastname": "lastname",
            "email": "email",
            "contactno": "contactno",
            "genderid": "genderid",
            "stateid": "stateid",
            "cityid": "cityid",
            "otp": "otp",
            "createdat": "createdat",
            "status": "status"
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "stateid": "stateid",
            "cityid": "cityid",
           // "genderid": "genderid"
        },
        'ddlist': {
            "gender": "gender",
            "state": "state",
            "city": "city~stateid"
        }
    });
})();
