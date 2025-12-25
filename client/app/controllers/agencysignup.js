(function () {
    'use strict';

    angular.module('app.table')
        .controller('AgencysignupCtrl', ['$q', '$scope', '$rootScope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'userbankdetModel', 'userlocpreferModel', 'usercompanyModel', 'userskillModel', 'userModel', 'userexpModel', 'userproofModel', 'commonModel', AgencysignupCtrl]);

    function AgencysignupCtrl($q, $scope, $rootScope, $http, $filter, $mdDialog, config, appConstants, service, materials, userbankdetModel, userlocpreferModel, usercompanyModel, userskillModel, userModel, userexpModel, userproofModel, commonModel) {

        var selectedId = 0;
        var original;
        var init;
        $scope.filePath = config.filPath;
        $scope.user = userModel.add;
        $scope.HeaderName = "User";
        $scope.contact = {};
        $scope.login = {};
        $scope.listuserskil = [];
        $scope.listuserproof = [];
        $scope.userbankdet = {};
        $scope.listuserprelocation = [];
        $scope.listuserexp = [];
        $scope.ddluserid;
        $scope.showotp = false;
        $scope.ispan = true;
        $scope.ddlterms = true;

        $scope.listerrormsg = {};
        $scope.listerrormsg.responsedata = 0
       // $scope.isapproved = sessionStorage.userstatusid == "3" ? false : true;
        $scope.newotp = null;
        $scope.listallarea = [];
        $scope.listconstitution =appConstants.LIST_CONSTITUTION;

        debugger;
        var stateid = 0, cityid = 0;
        $scope.rejectreason = [];
        $scope.rejectreasonidx = 0;
        $scope.selectedIndex = 0;

        $scope.hidepassword = "password";
        $scope.ispasswordview = true;

        $scope.changepasswordtype = function (status) {
            $scope.hidepassword = "text";
            $scope.ispasswordview = false;
        }
        $scope.changetypepassword = function (status) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
        }
        $scope.getselecteditemcount = function (row) {
            debugger;
            row.selectedtext = row.areaid != null ? row.areaid.length + " Area selected" : "";
        }
      
        $scope.isObject = function (input) {
            return (angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }
        $scope.isDefined = function (input) {
            return (!angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

        $scope.validategstno = (function () {
            debugger;
            var regexp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            return {
                test: function (value) {
                    debugger;
                    return value == "000000000000000" ? true : regexp.test(value);
                }
            };
        })();


        
        $scope.removeimg = function (_obj, sts) {
            debugger;
            var delobj = {
                "id": "id",
                "delstatus": "delstatus",
                "img": "img"
            };

            var confirm = materials.deleteConfirm(appConstants.img);
            $mdDialog.show(confirm).then(function () {
                var delObj = {
                    id: _obj.id,
                    delstatus: sts == "B" ? "BANK" : "PROOF",
                    img: sts == "B" ? _obj.image : _obj.image
                };
                var result = service.serverDelete(config.urlDeleteimg, delobj, "", delObj);
                result.then(function (resolve) {

                    materials.displayToast(appConstants.successClass, appConstants.img + ' ' + appConstants.deleteMsg);
                    if (sts == "P") {
                        getAllUserproof($scope.ddluserid);
                    }
                    else {
                        _obj.image = null;
                    }

                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        }

        $scope.FilePath = config.filepath;
        $scope.editUser = function () {
            debugger;

            $scope.selectedIndex = 0;
            $scope.contact = {};
            $scope.userlogin = {};
            $scope.listuserskil = [];
            $scope.listuserproof = [];
            $scope.userbankdet = {};
            $scope.listuserprelocation = [];
            $scope.listuserexp = [];
            $scope.ddluserid = sessionStorage.userid;
            getuserdetail(sessionStorage.userid);
            loadrejectreason(sessionStorage.userid);

        }
        //$scope.editUser();


        $scope.revert = function () {
            $scope.user = angular.copy(original);
            $scope.user = {};
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function () {
            return !angular.equals($scope.user, original) || !$scope.material_login_form.$pristine;

        };
        $scope.canSubmit = function () {

            return $scope.material_login_form.$valid && !angular.equals($scope.user, original);
        };
        $scope.submitForm = function () {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

        $scope.viewUser = function (rowData) {
            //$scope.show = 2;
            //$scope.user = angular.copy(rowData);
            //original = angular.copy($scope.user);
            $scope.selecteduserimg = undefined;
            $scope.tabProof = false;
            $scope.tabDocument = false;
            $scope.tabBank = false;
            $scope.showemployeedetail = true;
            $scope.show_PhotoIcon = true;
            $scope.showproof = false;
            $scope.showdocument = false;
            $scope.showLocationPreferred = false;
            $scope.showuserBankdetail = false;

            if ($scope.selecteduserimg == undefined)
                $scope.selecteduserimg = rowData.profileimages;
            //$scope.editimg = $scope.FilePath + rowData.profileimages
            $scope.userID = rowData.id;

            $scope.user = angular.copy(rowData);
            original = angular.copy($scope.user);
            $scope.user.joindate = new Date($scope.user.joindate);
            if ($scope.user.profileimages != null)
                $scope.user.profileimages = $scope.FilePath + $scope.user.profileimages;
            getAllPr_proof($scope.userID);
        }
        $scope.filepaths = config.filepath;

     

        $scope.resultData = [];
        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageresultData = $scope.filteredresultData.slice(start, end);
        };

        function onFilterChange() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        function onNumPerPageChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function onOrderChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function search() {
            $scope.filteredresultData = $filter('filter')($scope.resultData, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        function order(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredresultData = $filter('orderBy')($scope.resultData, rowName);
            return $scope.onOrderChange();
        };


        $scope.addUser = function () {

            debugger;
            $scope.user = {};
            $scope.userlogin = {};
           // $scope.userlogin.password = makeid(6);
            $scope.contact = {};
            $scope.user.userstatusid = 1;
            
           // $scope.user.usertypeid = $scope.gridview;
            $scope.user.joindate = new Date();
            $scope.user.genderid = 1;
            $scope.user.joindate = new Date();
        }
        $scope.addUser();

        $scope.resultData = [];
        $scope.searchKeywords = '';
        $scope.filteredresultData = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.numPerPageOpt = [50, 200, 500, 1000];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.currentPage = 1;
        $scope.currentPage = [];

       


        function getuserdetail(userid) {
            debugger
            var obj = {};
            obj.id = userid;
            obj.userid = userid;
            var result = service.serverPost(config.urlGetUserById, userModel.searchbyid, "", obj)
            result.then(function (resolve) {
                var oResult = resolve.ResponseData;
                $scope.user = angular.copy(oResult);
                original = angular.copy($scope.user);
                $scope.user.joindate = new Date($scope.user.joindate);

                $scope.contact = oResult.contact;
                $scope.userlogin = oResult.login;
                $scope.listuserskil = oResult.listskill;
                $scope.listuserproof = oResult.listproof;
                $scope.userbankdet = oResult.userbank;
                $scope.listuserprelocation = oResult.listprelocation;
                $scope.listuserexp = oResult.listworkexp;
                $scope.loadarea($scope.contact.stateid, $scope.contact.cityid);
                arrangedate($scope.listuserexp)
                arrangeproof($scope.listuserproof);
                $scope.show = 2;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.loadarea = function (stateid, cityid) {
            debugger
            var obj = {};
            obj.stateid = stateid;
            obj.cityid = cityid;
            var result = service.serverPost(config.urlGetArea, userModel.searchall_area, "", obj)
            result.then(function (resolve) {
                $scope.listallarea = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        function loadrejectreason(userid) {
            debugger;
            var obj = {};
            obj.userid = userid;
            $scope.rejectreasonidx = 0;
            $scope.selectedIndex = 0;
            var result = service.serverPost(config.urlgetrejectreason, userModel.get_reject, "", obj)
            result.then(function (resolve) {
                $scope.rejectreason = resolve.ResponseData;
                
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.sendotp = function () {
            debugger
            var _img = $scope.ispan == true ? $scope.panimage : $scope.licenseimage;

            var isvalidgestno = $scope.user.gstno == "000000000000000" ? true : ($scope.user.gstno != null ? true : false);

            if ($scope.aadharimage != null && _img != null && isvalidgestno) {
                var objimg = $scope.user;
                objimg.contactno = $scope.contact.mobileno;
                objimg.email = $scope.contact.email;
                objimg.username = $scope.userlogin.username;

                materials.showSpinner();
                objimg.createdat = new Date();
                var result = service.serverPost(config.url_saveregisteragency, userModel.register, "", objimg)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        $scope.user.registerid = resolve.ResponseData;
                        $scope.showotp = true;
                        materials.displayToast(appConstants.successClass, "" + ' ' + appConstants.otpMsg);
                    }
                    else {
                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
            }
            else {
                var _imgmsg = $scope.ispan == true ? appConstants.pan : "License Image";
                var _imgpath = $scope.ispan == true ? $scope.panimage : $scope.licenseimage;
                var _msg = $scope.aadharimage != null ? (_imgpath != null ? appConstants.gst : _imgmsg) : appConstants.aadhar;
                materials.displayToast(appConstants.warningClass, _msg + ' ' + appConstants.requiredMsg);
            }
        }

        
        $scope.uploadproof = function () {
            debugger;
            var listupdoc = [];
            if (angular.isObject($scope.aadharimage)) {
                listupdoc.push($scope.aadharimage);
            }
            if ($scope.ispan) {
                if (angular.isObject($scope.panimage)) {
                    listupdoc.push($scope.panimage);
                }
            }
            else {
                if (angular.isObject($scope.licenseimage)) {
                    listupdoc.push($scope.licenseimage);
                }
            }
            

            if (angular.isObject($scope.gstimage)) {
                listupdoc.push($scope.gstimage);
            }
            
            if (listupdoc.length > 0) {
                var postdata = '?' + config.urlFolderPath + '=' + config.urluserProof;
                materials.showSpinner();
                var result = service.filePost(config.urlSaveFile + postdata, listupdoc)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    debugger;
                    var docData = resolve.ResponseData.split(",");
                    var aadharimg = docData[0];
                    var panimag = docData[1];
                    var gstimag = docData[2] != undefined ? docData[2] : null;
                   
                    $scope.verifyotp(aadharimg, panimag, gstimag);

                }, function (reject) {
                    materials.hideSpinner();
                });
            }
            
        }

        $scope.verifyotp = function (aadharimg, panimag, gstimag) {
            debugger
            var objimg = $scope.user;
            objimg.contactno = $scope.contact.mobileno;
            objimg.email = $scope.contact.email;
            objimg.username = $scope.userlogin.username;
            objimg.otp = $scope.newotp;

            var con = [];
            var login = [];
            var listproof = [];
            var lstInputs = [];
            con.push($scope.contact);

            $scope.userlogin.islocked = $scope.userlogin.islocked == true || $scope.userlogin.islocked == 1 ? 1 : 0;
            $scope.userlogin.createdby = sessionStorage.userid;
            login.push($scope.userlogin);
            var aadharobj = {};
            var panobj = {};
            var gstobj = {};

            aadharobj.code= "AAD"; 
            aadharobj.proofno= $scope.aadharno;
            aadharobj.image = aadharimg;
            if ($scope.ispan) {
                panobj.code = "PAN";
                panobj.proofno = $scope.panno;
                panobj.image = panimag;
            } else {
                panobj.code = "DL";
                panobj.proofno = $scope.license;
                panobj.image = panimag;
            }
            
            
            

            listproof.push(aadharobj);
            listproof.push(panobj);
            if (gstimag != null) {
                gstobj.code = "GST";
                gstobj.proofno = $scope.user.gstno;
                gstobj.image = gstimag;
                listproof.push(gstobj);
            }

            

            var obj = {};
            obj.contact = con;
            obj.login = login;
            obj.proof = listproof;

            lstInputs.push(obj);
            objimg.lstInputs = lstInputs;
            materials.showSpinner();
                objimg.createdat = new Date();
                var result = service.serverPost(config.url_verifyagencyregister, userModel.add, "", objimg)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass,"Agency" + ' ' + appConstants.saveMsg);
                        var loginobj = {};
                        loginobj.username = $scope.userlogin.username;
                        loginobj.password = $scope.userlogin.password;

                        $rootScope.$emit("agencylogin", loginobj);
                    }
                    else {

                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }
                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });
        }


        function geterrormgs(ResponseData) {
            $scope.listerrormsg.responsedata = ResponseData;
            var msg = appConstants.agencyname;
            $scope.listerrormsg.msg = appConstants.agencyname + " " + appConstants.existMsg;
            switch (ResponseData) {
                case -2:
                    msg = appConstants.firstname;
                    $scope.listerrormsg.msg = appConstants.firstname + " " + appConstants.existMsg;
                    break;
                case -3:
                    msg = appConstants.mobile;
                    $scope.listerrormsg.msg = appConstants.mobile + " " + appConstants.existMsg;
                    break;
                case -4:
                    msg = appConstants.email;
                    $scope.listerrormsg.msg = appConstants.email + " " + appConstants.existMsg;
                    break;
                case -5:
                    msg = appConstants.username;
                    $scope.listerrormsg.msg = appConstants.username + " " + appConstants.existMsg;
                    break;
            }
            return msg;
        }

        $scope.saveUser = function () {

            var obj = this.user;
            if (obj.profileimages != undefined) {
                if (obj.profileimages.name != undefined && obj.profileimages.name != null) {
                    if (angular.isObject(obj.profileimages)) {
                        materials.showSpinner();
                        var result = service.filePost(config.urlSaveFile, obj.profileimages)
                        result.then(function (resolve) {
                            obj.profileimages = resolve.ResponseData[0].filename;
                            obj.sign = "";
                            $scope.saveuserwimg(obj);
                        }
                        , function (reject) {
                            alert("File Upload Error");
                        });
                    }
                }
                else {
                    obj.profileimages = $scope.selecteduserimg;
                    $scope.saveuserwimg(obj);
                }
            }
            else {
                obj.profileimages = "";
                $scope.saveuserwimg(obj);
            }

        }

        $scope.removeUserpic = function () {
            $scope.editUserPic = undefined;
            $scope.user.profileimages = undefined;
        }
        $scope.removeUsersign = function () {
            $scope.editUsersign = undefined;
            $scope.user.sign = undefined;
        }
        $scope.loadChilds = function (id, varId) {
            $scope.loadDropDown(id, varId);
        }

        $scope.loadDropDown = function (id, varId) {

            var ddlistModel = userModel.ddlist;

            for (var key in ddlistModel) {

                var obj = {};
                var valParam = {};
                var keyParam = null;

                valParam = ddlistModel[key].split('~');
                //Only for selection changed
                if (varId != '' && valParam[1] != varId) {
                    continue;
                }
                //End
                if (valParam.length > 1) {
                    debugger;
                    keyParam = valParam[0];
                    for (var keyname in valParam) {
                        if (keyname == 1) {
                            obj['u_' + valParam[keyname]] = id;
                        }
                        else {
                            obj['u_' + valParam[keyname]] = 0;
                        }
                    }

                    //keyParam = valParam[0];
                    //obj['u_' + valParam[1]] = id;
                }
                else {
                    keyParam = ddlistModel[key];
                }

                var result = service.serverDDGet(config.urlDDLoad.replace(config.replaceWord, keyParam), keyParam, obj);
                result.then(function (resolve) {
                    $scope['list' + resolve.input] = resolve.ResponseData;

                }, function (reject) {
                    alert('Not Resolved');
                });
            }
        }

        $scope.loadDropDown(0, '');

        init = function () {
            $scope.search();
            return $scope.select($scope.currentPage);
        };


       

        function getAllUserskill(userid) {
            debugger;
            var sk_obj = {};
            sk_obj.userid = userid;
            var result = service.serverPost(config.urlGetUserskill, userModel.searchall_skill, "", sk_obj)
            result.then(function (resolve) {
                $scope.listuserskil = resolve.ResponseData;
            }, function (reject) {
            });
        }

        function GetAlluserexp(userid) {
            var obj = {};
            obj.userid = $scope.userid;
            var result = service.serverPost(config.urlGetUserexp, userModel.searchall_skill, "", obj)
            result.then(function (resolve) {
                $scope.listuserexp = resolve.ResponseData;
                arrangedate($scope.listuserexp)
            }, function (reject) {
                console.log(reject.ResponseMessage);
            });
        }

        function arrangedate(listuserexp) {
            for (var i = 0; i < listuserexp.length; i++) {
                listuserexp[i].fromdate = new Date(listuserexp[i].fromdate);
                listuserexp[i].todate = new Date(listuserexp[i].todate);
            }
        }


        function getAllLoc(userid) {
            var loc_obj = {};
            loc_obj.userid = userid;
            var result = service.serverPost(config.urlGetUserlocpreferById, userModel.searchbyid, "", loc_obj)
            result.then(function (resolve) {
                $scope.listuserprelocation = resolve.ResponseData;
            }, function (reject) {
                console.log(reject.ResponseMessage);
            });
        }

        function getAllUserproof(userid) {
            var obj = {};
            obj.userid = userid;
            var result = service.serverPost(config.urlGetUserproof, userModel.searchbyid, "", obj)
            result.then(function (resolve) {
                $scope.listuserproof = resolve.ResponseData;
                arrangeproof($scope.listuserproof);
            }, function (reject) {
            });
        }


        function arrangeproof(listuserproof) {
            for (var i = 0; i < listuserproof.length; i++) {
                listuserproof[i].docfile = $scope.filePath + listuserproof[i].image;
            }
        }

        function getAllbank(userid) {
            var obj = {};
            obj.userid = userid;
            var result = service.serverPost(config.urlGetUserbankdet, userModel.searchbyid, "", obj)
            result.then(function (resolve) {
                $scope.userbankdet = resolve.ResponseData;
            }, function (reject) {
                console.log(reject.ResponseMessage);
            });
        }





        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.querySearch = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.selectedlistItemChange = selectedlistItemChange;
        $scope.searchTextChange = searchTextChange;

        function querySearch(query, column) {

            var key = 'list' + column;
            var results = query ? $scope[key].filter(createFilter(query, column + 'name')) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                $scope.retdata = results
                return results;
            }
        }

        function selectedItemChange(item, columns) {

            //columns = columns.split('~');
            //if (item == undefined) {
            //    item = $scope.retdata;
            //}

            //var column = columns[1];
            //if (item[0] != undefined)
            //    selectedId = item[0].id;
            //else
            //    selectedId = item.id;
            //eval('getAll' + column + '(' + selectedId + ')');
            stateid = $scope.selectedstateItem != undefined ? $scope.selectedstateItem.id : 0;
            cityid = $scope.selectedcityItem != undefined ? $scope.selectedcityItem.id : 0;

            getAllUser($scope.gridview, stateid, cityid);
        }

        function selectedlistItemChange(item, index, key, list) {
            debugger;
            if (item != undefined) {
                switch (key) {
                    case 1:
                        list[index].skillid = item.id;
                        break;
                    case 2:
                        list[index].facilityid = item.id;
                        break;
                        //case 3:
                        //    break;
                        //case 4:
                        //    break;
                        //case 5:
                        //    break;
                }
            }
            else {
                switch (key) {
                    case 1:
                        list[index].skillid = null;
                        break;
                    case 2:
                        list[index].facilityid = null;
                        break;
                        //case 3:
                        //    break;
                        //case 4:
                        //    break;
                        //case 5:
                        //    break;
                }
            }
        }

        function searchTextChange(item, index, key, list) {
            debugger;
            if (item != undefined) {
                switch (key) {
                    case 1:
                        list[index].amenityid = item.id;
                        break;
                    case 2:
                        list[index].facilityid = item.id;
                        break;
                        //case 3:
                        //    break;
                        //case 4:
                        //    break;
                        //case 5:
                        //    break;
                }
            }
            else {
                switch (key) {
                    case 1:
                        list[index].amenityid = null;
                        break;
                    case 2:
                        list[index].facilityid = null;
                        break;
                        //case 3:
                        //    break;
                        //case 4:
                        //    break;
                        //case 5:
                        //    break;
                }
            }
        }

        function createFilter(query, name) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj[name]).indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.addField = function (listinputs,islocation) {
            var obj = {};
            if (islocation) {
                obj.areaid = [];
            }
            listinputs.push(obj);
        }
        $scope.childParamdis = function (from) {
            return from.$valid;
        }

        $scope.removeField = function (listinputs) {
            listinputs.splice(listinputs.length - 1, 1);
        }

        $scope.removerow = function (listinputs,idx) {
            listinputs.splice(idx, 1);
        }

        $scope.canSubmit_childform = function (form) {
            return form.$valid;
        };

    }

  

})();