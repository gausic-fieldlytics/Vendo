(function () {
    'use strict';
    angular.module('app.table').constant('taskModel', {
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
            "taskpublishdate":"taskpublishdate",
            "rate": "rate",
            "isoptional": "isoptional",
            "weightage":"weightage",
               "criticaldate": "criticaldate",
            "customerrate": "customerrate",
            "createdat": "createdat",
            "createdby": "createdby",
              "lstquestionid": "lstquestionid",
           // "modifiedby": "modifiedby",
            "status": "status",
            "lstInputs": [{
                //"item": [{
                //    "itemid": "itemid",
                //    "qty": "qty"

                //}],
                "question": [{
                    "id": "id",
                    "question": "question",
                   // "taskid": "taskid",
                    "ismandatory": "ismandatory",
                }]


                
            }],
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
            "taskpublishdate": "taskpublishdate",
            "rate": "rate",
            "isoptional": "isoptional",
            "customerrate": "customerrate",
            "weightage": "weightage",
            "criticaldate": "criticaldate",
            "lstquestionid": "lstquestionid",
            //"createdat": "createdat",
          //  "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            // "status": "status"
            "lstInputs": [{
                //"item": [{
                //    "itemid": "itemid",
                //    "qty": "qty"

                //}],
                "question": [{
                    "id": "id",
                    "question": "question",
                    //"taskid": "taskid",
                    "ismandatory": "ismandatory",
                }]

            }],
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id"
        },
        'searchall_target': {
            "taskid": "taskid"
        },
        
        'searchall': {
            "projectid": "projectid",
            "statusid": "statusid",
            "fromdate": "fromdate",
            "todate":"todate"
        },
        'searchall_alltarget': {
            "stateid": "stateid",
            "cityid": "cityid",
            "areaid": "areaid",
            
        },
        'ddlist': {
            "project": "project~clientid~statusid",
            "taskstatus": "taskstatus",
            "skill": "skill",
            "item": "item"
        },
        'step_add': {
            "taskid": "taskid",
        "listinputs": [{
            "step": "step",
            "taskid": "taskid",
            "sequence": "sequence",
            "executionhrs": "executionhrs",
            "notes": "notes",
            "ismandatory": "ismandatory",
            "sampleimage": "sampleimage",
            "weightage": "weightage",
            "createdat": "createdat",
            "createdby": "createdby",
           // "modifiedat": "modifiedat",
          //  "modifiedby": "modifiedby",
          //  "status": "status"
        }],
        

        },
        'ques_searchall': {
            "taskid": "taskid",
        },
        'qus_add': {
            "taskid": "taskid",
            "listinputs": [{
                "question": "question",
                "taskid": "taskid",
                "ismandatory": "ismandatory",
            }]

        },
    });
})();
