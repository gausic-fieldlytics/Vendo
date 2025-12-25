(function () {
    'use strict';
    angular.module('app.table').constant('targetfilesModel', {
        'add': {
           "taskid":"taskid",
"filepath":"filepath",
"executiondate":"executiondate",
"issuccess":"issuccess",
"status":"status"
        },
        'edit': {
            "id": "id",
           "taskid":"taskid",
"filepath":"filepath",
"executiondate":"executiondate",
"issuccess":"issuccess",
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
