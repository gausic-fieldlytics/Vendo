(function () {
    'use strict';
    angular.module('app.table').constant('usercompanyModel', {
        'add': {
           "userid":"userid",
"companyname":"companyname",
"address":"address",
"cityid":"cityid",
"stateid":"stateid",
"gstno":"gstno",
"panno":"panno",
"regno":"regno",
"pincode":"pincode",
"contactno":"contactno",
"email":"email",
"website":"website",
"remarks":"remarks",
"compstartdate":"compstartdate",
"companytypeid":"companytypeid",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "userid":"userid",
"companyname":"companyname",
"address":"address",
"cityid":"cityid",
"stateid":"stateid",
"gstno":"gstno",
"panno":"panno",
"regno":"regno",
"pincode":"pincode",
"contactno":"contactno",
"email":"email",
"website":"website",
"remarks":"remarks",
"compstartdate":"compstartdate",
"companytypeid":"companytypeid",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
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
            "user":"user",
"city":"city",
"state":"state",
"companytype":"companytype"
        }
    });
})();
