(function () {
    'use strict';
    angular.module('app.table').constant('profileModel', {
        'add': {
            "id": "id",
            "username": "username",
            "password": "password",
            "islocked": "islocked",
           // "status": "status",
            "employeeid": "employeeid"
        },
        'searchall': {
            "loginid": "loginid",
        }
       
    });
})();