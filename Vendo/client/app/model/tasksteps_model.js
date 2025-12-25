(function () {
    'use strict';
    angular.module('app.table').constant('taskstepsModel', {
        'add': {
            "taskid": "taskid",
            "listinputs": [{
                "step": "step",
                "taskid": "taskid",
                "sequence": "sequence",
                "executionhrs": "executionhrs",
                "notes": "notes",
                //"ismandatory": "ismandatory",
                "sampleimage": "sampleimage",
                "weightage": "weightage",
                "createdat": "createdat",
                "createdby": "createdby",
                // "modifiedat": "modifiedat",
                //  "modifiedby": "modifiedby",
                //  "status": "status"
            }],
        },
        'edit': {
            "id": "id",
           "step":"step",
"taskid":"taskid",
"sequence":"sequence",
"executionhrs":"executionhrs",
"notes":"notes",
"ismandatory":"ismandatory",
"sampleimage":"sampleimage",
"weightage":"weightage",
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
            "id": "id",
            "targetid": "targetid"
        },
        'edit_status': {
            "id": "id",
           // "targetid": "targetid",
            "statusid": "statusid",
            "userid": "userid",
            "remarks": "remarks"
            
        },
        'searchall': {
            "projectid":"projectid"
        },
        'searchall_grid': {
            "clientid": "clientid"
        },
        'searchall_task': {
            "projectid": "projectid",
        },
        'ddlist': {
            "project": "project~clientid"
          //  "task":"task"
        }
    });
})();
