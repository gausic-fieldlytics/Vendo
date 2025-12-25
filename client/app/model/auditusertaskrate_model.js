(function () {
    'use strict';
    angular.module('app.table').constant('auditUserTaskRateModel', {
        
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
        'audit_save': {   
            "id": "id",         
            "listinputs": [{
                "id": "id",
                "taskid":"taskid",
                "targetid":"targetid",
                "createdby":"createdby",
                "status":"status"
            }]
        },
        'select_payment': {
            
            "taskid": "taskid",
            "targetid": "targetid"
            
        },
    });
})();
