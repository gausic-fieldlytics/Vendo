(function () {
    'use strict';
    angular.module('app.table').constant('taskhistoryModel', {
        'add': {
           "taskid":"taskid",
"schstartdate":"schstartdate",
"schenddate":"schenddate",
"actstartdate":"actstartdate",
"actenddate":"actenddate",
"alertdate":"alertdate",
"remarks":"remarks",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"schstartdate":"schstartdate",
"schenddate":"schenddate",
"actstartdate":"actstartdate",
"actenddate":"actenddate",
"alertdate":"alertdate",
"remarks":"remarks",
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
            "task":"task"
        }
    });
})();
