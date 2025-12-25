(function () {
    'use strict';
    angular.module('app.table').constant('generalsettingModel', {
        'add': {
           "mailcode":"mailcode",
"mailusername":"mailusername",
"mailpwd":"mailpwd",
"host":"host",
"issslenabled":"issslenabled",
"port":"port",
"smsurl":"smsurl",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "mailcode":"mailcode",
"mailusername":"mailusername",
"mailpwd":"mailpwd",
"host":"host",
"issslenabled":"issslenabled",
"port":"port",
"smsurl":"smsurl",
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
            
        }
    });
})();
