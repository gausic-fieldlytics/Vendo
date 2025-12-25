(function () {
    'use strict';
    angular.module('app.table').constant('invoiceModel', {
        'add': {
           "invoiceno":"invoiceno",
"invoicedate":"invoicedate",
"isaccepted":"isaccepted",
"rejectreason":"rejectreason",
"rejecteddate":"rejecteddate",
"rejectedby":"rejectedby",
"workdoneby":"workdoneby",
"taskid":"taskid",
"paidstatusid":"paidstatusid",
"totalamt":"totalamt",
"createdat":"createdat",
"createdby":"createdby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "invoiceno":"invoiceno",
"invoicedate":"invoicedate",
"isaccepted":"isaccepted",
"rejectreason":"rejectreason",
"rejecteddate":"rejecteddate",
"rejectedby":"rejectedby",
"workdoneby":"workdoneby",
"taskid":"taskid",
"paidstatusid":"paidstatusid",
"totalamt":"totalamt",
"createdat":"createdat",
"createdby":"createdby",
"status": "status",
"task": "task",
"targetname": "targetname",
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
"pastatus":"pastatus"
        }
    });
})();
