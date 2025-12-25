(function () {
    'use strict';
    angular.module('app.table').constant('roleModel', {
        'add': {
            "roletype": "roletype",
            "rolecode": "rolecode",
            "status": "status",
            "roleid": "roleid",
            "homeshow": "homeshow",
            "lookupshow": "lookupshow",
            "mastershow": "mastershow",
            "projectshow": "projectshow",
            "agencyshow": "agencyshow",
            "auditshow": "auditshow",
            "settingshow": "settingshow",
            "reportshow": "reportshow",
            "listinputs": [{
                "headerid": "headerid",
                "pageid": "pageid",
                "addshow": "addshow",
                "editshow": "editshow",
                "deleteshow": "deleteshow",
            }]
        },
        'edit': {
            "id": "id",
            "roletype": "roletype",
            "rolecode": "rolecode",
            "status": "status",
            "roleid": "roleid",
            "homeshow": "homeshow",
            "lookupshow": "lookupshow",
            "mastershow": "mastershow",
            "projectshow": "projectshow",
            "agencyshow": "agencyshow",
            "auditshow": "auditshow",
            "settingshow": "settingshow",
            "reportshow": "reportshow",
            "listinputs": [{
                "headerid": "headerid",
                "pageid": "pageid",
                "addshow": "addshow",
                "editshow": "editshow",
                "deleteshow": "deleteshow",
            }]
        },
        'bulk_add': {
            "flag": "flag",
            "listinputs": [{
                "roletype": "roletype",
                "rolecode": "rolecode",
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
        'searchall_permission': {
            "roleid": "roleid",
        },
        'ddlist': {
            "pages": "pages"
        }
    });
})();
