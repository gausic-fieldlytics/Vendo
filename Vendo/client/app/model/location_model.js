(function () {
    'use strict';
    angular.module('app.table').constant('locationModel', {
        'add': {
           "locationname":"locationname",
"locationtypeid":"locationtypeid",
"status":"status"
        },
        'edit': {
            "id": "id",
           "locationname":"locationname",
"locationtypeid":"locationtypeid",
"status":"status"
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
            "locationtype":"locationtype"
        }
    });
})();
