(function () {
    'use strict';
    angular.module('app.table').constant('ppmsuserModel', {
        'add': {
            "id": "id",
            "firstname": "firstname",
            "lastname": "lastname",
            "genderid": "genderid",
            "contactno": "contactno",
            "email": "email",
            "roleid": "roleid",
            "clientid": "clientid",
            "usertypeid": "usertypeid",
           // "division": "division",
          //  "branch": "branch",
            "createdat": "createdat",
            "createdby": "createdby",
          //  "modifiedat": "modifiedat",
           // "modifiedby": "modifiedby",
            "status": "status",
            //"username": "username",
            "username": "username",
            "companyname": "companyname",
            "lstInputs": [{
                "contact": [{
                    "photo": "photo",
                    "email": "email",
                    "mobileno": "mobileno",
                    "contacttypeid": "contacttypeid",
                    "telephoneno": "telephoneno",
                    "address": "address",
                    "zipcode": "zipcode",
                    "cityid": "cityid",
                    "stateid": "stateid",
                    "areaid": "areaid",
                    "contactperson": "contactperson",
                    "contactpersonmobile": "contactpersonmobile",
                    "countryid": "countryid",
                    "nationalityid": "nationalityid",
                    "comments": "comments"

                }],
                "login": [{
                    "username": "username",
                    "password": "password",
                    "islocked": "islocked",
                    "createdby": "createdby"
                }]
            }]
        },
        'edit': {
            "id": "id",
            "firstname": "firstname",
            "lastname": "lastname",
            "genderid": "genderid",
            "contactno": "contactno",
            "email": "email",
            "roleid": "roleid",
            "clientid": "clientid",
            "usertypeid": "usertypeid",
            "division": "division",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "modifiedby": "modifiedby",
            "branch": "branch",
            "status": "status",
            "username": "username",
            "companyname": "companyname",
           // "username": "username",
           // "password": "password",
          //  "islocked": "islocked",
            "lstInputs": [{
                "contact": [{
                    "photo": "photo",
                    "email": "email",
                    "mobileno": "mobileno",
                    "contacttypeid": "contacttypeid",
                    "telephoneno": "telephoneno",
                    "address": "address",
                    "zipcode": "zipcode",
                    "cityid": "cityid",
                    "stateid": "stateid",
                    "areaid": "areaid",
                    "contactperson": "contactperson",
                    "contactpersonmobile": "contactpersonmobile",
                    "countryid":"countryid",
                    "nationalityid": "nationalityid",
                    "comments":"comments"
                   
                }],
                "login": [{
                    "username": "username",
                    "password": "password",
                    "islocked": "islocked",
                    "createdby":"createdby"
                }]
            }]
        },
        'delete': {
            "id": "id"
        },
        'searchbyid': {
            "id": "id",
            "userid":"userid"
        },
        'searchall': {
        },
       
        'ddlist': {
            "contacttype": "contacttype",
           // "gender": "gender",
            "role": "role",
            "client": "client",
            //"usertype": "usertype"
        }
    });
})();
