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
            "qrScanMode":"qrScanMode",
            "weightage":"weightage",
               "criticaldate": "criticaldate",
            "customerrate": "customerrate",
            "createdat": "createdat",
            "createdby": "createdby",
              "lstquestionid": "lstquestionid",
           // "modifiedby": "modifiedby",
            "status": "status",
            "questiontypeids":"questiontypeids",
            "lstInputs": [{
                //"item": [{
                //    "itemid": "itemid",
                //    "qty": "qty"

                //}],
                "question": [{
                    "id": "id",
                    "question": "question",
                    "questiontypeid":"questiontypeid",
                    "datatype":"datatype",
                    "controltype":"controltype",
                    "enums":"enums",
                   // "taskid": "taskid",
                    "ismandatory": "ismandatory",
                    "isimagerequired": "isimagerequired",
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
            "qrScanMode":"qrScanMode",
            "customerrate": "customerrate",
            "weightage": "weightage",
            "criticaldate": "criticaldate",
            "lstquestionid": "lstquestionid",
            "lstclosecallid": "lstclosecallid",
            //"createdat": "createdat",
          //  "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "questiontypeids":"questiontypeids",
            // "status": "status"
            "lstInputs": [{
                //"item": [{
                //    "itemid": "itemid",
                //    "qty": "qty"

                //}],
                "closecall": [{
                   "id": "id",
                   "closecallid": "closecallid",                     
                   "amount": "amount",
                   "imagerequired": "imagerequired"
                }],

                "question": [{
                    "id": "id",
                    "question": "question",
                    "questiontypeid":"questiontypeid",
                    "datatype":"datatype",
                    "controltype":"controltype",
                    "enums":"enums",
                    //"taskid": "taskid",
                    "ismandatory": "ismandatory",
                    "isimagerequired": "isimagerequired",
                }]

            }],
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id"
        },
        'search_taskById': {
            "taskid": "taskid"
        },
        
        'searchall': {
            "clientid":"clientid",
            "projectid": "projectid",
            "statusid": "statusid",
            "fromdate": "fromdate",
            "todate":"todate"
        },
        'searchall_alltarget': {
            "stateid": "stateid",
            "cityid": "cityid",
            "areaid": "areaid",
            "clientid":"clientid",
            "start": "start",
            "end": "end",
            "active":"active",
            "targetName":"targetName"       
        },
        'search_target_clientid': {           
            "clientid":"clientid",   
            "taskid":"taskid",        
            "targetName":"targetName"       
        },
        'ddlist': {
            "client": "client",
            "project": "project~clientid~statusid",
            "taskstatus": "taskstatus",
            "taskquestiontype":"taskquestiontype",
            "skill": "skill",
            "item": "item", 
            "taskclosecallreason": "taskclosecallreason",
            "agency": "agency~usertypecode",
            "state": "state",
            "city": "city~stateid",
            "area": "area~cityid~stateid"
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
            "closecallid": "closecallid"
        },
        'ques_searchquestionall': {
            "questiontypeid": "questiontypeid",
        },
        'qus_add': {
            "taskid": "taskid",
            "listinputs": [{
                "question": "question",
                "taskid": "taskid",
                "ismandatory": "ismandatory",
                "isimagerequired": "isimagerequired",
            }]

        },
    });
})();
