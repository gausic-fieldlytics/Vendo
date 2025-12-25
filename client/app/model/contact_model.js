(function () {
    'use strict';
    angular.module('app.table').constant('contactModel', {
        'add': {
           "photo":"photo",
"email":"email",
"mobileno":"mobileno",
"contacttypeid":"contacttypeid",
"telephoneno":"telephoneno",
"address":"address",
"zipcode":"zipcode",
"cityid":"cityid",
"stateid":"stateid",
"comments":"comments",
"createdat":"createdat",
"status":"status"
        },
        'edit': {
            "id": "id",
           "photo":"photo",
"email":"email",
"mobileno":"mobileno",
"contacttypeid":"contacttypeid",
"telephoneno":"telephoneno",
"address":"address",
"zipcode":"zipcode",
"cityid":"cityid",
"stateid":"stateid",
"comments":"comments",
"createdat":"createdat",
"status":"status"
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
            "contacttype":"contacttype",
"city":"city",
"state":"state"
        }
    });
})();
