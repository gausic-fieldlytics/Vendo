(function () {
    'use strict';
    angular.module('app.table').constant('taskdoneModel', {
        'add': {
           "taskid":"taskid",
"taskstatusid":"taskstatusid",
"userid":"userid",
"donedate":"donedate",
"rating":"rating",
"comments":"comments",
"image":"image",
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
"userid":"userid",
"donedate":"donedate",
"rating":"rating",
"comments":"comments",
"image":"image",
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
"user":"user"
        }
    });
})();
