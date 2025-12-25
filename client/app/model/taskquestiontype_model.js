(function () {
    'use strict';
    angular.module('app.table').constant('taskquestiontypeModel', {
        'add': {
            "questiontype": "questiontype",
            "createdat": "createdat",
            "createdby": "createdby",
            "lstquestionid": "lstquestionid",
            "lstInputs": [{
                "question": [{
                    "id": "id",
                    "question": "question",                   
                    "ismandatory": "ismandatory",
                }] 
            }],            
            "status": "status"
        },
        'edit': {
            "id": "id",
            "questiontype": "questiontype",
            "lstquestionid": "lstquestionid",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "lstInputs": [{
                "question": [{
                    "id": "id",
                    "question": "question",
                   // "taskid": "taskid",
                    "ismandatory": "ismandatory",
                }] 
            }], 
        },
        'ques_searchall': {
            "questiontypeid": "questiontypeid",
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "questiontype": "questiontype",
                "listquestion":"listquestion"
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
