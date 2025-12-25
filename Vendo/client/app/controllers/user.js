(function () {
    'use strict';

    angular.module('app.table')
        .controller('UserCtrl', ['$q', '$scope', '$http', '$filter', '$uibModal', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'userbankdetModel', 'userlocpreferModel', 'usercompanyModel', 'userskillModel', 'userModel', 'userexpModel', 'userproofModel', 'commonModel', UserCtrl])
    .controller('proofimgCtrl', ['$q', '$rootScope', '$scope', '$uibModalInstance', '$filter', 'items', 'config', 'appConstants', 'service', 'materials', 'commonModel', proofimgCtrl]);
    function UserCtrl($q, $scope, $http, $filter, $uibModal, $mdDialog, config, appConstants, service, materials, userbankdetModel, userlocpreferModel, usercompanyModel, userskillModel, userModel, userexpModel, userproofModel, commonModel) {
        var selectedId = 0;
        var original;
        var init;
        $scope.listbank = appConstants.LIST_BANK;
        $scope.access_permission = {};
        $scope.access_permission = materials.getaccess(19);

        $scope.isSuperAdmin = sessionStorage.usertypecode == appConstants.CODE_USER ? true : false;
        $scope.listconstitution = appConstants.LIST_CONSTITUTION;

        $scope.filePath = config.filPath;
        $scope.user = userModel.add;
        $scope.HeaderName = "User";
        $scope.contact = {};
        $scope.userlogin = {};
        $scope.listuserskil = [];
        $scope.listuserproof = [];
        $scope.userbankdet = {};
        $scope.listuserprelocation = [];
        $scope.listuserexp = [];
        $scope.ddluserid;
        $scope.selectedIndex = 0;
        $scope.rejectreason = {};
        $scope.hidepassword = "password";
        $scope.ispasswordview = true;
        $scope.gridview = "2";
        $scope.selecttxt = "";
        $scope.isptxt = "Agency Detail";
        $scope.listallarea = [];

        $scope.removerow = function (listinputs, idx) {
            listinputs.splice(idx, 1);
        }


        $scope.changepasswordtype = function (status) {
            $scope.hidepassword = "text";
            $scope.ispasswordview = false;
        }
        $scope.changetypepassword = function (status) {
            $scope.hidepassword = "password";
            $scope.ispasswordview = true;
        }
        $scope.chagetodate = function (userexp) {
            
            var _maxdate = new Date(userexp.fromdate);
            userexp.fromdate_max = new Date(_maxdate.setDate(_maxdate.getDate() + 1));
        }

        $scope.getselecteditemcount = function (row) {
            debugger;
            row.selectedtext = "";
            //if (row.areaid != null) {
            //    newItems = $filter('filter')(items, function (obj) {
            //        return (obj.invoicestatuscode == 'CL')
            //    });
            //}
            row.selectedtext = row.areaid != null ? row.areaid.length + " Area selected" : "";
        }
        $scope.deleteUser = function (obj) {
            
            var _name = $scope.gridview == 2 ? appConstants.agency : appConstants.user;
            var confirm = materials.deleteConfirm(_name);
            $mdDialog.show(confirm).then(function () {
                var delObj = {};

                if ($scope.isSuperAdmin) {
                    delObj = {
                        id: $scope.gridview == 2 ? 0 : obj.id,
                        agencyid: $scope.gridview == 2 ? obj.id : 0
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

                        var msg = $scope.gridview == 2 ? appConstants.agency : appConstants.user;

                        materials.displayToast(appConstants.successClass, msg + ' ' + appConstants.deleteMsg);
                        getAllUser($scope.gridview);
                    }
                    else {
                        // var _cons = resolve.ResponseData == -1 ? appConstants.payment : "";
                        var msg = appConstants.waringMsg.replace(/#NAME#/g, _confirmname).replace(/#REFNAME#/g, "Task");
                        materials.displayToast(appConstants.warningClass, msg);
                    }
                    //if (resolve.ResponseStatus == "OK") {
                    //    materials.displayToast(appConstants.successClass, appConstants.user + ' ' + appConstants.deleteMsg);
                    //    getAllUser(selectedId);
                    //}
                    //else {
                    //    materials.displayToast(appConstants.warningClass, appConstants.apiError);
                    //}
                }, function (reject) {
                    alert('Not Resolved')
                });
            });
        };

        $scope.removeimg = function (_obj,sts) {
            
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

      

        function loadrejectreason(userid) {
            debugger;
            var obj = {};
            obj.userid = userid;
            var result = service.serverPost(config.urlgetrejectreason, userModel.get_reject, "", obj)
            result.then(function (resolve) {
                for (var i = 0; i < resolve.ResponseData.length; i++) {
                    switch (resolve.ResponseData[i].code) {
                        case "DE":
                            $scope.rejectreason.userdetail = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.det_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                        case "SKILL":
                            $scope.rejectreason.skillreason = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.skill_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                        case "WORK":
                            $scope.rejectreason.workreason = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.work_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                        case "LOC":
                            $scope.rejectreason.locationreason = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.loc_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                        case "PROOF":
                            $scope.rejectreason.proofreason = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.proof_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                        case "BANK":
                            $scope.rejectreason.bankdetails = resolve.ResponseData[i].remarks;
                            $scope.rejectreason.bank_isreupload = resolve.ResponseData[i].isreupload;
                            break;
                    }
                }
            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.FilePath = config.filepath;

        $scope.editUser = function (rowData) {
            
            $scope.isptxt = $scope.gridview == 2 ? "Agency Detail" : "ISP Detail";
            $scope.selectedIndex = 0;
            $scope.listuserskil = [];
            $scope.listuserproof = [];
            $scope.userbankdet = {};
            $scope.listuserprelocation = [];
            $scope.listuserexp = [];
            $scope.contact = {};
            $scope.userlogin = {};
            $scope.ddluserid = rowData.id;
            getuserdetail(rowData.id);
            $scope.rejectreason = {};
            loadrejectreason($scope.ddluserid);
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

        $scope.addUser = function () {
            
            alert();
            $scope.user = {};
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

        function getAllUser(gridview) {
            
            var obj = {};
            obj.userid = sessionStorage.usertypecode == appConstants.CODE_USER ? 0 : sessionStorage.userid;
            obj.usertypeid = gridview;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetUser, userModel.searchall, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                $scope.resultData = resolve.ResponseData;
                init();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.FilerGrid = function (gridview) {
            getAllUser(gridview);

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


        function getuserdetail(userid) {
            debugger
            var obj = {};
            obj.id = userid;
            obj.userid = userid;
            materials.showSpinner();
            var result = service.serverPost(config.urlGetUserById, userModel.searchbyid, "", obj)
            result.then(function (resolve) {
                
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
                // $scope.$apply();
            }, function (reject) {
                materials.hideSpinner();
                alert('Not Resolved')
            });
        }

        $scope.updateuser = function ( userstatus) {
            var objimg = angular.copy($scope.user);
            objimg.createdby = sessionStorage.userid;
            objimg.modifiedby = sessionStorage.userid;
            objimg.userstatusid = 1;

            objimg.contactno = $scope.contact.mobileno;
            objimg.email = $scope.contact.email;
            objimg.username = $scope.userlogin.username;

            var con = [];
            var login = [];
            var lstInputs = [];
            con.push($scope.contact);
            $scope.userlogin.createdby = sessionStorage.userid;
            $scope.userlogin.islocked = $scope.userlogin.islocked == true || $scope.userlogin.islocked == 1 ? 1 : 0;
            login.push($scope.userlogin)

            var obj = {};
            obj.contact = con;
            obj.login = login;
            lstInputs.push(obj);

            objimg.lstInputs = lstInputs;
            objimg.modifiedat = new Date();
            var _confirmname = $scope.gridview == 2 ? "Agency" : "ISP";

            var result = service.serverPost(config.urlUpdateUser, userModel.edit, "", objimg)
            result.then(function (resolve) {
                materials.hideSpinner();
                if (resolve.ResponseData > 0) {
                    materials.hideSpinner();
                    $scope.userID = resolve.ResponseData;
                    materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.updateMsg);
                    getAllUser($scope.gridview);
                    $scope.show = 1;
                }
                else {
                    materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                }

            }, function (reject) {
                alert('Not Resolved')
            });


        }

        $scope.update_approve = function (userid) {

            var obj = {};
            obj.userid = userid;
            //objimg.createdby = sessionStorage.userid;
            //objimg.modifiedby = sessionStorage.userid;
            //objimg.userstatusid = 3;

            //objimg.contactno = $scope.contact.mobileno;
            //objimg.email = $scope.contact.email;
            //objimg.username = $scope.userlogin.username;

            //var con = [];
            //var login = [];
            //var lstInputs = [];
            //con.push($scope.contact);
            //$scope.userlogin.createdby = sessionStorage.userid;
            //$scope.userlogin.islocked = $scope.userlogin.islocked == true || $scope.userlogin.islocked == 1 ? 1 : 0;
            //login.push($scope.userlogin)

            //var obj = {};
            //obj.contact = con;
            //obj.login = login;
            //lstInputs.push(obj);

            //objimg.lstInputs = lstInputs;
            //objimg.modifiedat = new Date();

            var _confirmname = $scope.gridview == 2 ? "Agency" : "ISP";
            var confirm = materials.approveConfirm(_confirmname);
            $mdDialog.show(confirm).then(function () {
                materials.showSpinner();
                var result = service.serverPost(config.urlupdateUserapporveed, userModel.get_reject, "", obj)
                result.then(function (resolve) {
                    materials.hideSpinner();
                //    if (resolve.ResponseData > 0) {
                        materials.hideSpinner();
                        $scope.userID = resolve.ResponseData;
                        materials.displayToast(appConstants.successClass, _confirmname + ' ' + appConstants.approvedMsg);
                        getAllUser($scope.gridview);
                        $scope.show = 1;
                    //}
                    //else {

                    //    materials.displayToast(appConstants.successClass, geterrormgs(resolve.ResponseData) + ' ' + appConstants.existMsg);
                    //}

                }, function (reject) {
                    materials.hideSpinner();
                    alert('Not Resolved')
                });

            });
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

        $scope.saveUser = function (userstatus) {
            var obj = angular.copy($scope.user);
           // var obj = this.user;
            if (obj.profileimages != undefined) {
                if (obj.profileimages.name != undefined && obj.profileimages.name != null) {
                    if (angular.isObject(obj.profileimages)) {
                        materials.showSpinner();
                        var result = service.filePost(config.urlSaveFile, obj.profileimages)
                        result.then(function (resolve) {
                            obj.profileimages = resolve.ResponseData[0].filename;
                            obj.sign = "";
                            $scope.saveuserwimg(obj, userstatus);
                        }
                        , function (reject) {
                            alert("File Upload Error");
                        });
                    }
                }
                else {
                    obj.profileimages = $scope.selecteduserimg;
                    $scope.saveuserwimg(obj, userstatus);
                }
            }
            else {
                obj.profileimages = "";
                $scope.saveuserwimg(obj, userstatus);
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
                //Only for selection changedloadChilds
                if (varId != '' && valParam[1] != varId) {
                    continue;
                }
                //End
                if (valParam.length > 1) {
                    
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

        $scope.updatereject = function (sts, remark) {
            var msg = "Details";
            var upflag = "DE";
            switch (sts) {
                case "DE":
                    $scope.user.isdetailaccept = false;
                    break;
                case "SKILL":
                    msg = "Skill";
                    $scope.user.isskillaccept = false;
                    break;
                case "WORK":
                    msg = "Work Experience";
                    $scope.user.isworkaccept = false;
                    break;
                case "LOC":
                    msg = "Preferred Locations";
                    $scope.user.islocaccept = false;
                    break;
                case "PROOF":
                    msg = "Proofs";
                    $scope.user.isproofaccept = false;
                    break;
                case "BANK":
                    msg = "Bank Details";
                    $scope.user.isbankaccept = false;
                    break;
            }
            
            remark = remark != undefined ? remark : "";
            var delObj = {
                userid: $scope.ddluserid,
                code: sts,
                remarks: remark
            };
            materials.showSpinner();
            var result = service.serverDelete(config.urlUpdateUserrejectreason, userModel.reject, "", delObj);
            result.then(function (resolve) {
                materials.hideSpinner();
                materials.displayToast(appConstants.successClass, (msg + appConstants.reject) + ' ' + "");
                getAllUser($scope.gridview);
                // $scope.show = 1;
                //loadrejectreason($scope.ddluserid)
            }, function (reject) {
                materials.hideSpinner();
            });
        }


        function getreason(code, remark) {
            var _reason = {};
            _reason.userid = $scope.ddluserid;
            _reason.code = code;
            _reason.remarks = remark;
            return _reason;
        }

        $scope.updateuserreject = function (userid) {

            debugger;

            var listrejectreson = [];
            if ($scope.rejectreason.userdetail != null && $scope.rejectreason.userdetail != "") {
                listrejectreson.push(getreason("DE", $scope.rejectreason.userdetail));
            }

            if ($scope.rejectreason.skillreason != null && $scope.rejectreason.skillreason != "") {
                listrejectreson.push(getreason("SKILL", $scope.rejectreason.skillreason));
            }

            if ($scope.rejectreason.workreason != null && $scope.rejectreason.workreason != "") {
                listrejectreson.push(getreason("WORK", $scope.rejectreason.workreason));
            }

            if ($scope.rejectreason.locationreason != null && $scope.rejectreason.locationreason != "") {
                listrejectreson.push(getreason("LOC", $scope.rejectreason.locationreason));
            }

            if ($scope.rejectreason.proofreason != null && $scope.rejectreason.proofreason != "") {
                listrejectreson.push(getreason("PROOF", $scope.rejectreason.proofreason));
            }

            if ($scope.rejectreason.bankdetails != null && $scope.rejectreason.bankdetails != "") {
                listrejectreson.push(getreason("BANK", $scope.rejectreason.bankdetails));
            }

            if (listrejectreson.length > 0) {
                var delObj = {};
                delObj.userid = userid;
                delObj.listinputs = listrejectreson;
                materials.showSpinner();
                var result = service.serverDelete(config.urlUpdateUserrejectlistreason, userModel.list_reject, "", delObj);
                result.then(function (resolve) {
                    materials.hideSpinner();
                    materials.displayToast(appConstants.successClass, appConstants.reject + ' ' + "");
                    getAllUser($scope.gridview);
                    $scope.show = 1;
                }, function (reject) {
                    materials.hideSpinner();
                });
            }
            else {
                materials.displayToast(appConstants.warningClass, "Reject Reason is empty.");
            }
        }

        $scope.upload_accept = function (flag, acceptobj) {
            
            var msg = "Skill";
            var upflag = "SKILL";
            switch (flag) {
                case "D":
                    msg = "Details";
                    acceptobj.isdetailaccept = true;
                    upflag = "DE";
                    break;
                case "S":
                    acceptobj.isskillaccept = true;
                    break;
                case "W":
                    msg = "Work Experience";
                    acceptobj.isworkaccept = true;
                    upflag = "WORK";
                    break;
                case "L":
                    msg = "Preferred Locations";
                    acceptobj.islocaccept = true;
                    upflag = "LOC";
                    break;
                case "P":
                    msg = "Proofs";
                    acceptobj.isproofaccept = true;
                    upflag = "PROOF";
                    break;
                case "B":
                    msg = "Bank Details";
                    acceptobj.isbankaccept = true;
                    upflag = "BANK";
                    break;
            }


            var _obj = {};
            _obj.userid = $scope.ddluserid;
            _obj.flag = flag;
            _obj.upflag = upflag;
            materials.showSpinner();
            var result = service.serverPost(config.url_updateuseraccept, userModel.accept, "", _obj)
            result.then(function (resolve) {
                materials.hideSpinner();

                materials.displayToast(appConstants.successClass, appConstants.accept + ' ' + "");
                $scope.rejectreason = {};
                loadrejectreason($scope.ddluserid);

                //switch (flag) {
                //    case "S":
                //        $scope.save_Us_Skill($scope.listuserskil);
                //        break;
                //    case "W":
                //        $scope.saveworkexp();
                //        break;
                //    case "L":
                //        $scope.saveLoction();
                //        break;
                //    case "P":
                //        $scope.uploadproof();
                //        break;
                //    case "B":
                //        $scope.upload_bankproof($scope.userbankdet);
                //        break;
                //}
            }, function (reject) {
                materials.hideSpinner();
                console.log(reject.ResponseMessage);
            });


        };
  
        $scope.sendrejectmsg = function (userid) {
            
            var obj = {};
            obj.userid = userid;
            var result = service.serverPost(config.urlsendrejectreason, userModel.get_reject, "", obj)
            result.then(function (resolve) {
                materials.hideSpinner();
                materials.displayToast(appConstants.successClass,  appConstants.reject + ' ' + "");
                $scope.show = 1
            }, function (reject) {
                alert('Not Resolved')
            });


        }

        $scope.save_Us_Skill = function (lstinputs) {
            

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
                newinput.skillname = lstinputs[i].skillid != undefined ? null : lstinputs[i].searchitem;
                listinputs.push(newinput);
            }
            skill_obj.listinputs = listinputs;
            //  skill_obj.userid = $scope.userID;
            //  skill_obj.status = 1;
            materials.showSpinner();
            var result = service.serverPost(config.urlSaveUserskill, userModel.skill_add, "", skill_obj)
            result.then(function (resolve) {
                materials.hideSpinner();
               
                    materials.displayToast(appConstants.successClass, appConstants.pr_empdocument + ' ' + appConstants.saveMsg);
                    getAllUserskill($scope.ddluserid);
               
            }, function (reject) {
                materials.hideSpinner();
            });
        }

        $scope.saveworkexp = function () {
            
           
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
                materials.displayToast(appConstants.successClass, appConstants.pr_empdocument + ' ' + appConstants.saveMsg);
                GetAlluserexp(Docobj.userid);

            }, function (reject) {
                materials.hideSpinner();
            });
        }

        $scope.saveLoction = function () {

            
            var loc_obj = {};
            var lstinputs = [];
            loc_obj.userid = $scope.ddluserid;
            loc_obj.cityid = 0;
            for (var i = 0; i < $scope.listuserprelocation.length; i++) {
                var newinput = {};
                newinput.userid = $scope.ddluserid;
                newinput.cityid = $scope.listuserprelocation[i].cityid;
                newinput.areaid = $scope.listuserprelocation[i].areaid;
                lstinputs.push(angular.copy(newinput));
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
            
            var listinputs = [];
            var obj = {};
            obj.userid = $scope.ddluserid;
            //var lstid = null;
            //var lstimg = null;
            obj.listinputs = [];
            for (var i = 0; i < $scope.listuserproof.length; i++) {
                var newparam = {};
                newparam.userid = $scope.ddluserid;
                newparam.prooftypeid = $scope.listuserproof[i].prooftypeid;
                newparam.image = $scope.listuserproof[i].image;
                newparam.proofno = $scope.listuserproof[i].proofno != null ? $scope.listuserproof[i].proofno : null;
                listinputs.push(newparam);
                // lstid = lstid == null ? $scope.listuserproof[i].prooftypeid : lstid + "," + $scope.listuserproof[i].prooftypeid;
                //  lstimg = lstimg == null ? $scope.listuserproof[i].proofimage : lstimg + "," + $scope.listuserproof[i].proofimage;
            }

            obj.listinputs = listinputs;
            //obj.lstid = lstid;
            //  obj.listimg = lstimg;
            var result = service.serverPost(config.urlsaveuserproofbyweb, userModel.proof_add, "", obj)
            result.then(function (resolve) {
                
                materials.displayToast(appConstants.successClass, appConstants.userproof + ' ' + appConstants.saveMsg);

                getAllUserproof($scope.ddluserid);

            }, function (reject) {
                alert('Not Resolved')
            });
        }

        $scope.upload_bankproof = function (userBank) {
            
            var _obj = userBank;
            
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
            
            var sk_obj = {};
            sk_obj.userid = userid;
            var result = service.serverPost(config.urlGetUserskill, userModel.searchall_skill, "", sk_obj)
            result.then(function (resolve) {
                $scope.listuserskil = resolve.ResponseData;
            }, function (reject) {
            });
        }

        function GetAlluserexp(userid) {
            //materials.showSpinner();
            var obj = {};
            obj.userid = $scope.userid;
            var result = service.serverPost(config.urlGetUserexp, userModel.searchall_skill, "", obj)
            result.then(function (resolve) {
                // materials.hideSpinner();
                $scope.listuserexp = resolve.ResponseData;

                arrangedate($scope.listuserexp)
            }, function (reject) {

                //materials.hideSpinner();
                console.log(reject.ResponseMessage);
            });
        }

        function arrangedate( listuserexp ) {
            for (var i = 0; i < listuserexp.length; i++) {
                listuserexp[i].fromdate = new Date(listuserexp[i].fromdate);
                listuserexp[i].todate = new Date(listuserexp[i].todate);
            }
        }


        function getAllLoc(userid) {
            //materials.showSpinner();
            var loc_obj = {};
            loc_obj.userid = userid;
            var result = service.serverPost(config.urlGetUserlocpreferById, userModel.searchbyid, "", loc_obj)
            result.then(function (resolve) {
                $scope.listuserprelocation = resolve.ResponseData;

            }, function (reject) {

                //materials.hideSpinner();
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

      

        getAllUser(2);

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
            
            columns = columns.split('~');
            if (item == undefined) {
                item = $scope.retdata;
            }

            var column = columns[1];
            if (item[0] !=undefined)
                selectedId = item[0].id;
            else
                selectedId = item.id;
            eval('getAll' + column + '(' + selectedId + ')');
        }

        function selectedlistItemChange(item, index, key, list) {
            
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

        $scope.removeField = function (listinputs) {
            listinputs.splice(listinputs.length - 1, 1);
        }

        $scope.canSubmit_childform = function (form) {
            return form.$valid ;
        };

    }

    function proofimgCtrl($q, $rootScope, $scope, $uibModalInstance, $filter, items, config, appConstants, service, materials, commonModel) {
        

        $scope.upimag = items.img;

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }
})();


