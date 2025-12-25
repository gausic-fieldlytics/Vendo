(function () {
    'use strict';
    angular.module('app.table').constant('paymentModel', {
        'add': {
           "taskid":"taskid",
"paidamount":"paidamount",
"paiddate":"paiddate",
"paymentmodeid":"paymentmodeid",
"paymentref":"paymentref",
"paymentdesc":"paymentdesc",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"paidamount":"paidamount",
"paiddate":"paiddate",
"paymentmodeid":"paymentmodeid",
"paymentref":"paymentref",
"paymentdesc":"paymentdesc",
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
            "task":"task",
"paymentmode":"paymentmode"
        }
    });
})();
