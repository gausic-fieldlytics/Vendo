(function () {
    'use strict';
    angular.module('app.table').constant('taskstepprogressModel', {
        'add': {
           "taskid":"taskid",
"taskstepid":"taskstepid",
"comments":"comments",
"taskstatusid":"taskstatusid",
"auditedby":"auditedby",
"auditedat":"auditedat",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"taskstepid":"taskstepid",
"comments":"comments",
"taskstatusid":"taskstatusid",
"auditedby":"auditedby",
"auditedat":"auditedat",
"status":"status"
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "taskid": "taskid",
            "taskstepid": "taskstepid"
        },
        'searchall': {           
        },
        'ddlist': {
            "task":"task",
"taskstep":"taskstep",
"taskstatus":"taskstatus"
        }
    });
})();
