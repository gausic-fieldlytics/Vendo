(function () {
    'use strict';
    angular.module('app.table').constant('reportModel', {
        'projectreportddlist': {
            "projectstatus": "projectstatus",
            "client": "client",
        },
        'projectrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "clientid": "clientid",
            "statusid": "statusid",
        },
        'taskreportddlist': {
            "taskstatus": "taskstatus",
            "skill": "skill",
            "area": "area~cityid~stateid",
            "city": "city~stateid"
        },
        'taskrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "statusid": "statusid",
            "skillid": "skillid",
            "projectid": "projectid",
            "areaid": "areaid",
            "cityid": "cityid",
        },

        'taskprocessreportddlist': {
            "taskstatus": "taskstatus",
            "city": "city~stateid"
        },
        'taskprocesstask': {
            "projectid": "projectid"
        },
        'taskprocessrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "statusid": "statusid",
            "cityid": "cityid",
        },

        'collecteditemddlist': {
           // "bank": "bank",
          //  "product": "product",
        },
        'collecteditemrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
           // "productid": "productid",
           // "bankid": "bankid",
        },

        'auditreportddlist': {
            "city": "city~stateid"
        },
        'ppmsuser': {
        },
        'auditrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "auditby": "auditby",
            "cityid": "cityid",
        },
        
        'invoicereportddlist': {
            
        },
        'invoicerunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "auditby": "auditby",
            "paidby": "paidby",
            "usertypeid":"usertypeid"
        },
        'agencyreportddlist': {
            "skill": "skill",
            "area": "area~cityid~stateid",
            "prooftype": "prooftype",
            "city": "city~stateid"
            
        },
        
        'agencyrunreport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "skillid": "skillid",
            "areaid": "areaid",
            "cityid":"cityid",
            "prooftypeid": "prooftypeid",
            "ddlbank": "ddlbank",
            "usertypeid": "usertypeid"
        },
    });
})();
