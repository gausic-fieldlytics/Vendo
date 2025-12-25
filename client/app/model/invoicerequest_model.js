(function () {
    'use strict';
    angular.module('app.table').constant('invoiceReqModel', {
        
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "projectid":"projectid"
        },
        'target': {
            "taskid":"taskid"
        },
        'ddlist': {
          //  "project": "project~clientid",
                "paymentstatus": "paymentstatus",
                "paymentmode": "paymentmode",

         //   "skill": "skill"
        },
        'searchall_otp': {
        },
        'reqddlist': {
            "paymentstatus": "paymentstatus",
            "paymentmode":"paymentmode",
        
        },
        'invoice_edit': {
            "id": "id",

           // "taskid": "taskid",
            //  
            "requestuserid": "requestuserid",
            "invoicepath":"invoicepath",
            "paymentmodeid":"paymentmodeid",

            "isaccepted": "isaccepted",
            "rejectreason": "rejectreason",
            "rejectedby": "rejectedby",
           
            "paidstatusid": "paidstatusid",
            "totalamt": "totalamt",
            "penalty":"penalty",
            "penaltyreason":"penaltyreason",
            "userid": "userid",
            "paymentmode": "paymentmode",
            "paymentstatus": "paymentstatus",
            "rating": "rating",
            "paymentref": "paymentref",
            "paymentdesc": "paymentdesc",
            
        },
        'select_payment': {
            
            "taskid": "taskid",
            "targetid": "targetid"
            
        },
        'userprojectimagerunReport': {            
            "reporttype":"reporttype",
            "listinputs": [{
                "invoiceno": "invoiceno",
                "invoicepth": "invoicepth",
                "username": "username"                 
            }],
        },
    });
})();
