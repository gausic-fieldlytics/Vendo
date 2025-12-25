(function () {
    'use strict';
    angular.module('app.table').constant('taskpoolModel', {
        'add': {
           "taskid":"taskid",
"taskstatusid":"taskstatusid",
"targetid":"targetid",
"schstartdate":"schstartdate",
"schenddate":"schenddate",
"remarks":"remarks",
"isgroup":"isgroup",
"rate":"rate",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"taskstatusid":"taskstatusid",
"targetid":"targetid",
"schstartdate":"schstartdate",
"schenddate":"schenddate",
"remarks":"remarks",
"isgroup":"isgroup",
"rate":"rate",
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
"taskstatus":"taskstatus",
"target":"target"
        }
    });
})();
