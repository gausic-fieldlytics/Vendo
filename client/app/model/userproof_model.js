(function () {
    'use strict';
    angular.module('app.table').constant('userproofModel', {
        'add': {
           "userid":"userid",
"prooftypeid":"prooftypeid",
"proofno":"proofno",
"image":"image",
"status":"status"
        },
        'edit': {
            "id": "id",
           "userid":"userid",
"prooftypeid":"prooftypeid",
"proofno":"proofno",
"image":"image",
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
            "user":"user",
"prooftype":"prooftype"
        }
    });
})();
