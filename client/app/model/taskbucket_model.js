(function () {
    'use strict';
    angular.module('app.table').constant('taskbucketModel', {
        'add': {
           "taskid":"taskid",
"taskstatusid":"taskstatusid",
"targetid":"targetid",
"userid":"userid",
"schstartdate":"schstartdate",
"schenddate":"schenddate",
"actstartdate":"actstartdate",
"actenddate":"actenddate",
"alertdate":"alertdate",
"rate":"rate",
"progress":"progress",
"lastupdateddate":"lastupdateddate",
"isgroup":"isgroup",
"remarks":"remarks",
"auditdate":"auditdate",
"aduitedby":"aduitedby",
"createdat":"createdat",
"createdby":"createdby",
"modifiedat":"modifiedat",
"modifiedby":"modifiedby",
"status":"status"
        },
        'edit': {
            "taskid": "taskid",
"targetid":"targetid",
"userid":"userid",
"agencyid": "agencyid"
        },
        'reassign': {
          //  "listinputs": [{
                "id": "id",
                "userid": "userid",
                "agencyid": "agencyid"
          //  }],
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "agencyid": "agencyid"
        },
        'steps': {
            "id": "id"
        },
        'bytarget': {
            "targetid": "targetid",
            "projectid": "projectid",
            "flag": "flag",
            "agencyid": "agencyid"
        },
        'targetselection': {
            "userid": "userid",
            "projectid": "projectid",
        },
        'ddlist': {
          //  "task":"task",
//"taskstatus":"taskstatus",
//"target":"target",
//"user":"user"
        },
        'target': {
            "taskid": "taskid",
            "statusid": "statusid",
            "userid": "userid"
        }
        
    });
})();
