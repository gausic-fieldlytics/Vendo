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
            "city": "city~stateid",
            "client": "client",
        },
        'taskrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "statusid": "statusid",
            "skillid": "skillid",
            "projectid": "projectid",
            "areaid": "areaid",
            "cityid": "cityid",
            "clientid": "clientid",
        },

        'taskprocessreportddlist': {
            "client": "client",
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
            "clientid": "clientid",
        },

        'collecteditemddlist': {
            "client": "client",
           // "bank": "bank",
          //  "product": "product",
        },
        'collecteditemrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "clientid": "clientid",
           // "productid": "productid",
           // "bankid": "bankid",
        },

        'auditreportddlist': {
            "client": "client",
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
            "clientid": "clientid",
        },
        
        'invoicereportddlist': {
            "client": "client",
        },
        'invoicerunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "auditby": "auditby",
            "paidby": "paidby",
            "usertypeid":"usertypeid",
            "clientid": "clientid",
        },
        'userprojectrunReport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "projectid": "projectid",
            "taskid": "taskid",
            "targetid": "targetid",
            "auditby": "auditby",
            "paidby": "paidby",
            "usertypeid":"usertypeid",
            "clientid": "clientid",
        },
        'userprojectimagerunReport': {
            "task":"task",
            "reporttype":"reporttype",
            "listinputs": [{
                "client": "client",
                "projectname": "projectname",
                "taskid": "taskid",
                "task": "task",
                "targetid": "targetid",
                "targetname": "targetname",
                "executiondate": "executiondate",
                "photoUrls": "photoUrls",   
            }],
        },
        'userproject':{
            'projectList':'projectList'
        },
        'agencyreportddlist': {
            "state":"state",
            "city": "city~stateid",
            "area": "area~cityid~stateid",
            "skill": "skill",            
            "prooftype": "prooftype"
            
            
        },
        
        'agencyrunreport': {
            "fromdate": "fromdate",
            "todate": "todate",
            "stateid": "stateid",
            "skillid": "skillid",
            "areaid": "areaid",
            "cityid":"cityid",
            "prooftypeid": "prooftypeid",
            "ddlbank": "ddlbank",
            "usertypeid": "usertypeid"
        },
    });
})();
