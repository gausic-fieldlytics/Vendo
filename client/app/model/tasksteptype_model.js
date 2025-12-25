(function () {
    'use strict';
    angular.module('app.table').constant('tasksteptypeModel', {
        'add': {
            "tasksteptype": "tasksteptype",
            "createdat": "createdat",
            "createdby": "createdby",
            "lststepid": "lststepid",
            "lstInputs": [{
                "step": [{
                    "id": "id",
                    "step": "step",                   
                    "sequence": "sequence",
                }] 
            }],            
            "status": "status"
        },
        'edit': {
            "id": "id",
            "tasksteptype": "tasksteptype",
            "lststepid": "lststepid",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "lstInputs": [{
                "step": [{
                    "id": "id",
                    "step": "step",
                   // "taskid": "taskid",
                    "sequence": "sequence",
                }] 
            }], 
        },
        'ques_searchall': {
            "tasksteptypeid": "tasksteptypeid",
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "tasksteptype": "tasksteptype",
                "liststep":"liststep"
            }]
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

        }
    });
})();
