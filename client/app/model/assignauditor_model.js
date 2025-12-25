(function () {
    'use strict';
    angular.module('app.table').constant('AssignauditorModel', {
        'add': {
            "projectid": "projectid",
            "auditid": "auditid",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "projectid": "projectid",
            "auditid": "auditid",
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
        },
        'ddlist': {
            "client": "client",
            "auditor": "auditor",
            "project": "project~clientid",
        }
    });
})();
