(function () {
    'use strict';
    angular.module('app.table').constant('reassignModel', {
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
"oldagencyid": "oldagencyid",
"agencyid": "agencyid",
"olduserid": "olduserid",
"userid":"userid"
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
            "agencyid": "agencyid",
            "userid": "userid"
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
        'ddlist': {
            "agency": "agency~usertypecode",
//"taskstatus":"taskstatus",
//"target":"target",
//"user":"user"
        },
        'target': {
            "taskid": "taskid",
            "statusid": "statusid",
            "userid": "userid"
        },
        'targetselection': {
            "userid": "userid",
        },
        'taskbucket_add': {

            "listinputs": [{
                "taskid": "taskid",
                "targetid": "targetid",
                "userid": "userid",

            }]

        },
        
    });
})();
