(function () {
    'use strict';
    angular.module('app.table').constant('progressModel', {
        'add': {
            "projectid": "projectid",
            "tasktitle": "tasktitle",
            "taskdescription": "taskdescription",
            "startdate": "startdate",
            "enddate": "enddate",
            "refimage": "refimage",
            "remarks": "remarks",
            "taskstatusid": "taskstatusid",
            "taskskillid": "taskskillid",
            "rate": "rate",
            "isgroup": "isgroup",
            "groupmemcnt": "groupmemcnt",
            "taskto": "taskto",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "projectid": "projectid",
            "tasktitle": "tasktitle",
            "taskdescription": "taskdescription",
            "startdate": "startdate",
            "enddate": "enddate",
            "refimage": "refimage",
            "remarks": "remarks",
            "taskstatusid": "taskstatusid",
            "taskskillid": "taskskillid",
            "rate": "rate",
            "isgroup": "isgroup",
            "groupmemcnt": "groupmemcnt",
            "taskto": "taskto",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "taskid": "taskid",
            "targetid": "targetid"
        },
        'searchall': {
            "id": "id",
            "projectid": "projectid",
            "taskid": "taskid",
            "stateid": "stateid",
            "cityid": "cityid",
            "fromdate": "fromdate",
            "agencyid": "agencyid"
        },
        'searchall_agency': {
            "agencyid": "agencyid"
        },
        'searchall_task': {
            "projectid":"projectid"
        },
        'searchall_taskstep': {
            "id": "id"
        },
        'approved': {
            "taskid": "taskid",
            "targetid": "targetid",
            "taskstatusid": "taskstatusid",
            "remark": "remark",
            "userid": "userid",
            "projectid": "projectid",
            "auditby": "auditby",
           
        },
        'target': {
            "taskid":"taskid"
        },
        'audit_task': {
            "targetid": "targetid",
            "projectid": "projectid",
            "taskid": "taskid",
            "stateid": "stateid",
            "cityid": "cityid",
            "fromdate": "fromdate",
            "agencyid": "agencyid"
        },
        'target_agency': {
            "taskid": "taskid",
            "agencyid":"agencyid"
        },
        'ddlist': {
            "project": "project~clientid",
            "state": "state",
            "city": "city~stateid",
            "task": "task~projectid",
            "agency": "agency~usertypecode",
           // "taskstatus": "taskstatus",
           // "task": "task",

          //  "skill": "skill"
        }
    });
})();
