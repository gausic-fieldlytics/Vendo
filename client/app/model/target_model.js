(function () {
    'use strict';
    angular.module('app.table').constant('targetModel', {
        'add': {
            "taskid": "taskid",
            "targetname": "targetname",
            "clientid": "clientid",
            "stateid": "stateid",
            "cityid": "cityid",
            "areaid": "areaid",
            "street": "street",
            "address": "address",
            "landmark": "landmark",
            "pickuplocation": "pickuplocation",
            "phoneno": "phoneno",
          //  "clientref": "clientref",
         //  
            "remarks": "remarks",
            
            //  "targetloc": "targetloc",

            
            "supportcontact": "supportcontact",
            "supportnumber": "supportnumber",

            "distributor": "distributor",
            "districontact": "districontact",

            "lat": "lat",
            "lng": "lng",
            "islocked":"islocked",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "taskid": "taskid",
            "targetname": "targetname",
            "stateid": "stateid",
            "clientid": "clientid",
            "cityid": "cityid",
            "areaid": "areaid",
            "street": "street",
            "address": "address",
            "landmark": "landmark",
            "pickuplocation": "pickuplocation",
            "phoneno": "phoneno",
            //  "clientref": "clientref",
            //  
            "remarks": "remarks",

            //  "targetloc": "targetloc",
            "distributor": "distributor",
            "districontact": "districontact",

            "lat": "lat",
            "lng": "lng",
            "islocked": "islocked",
            "supportcontact": "supportcontact",
            "supportnumber": "supportnumber",
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
            "id": "id"
        },
        'searchall': {
            "stateid": "stateid",
            "cityid": "cityid",
            "clientid": "clientid",
            "areaid": "areaid",
            "start": "start",
            "end": "end",
            "active":"active",
            "targetName":"targetName"
        },
        'searchall_task': {
            "projectid": "projectid",
            "flag": "flag",
            "taskid":"taskid"
        },
        'searchall_bytask': {
            "taskid": "taskid",
        },
        'task_target_mapping': {
            "taskid": "taskid",
            "listinputs": [
                {
                    "targetid": "targetid"
                }
            ]
        },
        'load_target': {
            "id": "id",
            "flag": "flag",
            "targetName":"targetName",
            "stateid":"stateid",
            "cityid":"cityid",
            "clientid":"clientid",
            "start":"start",
            "end":"end",
            "active":"active",
        },
        'grid_searchall': {
            "projectid": "projectid",
            "clientid":"clientid",
            //"stateid":"stateid",
            //"cityid":"cityid",
            //"areaid": "areaid",
        },
        'ddlist': {
            "state": "state",
            "city": "city~stateid",
            "area": "area~cityid~stateid",
          //  "task": "task~project~taskstatus~skill",
            "client": "client",
            "project": "project~clientid"
        },
        'ddlist_mapping': {
            "state": "state",
            "city": "city~stateid",
            "area": "area~cityid~stateid",
            //  "task": "task~project~taskstatus~skill",
            "client": "client",
            "project": "project~clientid"
        }
    });
})();
