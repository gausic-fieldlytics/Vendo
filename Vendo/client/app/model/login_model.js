(function () {
    'use strict';
    angular.module('app.table').constant('loginModel', {
        'add': {
            "username": "username",
            "password": "password",
            "userid": "userid",
            "islocked": "islocked",
            "lastlogindatetime": "lastlogindatetime",
            "passwordchangedatetime": "passwordchangedatetime",
            "failurecount": "failurecount",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status"
        },
        'edit': {
            "id": "id",
            "username": "username",
            "password": "password",
            "userid": "userid",
            "islocked": "islocked",
            "lastlogindatetime": "lastlogindatetime",
            "passwordchangedatetime": "passwordchangedatetime",
            "failurecount": "failurecount",
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
            "userDD": "userDD",
            "ppmsuser": "ppmsuser"
        }
    });
})();
