(function () {
    'use strict';
    angular.module('app.table').constant('tasksprogressModel', {
       
        'searchbyid': {
            "id": "id",
            "targetid": "targetid"
        },
        'search_progress': {
            "taskid": "taskid",
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
        },
        'filterddlist': {
            "client": "client",
            "taskstatus": "taskstatus",
            "project": "project~clientid"
        },
        'search_taskprogress': {
            "fromdate": "fromdate",
            "todate": "todate",
            "clientid": "clientid",
            "projectid": "projectid",
            "taskid": "taskid",
            "taskstatusid": "taskstatusid",
            "agencyid": "agencyid",
        },
        'taskrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "statusid": "statusid",
            "skillid": "skillid"
        },

    });
})();
