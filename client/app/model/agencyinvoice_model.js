(function () {
    'use strict';
    angular.module('app.table').constant('agencyinvoiceModel', {

        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "userid": "userid"
        },
        
        'invoicetask': {
            "agencyid": "agencyid",
        },
        'transaction': {
            "userid": "userid",
            "paymentflag": "paymentflag",
            "fromdate": "fromdate",
            "todate": "todate"

        },
        'target': {
            "taskid": "taskid",
            "statusid": "statusid",
            "userid": "userid"
        },
        'ddlist': {
            //"project": "project~clientid",
            //"taskstatus": "taskstatus",
            //"task": "task",

            //"skill": "skill"
        },
        'createinvoice': {
            "taskid": "taskid",
            "targetid": "targetid",
            "userid": "userid",
            
        },
        'send_invoice_otp': {
            "contactno": "contactno",
            "userid": "userid"
            
        },
        'invoice_add': {
            "otp":"otp",
            "taskid": "taskid",
            "targetid": "targetid",
            "userid": "userid",
            "invoicepath": "invoicepath",
            "signature": "signature",
            "totalamount":"totalamount",
            "listinputs": [{
                "taskid": "taskid",
                "targetid": "targetid",
            }],
        }
    });
})();
