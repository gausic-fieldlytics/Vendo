(function () {
    'use strict';

    angular.module('app.table').controller('profileCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'userbankdetModel', 'userlocpreferModel', 'usercompanyModel', 'userskillModel', 'userModel', 'userexpModel', 'userproofModel', 'commonModel', profileCtrl])
     .controller('proofimgCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', proofimgCtrl]);

    function profileCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, userbankdetModel, userlocpreferModel, usercompanyModel, userskillModel, userModel, userexpModel, userproofModel, commonModel) {

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

        $scope.listbank = appConstants.LIST_BANK;
        $scope.listconstitution = appConstants.LIST_CONSTITUTION;

        $scope.isapproved = sessionStorage.userstatusid == "3" ? false : true;

        $scope.listallarea = [];

        debugger;
        var stateid = 0, cityid = 0;
        $scope.rejectreason = [];
        $scope.rejectreasonidx = 0;
        $scope.selectedIndex = 0;

        $scope.hidepassword = "password";
        $scope.ispasswordview = true;
        $scope.listerrormsg = {};
        $scope.listerrormsg.responsedata = 0


        $scope.changepasswordtype = function (status) {
            $scope.hidepassword = "text";
            $scope.ispasswordview = false;
        }
        $scope.changetypepassword = function (status) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
        }
        $scope.chagetodate = function (userexp) {
            debugger;
            var _maxdate = new Date(userexp.fromdate);
            userexp.fromdate_max = new Date(_maxdate.setDate(_maxdate.getDate() + 1));
        }

        $scope.getproofpattern = function (prooftype) {
            debugger;
            var _prooftype = $.grep($scope.listprooftype, function (obj) {
                return obj.id == prooftype.prooftypeid;
            })[0];
            if (_prooftype != undefined) {
                prooftype.pattern = _prooftype.pattern;
            }
        }
        $scope.selectallarea = function (row,isselect) {
            debugger;
            row.areaid = [];
            if (isselect) {
                for (var i = 0; i < $scope.listarea.length; i++) {
                    if ($scope.listarea[i].cityid == row.cityid) {
                        row.areaid.push($scope.listarea[i].id);
                    }
                }
            }
           
            row.selectedtext = row.areaid != null ? row.areaid.length + " Area selected" : "";
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
        $scope.editUser();


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
                //for (var i = 0; i < resolve.ResponseData.length; i++) {
                //    switch (resolve.ResponseData[i].code) {
                //        case "DE":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx = 0;
                //            $scope.selectedIndex = 0;
                //            break;
                //        case "SKILL":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx =1;
                //            $scope.selectedIndex = 1;
                //            break;
                //        case "WORK":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx = 2;
                //            $scope.selectedIndex = 2;
                //            break;
                //        case "LOC":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx = 3;
                //            $scope.selectedIndex = 3;
                //            break;
                //        case "PROOF":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx = 4;
                //            $scope.selectedIndex = 4;
                //            break;
                //        case "BANK":
                //            $scope.rejectreason = resolve.ResponseData[i].remarks;
                //            $scope.rejectreasonidx = 5;
                //            $scope.selectedIndex = 5;
                //            break;
                //    }
                //}
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.saveuserwimg = function (objimg) {
            debugger
            objimg.createdby = sessionStorage.userid;
            objimg.modifiedby = sessionStorage.userid;

            objimg.contactno = $scope.contact.mobileno;
            objimg.email = $scope.contact.email;
            objimg.username = $scope.userlogin.username;

            var con = [];
            var login = [];
            var lstInputs = [];
            con.push($scope.contact);

            $scope.userlogin.islocked = $scope.userlogin.islocked == true || $scope.userlogin.islocked == 1 ? 1 : 0;
            $scope.userlogin.createdby = sessionStorage.userid;
            login.push($scope.userlogin)

            var obj = {};
            obj.contact = con;
            obj.login = login;
            lstInputs.push(obj);

            objimg.lstInputs = lstInputs;
            materials.showSpinner();
            if (objimg.id == null) {
                objimg.createdat = new Date();
                var result = service.serverPost(config.urlSaveUser, userModel.add, "", objimg)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.hideSpinner();
                        materials.displayToast(appConstants.successClass, appConstants.agency + ' ' + appConstants.saveMsg);
                        $scope.editUser();
                    }
                    else {
                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
            else {
                objimg.modifiedat = new Date();
                var result = service.serverPost(config.urlUpdateUser, userModel.edit, "", objimg)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.hideSpinner();
                        materials.displayToast(appConstants.successClass, appConstants.agency + ' ' + appConstants.updateMsg);
                        // $scope.userID = resolve.ResponseData;
                        $scope.editUser();
                    }
                    else {
                        materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    }

                    

                }, function (reject) {
                    alert('Not Resolved')
                });
            }
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

        //function geterrormgs(ResponseData) {
        //    var msg = appConstants.agencyname;
        //    switch (ResponseData) {
        //        case -2:
        //            msg = appConstants.firstname;
        //            break;
        //        case -3:
        //            msg = appConstants.mobile;
        //            break;
        //        case -4:
        //            msg = appConstants.email;
        //            break;
        //        case -5:
        //            msg = appConstants.username;
        //            break;
        //    }
        //    return msg;
        //}
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

        $scope.downloadimg = function (path) {
            debugger;
            //path = $scope.filepaths + path;

            $scope.open('lg', path);

         //   window.open(path);
        }
        $scope.open = function (size, img) {
            debugger;
            var obj = {};
            obj.img = img;
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'proofimg.html',
                controller: 'proofimgCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (ex) {
                debugger;
            });
        };

        $scope.save_Us_Skill = function (lstinputs) {
            debugger;

            var skill_obj = {};
            var listinputs = [];

            skill_obj.userid = $scope.ddluserid;

            for (var i = 0; i < lstinputs.length; i++) {
                var newinput = {};
                newinput.skillid = lstinputs[i].skillid;
                newinput.userid = $scope.ddluserid;
                newinput.experience = lstinputs[i].experience;
                newinput.remarks = lstinputs[i].remarks;
                newinput.isverified = lstinputs[i].isverified == true || lstinputs[i].isverified == 1 ? 1 : 0;
                listinputs.push(newinput);
            }
            skill_obj.listinputs = listinputs;
            //  skill_obj.userid = $scope.userID;
            //  skill_obj.status = 1;
            materials.showSpinner();
            var result = service.serverPost(config.urlSaveUserskill, userModel.skill_add, "", skill_obj)
            result.then(function (resolve) {
                materials.hideSpinner();

                materials.displayToast(appConstants.successClass, appConstants.skill + ' ' + appConstants.saveMsg);
                getAllUserskill($scope.ddluserid);

            }, function (reject) {
                materials.hideSpinner();
            });
        }

        $scope.saveworkexp = function () {
            debugger;


            var docobj = {};
            var lstinputs = [];
            docobj.userid = $scope.ddluserid;
            for (var i = 0; i < $scope.listuserexp.length; i++) {
                var newinput = {};
                newinput.userid = $scope.ddluserid;
                newinput.companyname = $scope.listuserexp[i].companyname;
                newinput.address = $scope.listuserexp[i].address != null ? $scope.listuserexp[i].address : null;
                newinput.cityid = $scope.listuserexp[i].cityid;
                newinput.fromdate = new Date($scope.listuserexp[i].fromdate);
                newinput.todate = new Date($scope.listuserexp[i].todate);
                newinput.isverified = 1;
                newinput.remarks = $scope.listuserexp[i].remarks != null ? $scope.listuserexp[i].remarks : null;
                newinput.verifiedby = sessionStorage.userid;
                newinput.expproof = null;
                if ($scope.listuserexp[i].cityid != null) {
                    lstinputs.push(newinput);
                }
                
            }


            docobj.listinputs = lstinputs;
            
            if (lstinputs.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.urlSaveUserexp, userModel.exp_add, "", docobj)
                result.then(function (resolve) {

                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.userexp + ' ' + appConstants.saveMsg);
                    GetAlluserexp($scope.ddluserid);

                }, function (reject) {
                    materials.hideSpinner();
                });
            }
            
        }

        $scope.saveLoction = function () {

            debugger;
            var loc_obj = {};
            var lstinputs = [];
            loc_obj.userid = $scope.ddluserid;
            loc_obj.cityid = 0;

            for (var i = 0; i < $scope.listuserprelocation.length; i++) {

                var newinput = {};
                newinput.userid = $scope.ddluserid;
                newinput.cityid = $scope.listuserprelocation[i].cityid;

                var lstareaid = $scope.listuserprelocation[i].areaid;
                if (newinput.cityid != null) {
                    for (var j = 0; j < lstareaid.length; j++) {
                        newinput.areaid = lstareaid[j];
                        lstinputs.push(angular.copy(newinput));
                    }
                }
              //  newinput.areaid = $scope.listuserprelocation[i].areaid;
            }


            loc_obj.listinputs = lstinputs;
            if (lstinputs.length > 0) {
                materials.showSpinner();
                var result = service.serverPost(config.urlSaveUserlocprefer, userModel.loc_add, "", loc_obj)
                result.then(function (resolve) {

                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.userloc + ' ' + appConstants.saveMsg);
                    getAllLoc($scope.ddluserid);

                }, function (reject) {
                    materials.hideSpinner();
                    console.log(reject.ResponseMessage);
                });
            }
            
        }

        $scope.uploadproof = function () {
            debugger;
            var listupdoc = [];
            var imgcount = 0;
            for (var j = 0; j < $scope.listuserproof.length; j++) {
                if ($scope.listuserproof[j].docfile != undefined && $scope.listuserproof[j].docfile != "") {
                    if (angular.isObject($scope.listuserproof[j].docfile)) {
                        listupdoc.push($scope.listuserproof[j].docfile);
                        $scope.listuserproof[j].image = "#####" + imgcount;
                        imgcount = imgcount + 1;
                    }
                    else {
                        var path = $scope.listuserproof[j].docfile.replace(config.filPath, "");
                        $scope.listuserproof[j].image = path;
                    }
                }

            }
            if (listupdoc.length > 0) {
                var postdata = '?' + config.urlFolderPath + '=' + config.urluserProof;
                materials.showSpinner();
                var result = service.filePost(config.urlSaveFile + postdata, listupdoc)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    debugger;
                    var docData = resolve.ResponseData.split(",");
                    for (var i = 0; i < docData.length; i++) {
                        var _imagname = ("#####" + i);
                        for (var j = 0; j < $scope.listuserproof.length; j++) {
                            if ($scope.listuserproof[j].image == _imagname) {
                                $scope.listuserproof[j].image = docData[i];
                            }
                        }

                    }
                    $scope.saveuserproof();

                }, function (reject) {
                    materials.hideSpinner();
                });
            }
            else {
                $scope.saveuserproof();
            }
        }

        $scope.saveuserproof = function () {
            debugger;
            var listinputs = [];
            var obj = {};
            obj.userid = $scope.ddluserid;
            obj.listinputs = [];
            for (var i = 0; i < $scope.listuserproof.length; i++) {
                var newparam = {};
                newparam.userid = $scope.ddluserid;
                newparam.prooftypeid = $scope.listuserproof[i].prooftypeid;
                newparam.image = $scope.listuserproof[i].image;
                newparam.proofno = $scope.listuserproof[i].proofno != null ? $scope.listuserproof[i].proofno : null;
                listinputs.push(newparam);
            }

            obj.listinputs = listinputs;
            var result = service.serverPost(config.urlsaveuserproofbyweb, userModel.proof_add, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.displayToast(appConstants.successClass, appConstants.userproof + ' ' + appConstants.saveMsg);

                getAllUserproof($scope.ddluserid);

            }, function (reject) {
                alert('Not Resolved')
            });

        }
        $scope.upload_bankproof = function (userBank) {
            debugger;
            var _obj = userBank;
            debugger;
            if ($scope.listbank.indexOf(_obj.bankname) != -1) {
                if (angular.isObject(_obj.image)) {
                    var postdata = '?' + config.urlFolderPath + '=' + config.urlProfileImage;
                    materials.showSpinner();
                    var result = service.filePost(config.urlSaveFile + postdata, _obj.image)
                    result.then(function (resolve) {
                        materials.hideSpinner();
                        _obj.image = resolve.ResponseData;
                        $scope.Save_Bank(_obj);
                    }, function (reject) {
                        materials.hideSpinner();
                    });
                }
                else {
                    if (_obj.image != null && _obj.image != "") {
                        $scope.Save_Bank(_obj);
                    }
                    else {
                        materials.displayToast(appConstants.warningClass, appConstants.passbook + ' ' + appConstants.requiredMsg);
                    }
                }
            }
            else {
                materials.displayToast(appConstants.warningClass, appConstants.bankname + ' ' + appConstants.invalidMsg);
            }
        }

        $scope.Save_Bank = function (userBank) {
            debugger;
            materials.showSpinner();
            var Bankobj = userBank;
            Bankobj.userid = $scope.ddluserid;
            Bankobj.status = 1;
            if (Bankobj.id == null) {
                var result = service.serverPost(config.urlSaveUserbankdet, userbankdetModel.add, "", Bankobj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    if (resolve.ResponseData > 0) {
                        materials.displayToast(appConstants.successClass, appConstants.userbankdet + ' ' + appConstants.saveMsg);
                        var usrproof = resolve.ResponseData;
                        getAllbank($scope.ddluserid);
                    }

                }, function (reject) {
                    materials.hideSpinner();
                    console.log(reject.ResponseMessage);
                });
            }
            else {
                var result = service.serverPost(config.urlUpdateUserbankdet, userbankdetModel.edit, "", Bankobj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.userbankdet + ' ' + appConstants.saveMsg);
                    var usrproof = resolve.ResponseData;
                    getAllbank($scope.ddluserid);

                }, function (reject) {
                    materials.hideSpinner();
                    console.log(reject.ResponseMessage);
                });
            }

        }



       


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
            $scope.listuserexp = [];
            var obj = {};
            obj.userid = userid;
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
            $scope.listuserprelocation = [];
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
        $scope.searchBank = searchBank;

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

        function searchBank(query, column) {
            debugger;
            var key = 'list' + column;
            var results = query ? $scope[key].filter(createbankFilter(query)) : $scope[key], deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                $scope.retdata = results
                return results;
            }
        }

        function createbankFilter(query) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(obj) {
                return (angular.lowercase(obj).indexOf(lowercaseQuery) === 0);
            };
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

           // getAllUser($scope.gridview, stateid, cityid);
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
                    case 3:
                        list[index].cityid = item.id;
                        break;
                    case 4:
                        list[index].cityid = item.id;
                        list[index].areaid = [];
                        list[index].selectedtext = "0 Area selected";
                        list[index].islocall = false;
                        list[index].listarea = $filter('filter')($scope.listarea, { cityid: item.id }, true);
                        break;
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
                    case 3:
                        list[index].cityid = null;
                        break;
                    case 4:
                        list[index].cityid = null;
                        list[index].areaid = [];
                        list[index].selectedtext = "0 Area selected";
                        list[index].islocall = false;
                        list[index].listarea = [];
                        break;
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
                    case 3:
                        list[index].cityid = item.id;
                        break;
                    case 4:
                        list[index].cityid = item.id;
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
                    case 3:
                        list[index].cityid = null;
                        break;
                    case 4:
                        list[index].cityid = null;
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
                obj.listarea = [];
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

    function proofimgCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        debugger;

        $scope.upimag = items.img;

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }
})();