(function () {
    'use strict';
    angular.module('app.table').constant('userModel', {
        'add': {
            "id": "id",
            "firstname": "firstname",
            "companyname": "companyname",
            "lastname": "lastname",
            "contactid": "contactid",
            "genderid": "genderid",
            "roleid": "roleid",
            "usertypeid": "usertypeid",
            "departmentid": "departmentid",
            "profileimages": "profileimages",
            "email": "email",
            "contactno": "contactno",
            "joindate": "joindate",
            "userstatusid": "userstatusid",
            "remarks": "remarks",
            "parentuserid": "parentuserid",
            "registerid": "registerid",
            "experience": "experience",
            "invoicefrequeny": "invoicefrequeny",
            "userrating": "userrating",
            "maxnooftask": "maxnooftask",
            "digitalsign": "digitalsign",
            "createdat": "createdat",
            "createdby": "createdby",
            "modifiedat": "modifiedat",
            "gstno": "gstno",
            "username": "username",
            "dob": "dob",
            "otp":"otp",
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
                    "comments": "comments",
                    "constitutionid": "constitutionid",

                }],
                "login": [{
                    "username": "username",
                    "password": "password",
                    "islocked": "islocked",
                    "createdby": "createdby"
                }],
                "proof": [{
                    "code": "code",
                    "proofno": "proofno",
                    "image": "image"
                }]
            }]
        },
        'edit': {
            "id": "id",
            "firstname": "firstname",
            "lastname": "lastname",
            "contactid": "contactid",
            "genderid": "genderid",
            "roleid": "roleid",
            "usertypeid": "usertypeid",
            "departmentid": "departmentid",
            "profileimages": "profileimages",
            "email": "email",
            "contactno": "contactno",
            "joindate": "joindate",
            "userstatusid": "userstatusid",
            "remarks": "remarks",
            "parentuserid": "parentuserid",
            "registerid": "registerid",
            "experience": "experience",
            "invoicefrequeny": "invoicefrequeny",
            "userrating": "userrating",
            "maxnooftask": "maxnooftask",
            "digitalsign": "digitalsign",
            "gstno": "gstno",
            "companyname": "companyname",
            "dob": "dob",
            "username": "username",
          //  "createdby": "createdby",
          //  "modifiedat": "modifiedat",
            // "status": "status"
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
                    "comments": "comments",
                    "constitutionid": "constitutionid",
                   
                }],
                "login": [{
                    "username": "username",
                    "password": "password",
                    "islocked": "islocked",
                    "createdby":"createdby"
                }]
            }]
        },

        'register': {
            "id": "id",
            "firstname": "firstname",
            "companyname": "companyname",
            "lastname": "lastname",
           // "contactid": "contactid",
            "genderid": "genderid",
            //"roleid": "roleid",
            "usertypeid": "usertypeid",
           // "departmentid": "departmentid",
          //  "profileimages": "profileimages",
            "email": "email",
            "contactno": "contactno",
            //"joindate": "joindate",
           // "userstatusid": "userstatusid",
           // "remarks": "remarks",
            //"parentuserid": "parentuserid",
            //"registerid": "registerid",
           // "experience": "experience",
            //"invoicefrequeny": "invoicefrequeny",
           // "userrating": "userrating",
            //"maxnooftask": "maxnooftask",
            //"digitalsign": "digitalsign",
            //"createdat": "createdat",
            //"createdby": "createdby",
            //"modifiedat": "modifiedat",
            //"gstno": "gstno",
            "username": "username",
            //"dob": "dob",
           
        },

        'addphoto': {
            "id": "id",
            "userphoto": "userphoto"
        },
        'delete': {
            "id": "id",
            "agencyid":"agencyid"
        },
        'accept': {
            "userid": "userid",
            "flag": "flag",
            "upflag":"upflag"
        },
        'reject': {
            "userid": "userid",
            "code":"code",
            "remarks": "remarks"
        },
        'list_reject': {
            "userid": "userid",
            "listinputs": [{
                "userid": "userid",
                "code": "code",
                "remarks": "remarks"
            }]
        },
        'get_reject': {
            "userid": "userid",
        },
        'searchbyid': {
            "id": "id",
            "userid":"userid"
        },
        'searchbyagencyNagentid': {
            "agencyid": "agencyid"
        },
        'searchall': {
            "userid": "userid",
            "usertypeid": "usertypeid",
            "stateid":"stateid",
            "cityid":"cityid", 
        },
        'searchall_skill': {
            "userid": "userid"
        },

        'searchall_area': {
            "stateid": "stateid",
            "cityid": "cityid"
        },
        'ddlist': {
            "state": "state~countryid",
            "city": "city~stateid",
            
            "area": "area~cityid~stateid",
            "gender": "gender",
            "role": "role",
           
            "usertypeDD": "usertypeDD",
            "department": "department",
            "userstatus": "userstatus",
           
            "contacttype":"contacttype",
            "prooftype": "prooftype",
            "skill": "skill",
            "nationality": "nationality",
             "country": "country"
        },
        'skill_add': {
            "userid": "userid",
            "listinputs": [{
                "skillid": "skillid",
                "userid": "userid",
                "experience": "experience",
                "remarks": "remarks",
                "isverified": "isverified",
                "skillname":"skillname"
            }]

        },
        'proof_add': {
            "userid": "userid",
            "listinputs": [{
                "prooftypeid": "prooftypeid",
                "userid": "userid",
                "proofno": "proofno",
                "image": "image"
            }]

        },
        'loc_add': {
            "userid": "userid",
            "cityid":"cityid",
            "listinputs": [{
                "userid": "userid",
                "cityid": "cityid",
                "areaid": "areaid",
                "pincode": "pincode",
               // "isverified":"isverified"
            }]

        },
        'exp_add': {
            "userid": "userid",
            "listinputs": [{
                "userid": "userid",
                "companyname": "companyname",
                "address": "address",
                "cityid": "cityid",
                "fromdate": "fromdate",
                "todate": "todate",
                "isverified":"isverified",
                "remarks":"remarks",
                "verifiedby":"verifiedby",
                "expproof": "expproof",
            }]

        }
    });
})();
