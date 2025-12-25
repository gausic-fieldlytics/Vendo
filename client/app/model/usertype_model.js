(function () {
    'use strict';
    angular.module('app.table').constant('usertypeModel', {
        'add': {
            "usertypename": "usertypename",
            "usertypecode": "usertypecode",

            "status": "status"
        },
        'edit': {
            "id": "id",
            "usertypename": "usertypename",
            "usertypecode": "usertypecode",
            //"mastershow": "mastershow",
            //"projectshow": "projectshow",
            //"agencyshow": "agencyshow",
            //"auditshow": "auditshow",
            //"settingshow": "settingshow",
            //"reportshow": "reportshow",
            "status": "status"
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "usertypename": "usertypename",
                "usertypecode": "usertypecode",
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
