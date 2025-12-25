(function () {
    'use strict';
    angular.module('app.table').constant('clientModel', {
        'add': {
            "companyname": "companyname",
            "contactno": "contactno",
            "email": "email",
            "stateid": "stateid",
            "cityid": "cityid",
            "areaid": "areaid",
            "address": "address",
            "pincode": "pincode",
            "telephone": "telephone",
            "contactperson": "contactperson",
            "contactpersonno": "contactpersonno",
            "gstno": "gstno",
            "createdat": "createdat",
            "createdby": "createdby"

        },
        'edit': {
            "id": "id",
            "companyname": "companyname",
            "contactno": "contactno",
            "email": "email",
            "stateid": "stateid",
            "cityid": "cityid",
            "areaid": "areaid",
            "address": "address",
            "pincode": "pincode",
            "telephone": "telephone",
            "contactperson": "contactperson",
            "contactpersonno": "contactpersonno",
            "gstno": "gstno",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby"
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
            "state": "state",
            "city": "city~stateid",

            "area": "area~cityid~stateid",
        }
    });
})();
