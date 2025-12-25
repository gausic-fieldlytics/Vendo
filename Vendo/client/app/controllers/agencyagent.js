(function () {
    'use strict';

    angular.module('app.table')
        .controller('AgencyagentCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'userbankdetModel', 'userlocpreferModel', 'usercompanyModel', 'userskillModel', 'userModel', 'userexpModel', 'userproofModel', 'commonModel', AgencyagentCtrl])
    .controller('proofimgCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', proofimgCtrl]);
    function AgencyagentCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, userbankdetModel, userlocpreferModel, usercompanyModel, userskillModel, userModel, userexpModel, userproofModel, commonModel) {

        var selectedId = 0;
        var original;
        var init;
        $scope.listbank = appConstants.LIST_BANK;
        $scope.listconstitution = appConstants.LIST_CONSTITUTION;
        $scope.access_permission = {};
        debugger;
        if (sessionStorage.usertypecode == appConstants.CODE_AGENCY) {
            $scope.access_permission.addshow = true;
            $scope.access_permission.editshow = true;
            $scope.access_permission.deleteshow = true;
        }
        else {
            $scope.access_permission = materials.getaccess(21);
        }
        

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
        $scope.selectedIndex = 0;
        $scope.listallarea = [];
        $scope.gridview = sessionStorage.usertypecode == appConstants.CODE_USER ? "2" : "6";
        debugger;
        $scope.isSuperAdmin = sessionStorage.usertypecode == appConstants.CODE_USER ? true : false;
        var stateid = 0, cityid = 0;
        $scope.isptxt = "Agency Detail";

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
        $scope.getselecteditemcount = function (row) {
            debugger;
            row.selectedtext = row.areaid != null ? row.areaid.length + " Area selected" : "";
        }
        $scope.deleteUser = function (obj) {
            debugger;
            var _confirmname = $scope.isSuperAdmin == true ? ($scope.gridview == 2 ? "Agency" : "ISP") : "AR";
            var confirm = materials.deleteConfirm(_confirmname);
            $mdDialog.show(confirm).then(function () {

                var delObj = {};

                if ($scope.isSuperAdmin) {
                    delObj = {
                        id: $scope.gridview == 2 ? 0 : obj.id,
                        agencyid: $scope.gridview == 2 ? obj.id: 0 
                    };
                }
                else {
                    delObj = {
                        id: obj.id,
                        agencyid: 0
                    };
                }
                var result = service.serverDelete(config.urlDeleteUser, userModel.delete, "", delObj);
                result.then(function (resolve) {

                    if (resolve.ResponseData > 0) {

                        var _confirmname = $scope.isSuperAdmin == true ? ($scope.gridview == 2 ? "Agency" : "ISP") : "AR";
                      //  materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.saveMsg);

                        materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.deleteMsg);
                        getAllUser($scope.gridview, stateid, cityid);
                    }
                    else {
                       // var _cons = resolve.ResponseData == -1 ? appConstants.payment : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, _confirmname).replace(/#REFNAME#/g, "Task");
                        materials.displayToast(appConstants.warningClass, msg);
                    }

                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

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
        $scope.editUser = function (rowData) {
            debugger;
            $scope.isptxt = $scope.gridview == 2 ? "Agency Detail" : "ISP Detail";
            $scope.selectedIndex = 0;
            $scope.contact = {};
            $scope.userlogin = {};
            $scope.listuserskil = [];
            $scope.listuserproof = [];
            $scope.userbankdet = {};
            $scope.listuserprelocation = [];
            $scope.listuserexp = [];
            $scope.ddluserid = rowData.id;
            getuserdetail(rowData.id);

        }


        $scope.isDefined = function (input) {
            return (!angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }

        $scope.isUnDefined = function (input) {
            return (!angular.isObject(input) && (angular.isUndefined(input) || input == null)) ? true : false;
        }
        $scope.isObject = function (input) {
            return (angular.isObject(input) && angular.isDefined(input) && input != null) ? true : false;
        }
        $scope.downloadimg = function (path) {
           // window.open(path);
            $scope.open('lg', path);
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

        $scope.cansubagentSubmit = function (form) {
            return form.$valid ;
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

        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        $scope.addUser = function () {

            debugger;
            $scope.isptxt = $scope.gridview == 2 ? "Agency Detail" : "ISP Detail";
            $scope.user = {};
            $scope.userlogin = {};
            $scope.userlogin.password = makeid(6);
            $scope.contact = {};
            $scope.user.userstatusid = 1;
            switch (parseInt($scope.gridview)) {
                case 2:
                   // $scope.user.roleid = 4;
                    break;
                case 3:
                   // $scope.user.roleid = 5;
                    break;
                case 6:
                    $scope.user.userstatusid = 3;
                    $scope.user.roleid = $scope.gridview;
                    break;
            }
            $scope.user.usertypeid = $scope.gridview;
            $scope.user.joindate = new Date();
          
            $scope.user.genderid = 1;


            $scope.listuserskil = [];
            $scope.listuserproof = [];
            $scope.userbankdet = {};
            $scope.listuserprelocation = [];
            $scope.listuserexp = [];
            $scope.user.joindate = new Date();
            $scope.selectedIndex = 0;
        }

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

        function getAllUser(gridview,stateid , cityid ) {
            debugger;
            var obj = {};
            obj.userid = sessionStorage.usertypecode == appConstants.CODE_USER ? 0 : sessionStorage.userid;
            obj.usertypeid = gridview;
            obj.stateid = stateid;
            obj.cityid = cityid;
          //  obj.regdate = gridview;
            var result = service.serverPost(config.urlGetagentangency, userModel.searchall, "", obj)
            result.then(function (resolve) {
                $scope.resultData = resolve.ResponseData;
                init();
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


        $scope.FilerGrid = function (gridview) {
            getAllUser(gridview, stateid, cityid);
        }
        getAllUser($scope.gridview, stateid, cityid);


        function getuserdetail(userid) {
            debugger
            var obj = {};
            obj.id = userid;
            obj.userid = userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetUserById, userModel.searchbyid, "", obj)
            result.then(function (resolve) {
                debugger;
                materials.hideSpinner();
                var oResult = resolve.ResponseData;
                $scope.user = angular.copy(oResult);
                original = angular.copy($scope.user);
                $scope.user.joindate = new Date($scope.user.joindate);
                $scope.user.dob = $scope.user.dob != null ? new Date($scope.user.dob) : null;
               
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
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.saveuserwimg = function (objimg) {
            debugger
            objimg.createdby = sessionStorage.userid;
            objimg.modifiedby = sessionStorage.userid;

            objimg.contactno=$scope.contact.mobileno;
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
                        var _confirmname = $scope.isSuperAdmin == true ? ($scope.gridview == 2 ? "Agency" : "ISP") : "AR";
                        materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.saveMsg);
                        $scope.userID = resolve.ResponseData;
                        $scope.addUser();
                        getAllUser($scope.gridview, stateid, cityid);
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
                        var _confirmname = $scope.isSuperAdmin == true ? ($scope.gridview == 2 ? "Agency" : "ISP") : "AR";
                        materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.updateMsg);
                        $scope.userID = resolve.ResponseData;
                        getAllUser($scope.gridview, stateid, cityid);
                        $scope.addUser();
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
            var msg = appConstants.agencyname;
            switch (ResponseData) {
                case -2:
                    msg = appConstants.firstname;
                    break;
                case -3:
                    msg = appConstants.mobile;
                    break;
                case -4:
                    msg = appConstants.email;
                    break;
                case -5:
                    msg = appConstants.username;
                    break;
            }
            return msg;
        }

        $scope.saveUser = function () {
            var obj = $scope.user;
            if (obj.profileimages != undefined) {
                if (obj.profileimages.name != undefined && obj.profileimages.name != null) {
                    if (angular.isObject(obj.profileimages)) {
                        var result = service.filePost(config.urlSaveFile, obj.profileimages)
                        result.then(function (resolve) {
                            obj.profileimages = resolve.ResponseData[0].filename;
                            obj.sign = "";
                            $scope.saveuserwimg(obj);
                        }, function (reject) {
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
                lstinputs.push(newinput);
            }


            docobj.listinputs = lstinputs;
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

        $scope.saveLoction = function () {

            debugger;
            var loc_obj = {};
            var lstinputs = [];
            loc_obj.userid = $scope.ddluserid;
            loc_obj.cityid = 0;
            //for (var i = 0; i < $scope.listuserprelocation.length; i++) {
            //    var newinput = {};
            //    newinput.userid = $scope.ddluserid;
            //    newinput.cityid = $scope.listuserprelocation[i].cityid;
            //    newinput.areaid = $scope.listuserprelocation[i].areaid;
            //    lstinputs.push(newinput);
            //}
            for (var i = 0; i < $scope.listuserprelocation.length; i++) {

                var newinput = {};
                newinput.userid = $scope.ddluserid;
                newinput.cityid = $scope.listuserprelocation[i].cityid;
                var lstareaid = $scope.listuserprelocation[i].areaid;
                for (var j = 0; j < lstareaid.length; j++) {
                    newinput.areaid = lstareaid[j];
                    lstinputs.push(angular.copy(newinput));
                }
            }

            loc_obj.listinputs = lstinputs;
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
                    $scope.Save_Bank(_obj);
                }
            }
            else {
                materials.displayToast(appConstants.warningClass, appConstants.bankname + ' ' + appConstants.invalidMsg);
            }
            
        };

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

        $scope.addField = function (listinputs) {
            var obj = {};
            listinputs.push(obj);
        }
        $scope.childParamdis = function (from) {
            return from.$valid;
        }
        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }
        $scope.removeField = function (listinputs) {
            debugger;
            listinputs.splice(listinputs.length - 1, 1);
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


