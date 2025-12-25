(function () {
    'use strict';
    angular.module('app.table').constant('newtaskModel', {
   
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "userid":"userid"
        },
        'taskpreview': {
            "userid": "userid",
            "count": "count",
            "limit":"limit"
        },
        'targetselection': {
            "userid": "userid",
        },
        'steps': {
            "id": "id"
        },
        'bytarget': {
            "targetid": "targetid",
            "projectid": "projectid",
            "flag":"flag"
        },
        'target': {
            "taskid": "taskid",
            "statusid": "statusid",
            "userid": "userid"
        },
        'ddlist': {
            //"project": "project~clientid",
            //"taskstatus": "taskstatus",
            //"task": "task",

            //"skill": "skill"
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
