(function () {
    'use strict';
    angular.module('app.table').constant('projectModel', {
        'add': {
            "projecttitle": "projecttitle",
            "projectdesc": "projectdesc",
            "clientid": "clientid",
            "startdate": "startdate",
            "enddate": "enddate",
            "pon": "pon",
            "pov": "pov",
            "custom1": "custom1",
            "custom2": "custom2",
            "revenue": "revenue",
            "cost": "cost",
            "projectstatusid":"projectstatusid",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status",
            "offlineMode": "offlineMode",
            "isMapEnable": "isMapEnable",
            "isVariablePricing":"isVariablePricing",
            "lstInputs": [{
                "item": [{
                    "itemid": "itemid",
                    "qty": "qty",
                    "totalqty":"totalqty"

                }]
            }],
        },
        'edit': {
            "id": "id",
            "projecttitle": "projecttitle",
            "projectdesc": "projectdesc",
            "clientid": "clientid",
            "startdate": "startdate",
            "enddate": "enddate",
            "pon": "pon",
            "pov": "pov",
            "custom1": "custom1",
            "custom2": "custom2",
            "revenue": "revenue",
            "cost": "cost",
            "projectstatusid": "projectstatusid",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "status": "status",
            "offlineMode": "offlineMode",
            "isMapEnable":"isMapEnable",
            "isVariablePricing":"isVariablePricing",
            "lstInputs": [{
                "item": [{
                    "itemid": "itemid",
                    "qty": "qty",
                    "totalqty": "totalqty"
                }]
            }],
        },
        'item_searchall': {
            "projectid": "projectid"
        },
        'delete': {
            "id": "id",
            "userid":"userid"
        },
        'searchbyid': {
            "id": "id"
        },
        'searchall': {
            "clientid": "clientid",
            "statusid": "statusid",
            "fromdate": "fromdate",
            "todate":"todate"
        },
        'searchall_target': {
            "projectid": "projectid"
        },
        'ddlist': {
            "client": "client",
            "projectstatus": "projectstatus",
            "item": "item"
        }
    });
})();
