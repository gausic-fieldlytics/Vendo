(function () {
    'use strict';
    angular.module('app.table').constant('emailtemplateModel', {
        'add': {
           "templatename":"templatename",
"templatecode":"templatecode",
"displayemailid":"displayemailid",
"subject":"subject",
"body":"body",
"filename":"filename",
"htmlfilepath":"htmlfilepath",
"mailcc":"mailcc",
"mailbcc":"mailbcc",
"signature":"signature",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "templatename":"templatename",
"templatecode":"templatecode",
"displayemailid":"displayemailid",
"subject":"subject",
"body":"body",
"filename":"filename",
"htmlfilepath":"htmlfilepath",
"mailcc":"mailcc",
"mailbcc":"mailbcc",
"signature":"signature",
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
          //  "displayemail":"displayemail"
        }
    });
})();
