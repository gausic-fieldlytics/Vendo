(function () {
    'use strict';

    angular.module('app.table').constant('config', {

        appName: 'Task Management System',
        appVersion: '0.1',
        appOwner: 'Qwicksoft Solutions Private Limited',

        // serviceUrl: 'http://testvendoservice.ppms.co.in/Task/',        
        // fileUrl: 'http://testvendoservice.ppms.co.in/Upload/',
        // filPath: 'http://testvendoservice.ppms.co.in/',
        // oAuthentication: 'http://testvendoservice.ppms.co.in/oauth/token',
        // signalr: "http://testvendoservice.ppms.co.in/signalr",

        serviceUrl: 'https://vendoservice.ppms.co.in/Task/',
        fileUrl: 'https://vendoservice.ppms.co.in/Upload/',
        filPath: 'https://vendoservice.ppms.co.in/',
        oAuthentication: 'https://vendoservice.ppms.co.in/oauth/token',
        signalr: "https://vendoservice.ppms.co.in/signalr",
      
        // serviceUrl: 'http://localhost:62153/Task/',  
        // fileUrl: 'http://localhost:62153/Upload/',
        // filPath: 'http://localhost:62153/',
        // oAuthentication: 'http://localhost:62153/oauth/token',
        // signalr: "http://localhost:62153/signalr",


       urlSaveFile: "FileUpload",
       urlpdfpath: "UploadedFiles/",

        urlPromotionImage: 'ImgPromotion',
        urlCategoryImage: 'ImgCategory',
        urlSubcategoryImage: 'ImgSubcategory',
        urlItemImage: 'ImgItem',
        urluserProof:"ImgUserProof",

        urlFolderPath: 'folderpath',
        urlTaskImage: 'ImgTask',
        urlTaskstepImage: 'ImgTaskStep',
        urlProfileImage: 'Profile',


        

        urlDDLoad: 'GetAll~TBL~',

        urlGetHeaderMenu: 'app/json-data/headermenu.json',
        urlGetAGTHeaderMenu: 'app/json-data/agtheadermenu.json',
        urlGetCommJson: 'app/json-data/community.json',
        urlGetLUMasterJson: 'app/json-data/lumaster.json',
        urlGetMasterJson: 'app/json-data/master.json',
        urlGetTaskJson: 'app/json-data/task.json',
        urlGetReportsJson: 'app/json-data/reports.json',
        urlGetAgtJson: 'app/json-data/agent.json',
        urlGetAgMsttJson: 'app/json-data/agentmaster.json',
        urlGetAudittJson: 'app/json-data/audit.json',
        urlSettingsJson: 'app/json-data/settings.json',
        	
        urlgetadmindashboard: 'getadmindashboard',
     //   urlforgetpassword: "UserForgotPassword",
        urlforgetpassword: "agentForgotPassword",
        urlchangepassword: "ChangePassword",
		//Appversion
		urlGetAppversion: 'GetAllAppversion',
        urlSaveAppversion: 'SaveAppversion',
        urlDeleteAppversion: 'DeleteAppversion',
        urlUpdateAppversion: 'UpdateAppversion',
        urlGetAppversionById: 'GetAppversionById',
        //Area
        urlGetArea: 'GetAllArea',
        urlSaveArea: 'SaveArea',
        urlDeleteArea: 'DeleteArea',
        urlUpdateArea: 'UpdateArea',
        urlGetAreaById: 'GetAreaById',
		//Appvhistory
		urlGetAppvhistory: 'GetAllAppvhistory',
        urlSaveAppvhistory: 'SaveAppvhistory',
        urlDeleteAppvhistory: 'DeleteAppvhistory',
        urlUpdateAppvhistory: 'UpdateAppvhistory',
        urlGetAppvhistoryById: 'GetAppvhistoryById',		
		//Autoincmaster
		urlGetAutoincmaster: 'GetAllAutoincmaster',
        urlSaveAutoincmaster: 'SaveAutoincmaster',
        urlDeleteAutoincmaster: 'DeleteAutoincmaster',
        urlUpdateAutoincmaster: 'UpdateAutoincmaster',
        urlGetAutoincmasterById: 'GetAutoincmasterById',
        //Assign Auditor
        urlGetAssignAuditor: 'GetAllAssignAuditor',
        urlSaveAssignAuditor: 'SaveAssignAuditor',
        urlDeleteAssignAuditor: 'DeleteAssignAuditor',
        urlUpdateAssignAuditor: 'UpdateAssignAuditor',
        urlGetAssignAuditorById: 'GetAssignAuditorById',
		//City
		urlGetCity: 'GetAllCity',
        urlSaveCity: 'SaveCity',
        urlDeleteCity: 'DeleteCity',
        urlUpdateCity: 'UpdateCity',
        urlGetCityById: 'GetCityById',		
        //Client
        urlGetClient: 'GetAllClient',
        urlSaveClient: 'SaveClient',
        urlDeleteClient: 'DeleteClient',
        urlUpdateClient: 'UpdateClient',
        urlGetClientById: 'GetClientById',
        //Companytype
		urlGetCompanytype: 'GetAllCompanytype',
        urlSaveCompanytype: 'SaveCompanytype',
        urlDeleteCompanytype: 'DeleteCompanytype',
        urlUpdateCompanytype: 'UpdateCompanytype',
        urlGetCompanytypeById: 'GetCompanytypeById',		
		//Contact
		urlGetContact: 'GetAllContact',
        urlSaveContact: 'SaveContact',
        urlDeleteContact: 'DeleteContact',
        urlUpdateContact: 'UpdateContact',
        urlGetContactById: 'GetContactById',		
		//Contacttype
		urlGetContacttype: 'GetAllContacttype',
        urlSaveContacttype: 'SaveContacttype',
        urlDeleteContacttype: 'DeleteContacttype',
        urlUpdateContacttype: 'UpdateContacttype',
        urlGetContacttypeById: 'GetContacttypeById',		
		//Department
		urlGetDepartment: 'GetAllDepartment',
        urlSaveDepartment: 'SaveDepartment',
        urlDeleteDepartment: 'DeleteDepartment',
        urlUpdateDepartment: 'UpdateDepartment',
        urlGetDepartmentById: 'GetDepartmentById',		
		//Emailtemplate
		urlGetEmailtemplate: 'GetAllEmailtemplate',
        urlSaveEmailtemplate: 'SaveEmailtemplate',
        urlDeleteEmailtemplate: 'DeleteEmailtemplate',
        urlUpdateEmailtemplate: 'UpdateEmailtemplate',
        urlGetEmailtemplateById: 'GetEmailtemplateById',		
		//Gender
		urlGetGender: 'GetAllGender',
        urlSaveGender: 'SaveGender',
        urlDeleteGender: 'DeleteGender',
        urlUpdateGender: 'UpdateGender',
        urlGetGenderById: 'GetGenderById',		
		//Generalsetting
		urlGetGeneralsetting: 'GetAllGeneralsetting',
        urlSaveGeneralsetting: 'SaveGeneralsetting',
        urlDeleteGeneralsetting: 'DeleteGeneralsetting',
        urlUpdateGeneralsetting: 'UpdateGeneralsetting',
        urlGetGeneralsettingById: 'GetGeneralsettingById',		
		//Invoice
		urlGetInvoice: 'GetAllInvoice',
        urlSaveInvoice: 'SaveInvoice',
        urlDeleteInvoice: 'DeleteInvoice',
        urlUpdateInvoice: 'UpdateInvoice',
        urlGetInvoiceById: 'GetInvoiceById',
        urlGetInvoicereqotp: 'GetAllInvoicereqotp',

        //Invoicefrequency
        urlGetInvoicefrequency: 'GetAllInvoicefrequency',
        urlSaveInvoicefrequency: 'SaveInvoicefrequency',
        urlDeleteInvoicefrequency: 'DeleteInvoicefrequency',
        urlUpdateInvoicefrequency: 'UpdateInvoicefrequency',
        urlGetInvoicefrequencyById: 'GetInvoicefrequencyById',
		//Invoicetax
		urlGetInvoicetax: 'GetAllInvoicetax',
        urlSaveInvoicetax: 'SaveInvoicetax',
        urlDeleteInvoicetax: 'DeleteInvoicetax',
        urlUpdateInvoicetax: 'UpdateInvoicetax',
        urlGetInvoicetaxById: 'GetInvoicetaxById',		
		//Location
		urlGetLocation: 'GetAllLocation',
        urlSaveLocation: 'SaveLocation',
        urlDeleteLocation: 'DeleteLocation',
        urlUpdateLocation: 'UpdateLocation',
        urlGetLocationById: 'GetLocationById',		
		//Locationtype
		urlGetLocationtype: 'GetAllLocationtype',
        urlSaveLocationtype: 'SaveLocationtype',
        urlDeleteLocationtype: 'DeleteLocationtype',
        urlUpdateLocationtype: 'UpdateLocationtype',
        urlGetLocationtypeById: 'GetLocationtypeById',		
		//Login
        urlGetLogin: 'GetAllLogin',
        urlGetLoginDetail: 'GetLoginDetail',
        urlSaveLogin: 'SaveLogin',
        urlDeleteLogin: 'DeleteLogin',
        urlUpdateLogin: 'UpdateLogin',
        urlGetLoginById: 'GetLoginById',		
		//Payment
		urlGetPayment: 'GetAllPayment',
        urlSavePayment: 'SavePayment',
        urlDeletePayment: 'DeletePayment',
        urlUpdatePayment: 'UpdatePayment',
        urlGetPaymentById: 'GetPaymentById',		
		//Paymentmode
		urlGetPaymentmode: 'GetAllPaymentmode',
        urlSavePaymentmode: 'SavePaymentmode',
        urlDeletePaymentmode: 'DeletePaymentmode',
        urlUpdatePaymentmode: 'UpdatePaymentmode',
        urlGetPaymentmodeById: 'GetPaymentmodeById',		
		//Paymentstatus
		urlGetPaymentstatus: 'GetAllPaymentstatus',
        urlSavePaymentstatus: 'SavePaymentstatus',
        urlDeletePaymentstatus: 'DeletePaymentstatus',
        urlUpdatePaymentstatus: 'UpdatePaymentstatus',
        urlGetPaymentstatusById: 'GetPaymentstatusById',		
		//Project
		urlGetProject: 'GetAllProject',
        urlSaveProject: 'SaveProject',
        urlDeleteProject: 'DeleteProject',
        urlUpdateProject: 'UpdateProject',
        urlGetProjectById: 'GetProjectById',
        urlGetProjectDD: 'GetProjectDD',
        urlGetProjecttarget: 'GetAllProjecttarget',
        urlSaveProjecttarget: 'SaveProjecttarget',
        //Ppmsuser
        urlGetPpmsuser: 'GetAllPpmsuser',
        urlSavePpmsuser: 'SavePpmsuser',
        urlDeletePpmsuser: 'DeletePpmsuser',
        urlUpdatePpmsuser: 'UpdatePpmsuser',
        urlGetPpmsuserById: 'GetPpmsuserById',
		//Prooftype
		urlGetProoftype: 'GetAllProoftype',
        urlSaveProoftype: 'SaveProoftype',
        urlDeleteProoftype: 'DeleteProoftype',
        urlUpdateProoftype: 'UpdateProoftype',
        urlGetProoftypeById: 'GetProoftypeById',		
		//Register
		urlGetRegister: 'GetAllRegister',
        urlSaveRegister: 'SaveRegister',
        urlDeleteRegister: 'DeleteRegister',
        urlUpdateRegister: 'UpdateRegister',
        urlGetRegisterById: 'GetRegisterById',		
		//Role
		urlGetRole: 'GetAllRole',
        urlSaveRole: 'SaveRole',
        urlDeleteRole: 'DeleteRole',
        urlUpdateRole: 'UpdateRole',
        urlGetRoleById: 'GetRoleById',		
		//Skill
		urlGetSkill: 'GetAllSkill',
        urlSaveSkill: 'SaveSkill',
        urlDeleteSkill: 'DeleteSkill',
        urlUpdateSkill: 'UpdateSkill',
        urlGetSkillById: 'GetSkillById',		
		//State
		urlGetState: 'GetAllState',
        urlSaveState: 'SaveState',
        urlDeleteState: 'DeleteState',
        urlUpdateState: 'UpdateState',
        urlGetStateById: 'GetStateById',		
		//Target
        urlGetTarget: 'GetAllTarget',
        urlGetTargetByClientIdByTask :"GetTargetByClientIdByTask",
        urlGetTargetbytask: 'GetAllTargetbytask',
        urlGetTargetgrid: 'GetAllTargetgrid',
        urlSaveTarget: 'SaveTarget',
        urlDeleteTarget: 'DeleteTarget',
        urlUpdateTarget: 'UpdateTarget',
        urlGetTargetById: 'GetTargetById',
        urlGetAlltargetlist: 'GetAlltasktargetlist',
        urlGetAlltargetbymobile: 'GetAllagencytarget',
        urlGettaskDD:"GettaskDD",
        urlDeletebulkTarget: 'DeletebulkTarget',

		//Targetfiles
		urlGetTargetfiles: 'GetAllTargetfiles',
        urlSaveTargetfiles: 'SaveTargetfiles',
        urlDeleteTargetfiles: 'DeleteTargetfiles',
        urlUpdateTargetfiles: 'UpdateTargetfiles',
        urlGetTargetfilesById: 'GetTargetfilesById',		
		//Task
        urlGetTask: 'GetAllTask',
        urlGetTaskNotDone: 'GetTaskNotDone',
        urlGetTasktarget: 'getasktarget',
        urlSaveTask: 'SaveTask',
        urlDeleteTask: 'DeleteTask',
        urlUpdateTask: 'UpdateTask',
        urlGetTaskById: 'GetTaskById',
        urlGetTargetByProject: 'GetTargetByProject',
        urlGetTargetDD: 'GetTargetDD',
        urlgetnotmappingtarget: 'getnotmappingtarget',
        urlgetnotmappingtask: "getnotmappingtask",
        urlGetTaskByStatus: 'GetTaskByStatus',
        urlGetTaskinvrequest: 'getinvoicereqtask',
        urlGetTaskinvtarget: 'getaskinvtarget',
        urlGetAllprocessTasksteps: "GetAllprocessTasksteps",
        urlgetagencytask: "GetAllTaskForAgency",
        urlgetallagencytask: "GetAllAgencyTask",
        urlgetagencyassigntask: "getagencyassigntask",
        urlgetalltaskstepfortask: "GetAllTaskstepfortask",
        urlGetTaskbytarget: "GetTaskbytarget",
        urlGetallagencyTaskbytarget: "GetallagencyTaskbytarget",
        urlGetagencyaudittask: 'Getagencyaudittask',
        urlGetagencyaudittarget: 'Getagencyaudittarget',
        urlgetaudittarget: 'getaudittarget',
        urlgetaudittask: 'getaudittask',
        urlgetagencyaudittasklist: "getagencyaudittasklist",
        urlSaveUsersTask: 'SaveUsersProjectTask',
        urlGetAuditorApprovedTargetByTask : 'GetAuditorApprovedTargetByTask',
		//Taskbucket
		urlGetTaskbucket: 'GetAllTaskbucket',
		urlSaveTaskbucket: 'SaveTaskbucket',
		urlSaveTaskbucketbymobile:'SaveTaskbucketbymobile',
        urlDeleteTaskbucket: 'DeleteTaskbucket',
        urlUpdateTaskbucket: 'UpdateTaskbucket',
        urlBulkUpdateTaskbucket: 'BulkUpdateTaskbucket',
        urlUpdateagencyreassign: 'Updateagencyreassign',
        urlcanceltaskbucketbyagency: 'canceltaskbucketbyagency',
        urlUpdatereassign: 'Updatereassign',
        urlGetTaskbucketById: 'GetTaskbucketById',
        urlGetagencytaskbucket: 'Getagencytaskbucket',
        urlGetallTaskprogress: 'GetallTaskprogress',
        urlGetallTaskprogressfilter: 'GetallTaskprogressfilter',
        urlInsertTaskTargetUserRate: 'InsertTaskTargetUserRate',
        urlGetTaskTargetUserRateByTask:'GetTaskTargetUserRateByTask',
        urlUpdateTaskTargetUserRateByTask:'UpdateTaskTargetUserRateByTask',
		//Taskdone
		urlGetTaskdone: 'GetAllTaskdone',
        urlSaveTaskdone: 'SaveTaskdone',
        urlDeleteTaskdone: 'DeleteTaskdone',
        urlUpdateTaskdone: 'UpdateTaskdone',
        urlGetTaskdoneById: 'GetTaskdoneById',		
		//Taskhistory
		urlGetTaskhistory: 'GetAllTaskhistory',
        urlSaveTaskhistory: 'SaveTaskhistory',
        urlDeleteTaskhistory: 'DeleteTaskhistory',
        urlUpdateTaskhistory: 'UpdateTaskhistory',
        urlGetTaskhistoryById: 'GetTaskhistoryById',		
		//Taskpool
		urlGetTaskpool: 'GetAllTaskpool',
        urlSaveTaskpool: 'SaveTaskpool',
        urlDeleteTaskpool: 'DeleteTaskpool',
        urlUpdateTaskpool: 'UpdateTaskpool',
        urlGetTaskpoolById: 'GetTaskpoolById',		
		//Taskstatus
		urlGetTaskstatus: 'GetAllTaskstatus',
        urlSaveTaskstatus: 'SaveTaskstatus',
        urlDeleteTaskstatus: 'DeleteTaskstatus',
        urlUpdateTaskstatus: 'UpdateTaskstatus',
        urlGetTaskstatusById: 'GetTaskstatusById',		
		//Taskstepprogress
		urlGetTaskstepprogress: 'GetAllTaskstepprogress',
        urlSaveTaskstepprogress: 'SaveTaskstepprogress',
        urlDeleteTaskstepprogress: 'DeleteTaskstepprogress',
        urlUpdateTaskstepprogress: 'UpdateTaskstepprogress',
        urlGetTaskstepprogressById: 'GetTaskstepprogressById',
        urlUpdateTaskstepprogressstatus: 'UpdateTaskstepprogressstatus',
        urlUpdateapprovedpaymentrequest: 'Updateapprovedpaymentrequest',

		//Tasksteps
		urlGetTasksteps: 'GetAllTasksteps',
        urlSaveTasksteps: 'SaveTasksteps',
        urlDeleteTasksteps: 'DeleteTasksteps',
        urlUpdateTasksteps: 'UpdateTasksteps',
        urlGetTaskstepsById: 'GetTaskstepsById',
        urlGetTaskstepsgrid: 'GetTaskstepsgrid',
        urlGetTaskprogressgrid: 'GetTaskprogressgrid',
        urlGetTaskstepsprojectgrid: 'GetTaskstepsprojectgrid',
		//Tax
		urlGetTax: 'GetAllTax',
        urlSaveTax: 'SaveTax',
        urlDeleteTax: 'DeleteTax',
        urlUpdateTax: 'UpdateTax',
        urlGetTaxById: 'GetTaxById',		
		//User
		urlGetUser: 'GetAllUser',
        urlSaveUser: 'SaveUser',
        urlDeleteUser: 'DeleteUser',
        urlUpdateUser: 'UpdateUser',
        urlupdateUserapporveed: 'UpdateUserapproved',
        urlGetUserById: 'GetUserById',
        urlGetUserByClientId: 'GetUserByClientId',
        urlGetUserByagencyNagentId: 'GetUserByagencyNagentId',
        urlGetagentangency: 'Getagentangency',
        urlGetsubagent: 'GetAllsubagent',

        url_pwdupdate: "UpdatepasswordLogin",
        url_updateuseraccept: "updateuseraccept",

		//Userbankdet
		urlGetUserbankdet: 'GetAllUserbankdet',
        urlSaveUserbankdet: 'SaveUserbankdet',
        urlDeleteUserbankdet: 'DeleteUserbankdet',
        urlUpdateUserbankdet: 'UpdateUserbankdet',
        urlGetUserbankdetById: 'GetUserbankdetById',		
		//Usercompany
		urlGetUsercompany: 'GetAllUsercompany',
        urlSaveUsercompany: 'SaveUsercompany',
        urlDeleteUsercompany: 'DeleteUsercompany',
        urlUpdateUsercompany: 'UpdateUsercompany',
        urlGetUsercompanyById: 'GetUsercompanyById',		
		//Userloc
		urlGetUserloc: 'GetAllUserloc',
        urlSaveUserloc: 'SaveUserloc',
        urlDeleteUserloc: 'DeleteUserloc',
        urlUpdateUserloc: 'UpdateUserloc',
        urlGetUserlocById: 'GetUserlocById',		
		//Userproof
		urlGetUserproof: 'GetAllUserproof',
        urlSaveUserproof: 'SaveUserproof',
        urlDeleteUserproof: 'DeleteUserproof',
        urlUpdateUserproof: 'UpdateUserproof',
        urlGetUserproofById: 'GetUserproofById',
        urlsaveuserproofbyweb: "SaveUserproofbyweb",
		//Userskill
		urlGetUserskill: 'GetAllUserskill',
        urlSaveUserskill: 'SaveUserskill',
        urlDeleteUserskill: 'DeleteUserskill',
        urlUpdateUserskill: 'UpdateUserskill',
        urlGetUserskillById: 'GetUserskillById',		
		//Userstatus
		urlGetUserstatus: 'GetAllUserstatus',
        urlSaveUserstatus: 'SaveUserstatus',
        urlDeleteUserstatus: 'DeleteUserstatus',
        urlUpdateUserstatus: 'UpdateUserstatus',
        urlGetUserstatusById: 'GetUserstatusById',		
		//Usertype
		urlGetUsertype: 'GetAllUsertype',
        urlSaveUsertype: 'SaveUsertype',
        urlDeleteUsertype: 'DeleteUsertype',
        urlUpdateUsertype: 'UpdateUsertype',
        urlGetUsertypeById: 'GetUsertypeById',

        //Userexp
        urlGetUserexp: 'GetAllUserexp',
        urlSaveUserexp: 'SaveUserexp',
        urlDeleteUserexp: 'DeleteUserexp',
        urlUpdateUserexp: 'UpdateUserexp',
        urlGetUserexpById: 'GetUserexpById',

        //Userlocprefer
        urlGetUserlocprefer: 'GetAllUserlocprefer',
        urlSaveUserlocprefer: 'SaveUserlocprefer',
        urlDeleteUserlocprefer: 'DeleteUserlocprefer',
        urlUpdateUserlocprefer: 'UpdateUserlocprefer',
        urlGetUserlocpreferById: 'GetUserlocpreferById',

        url_bulktarget: "savebulktarget",

        url_savebulkpayment: "savebulkpayment",
        url_getprojectreport: "getprojectreport",
        url_report_task: "gettaskreport",
        url_report_taskprocess: "gettaskprocessreport",
        url_getcollecteditemreport: "getcollecteditemreport",
        url_report_audit: "getauditreport",
        url_report_invoice: "getinvoicereport",
        url_report_user_project_detail: "getuserprojectdetailreport",
        url_report_user_project_image: "getuserprojectimagereport",
        url_getagencyandispreport: "getagencyandispreport",
        url_pdfgenerate: "pdfgenerate",

        //settings
        urlDeleteSetting: 'DeleteSetting',
        urlGetSetting: 'GetAllSetting',
        urlSaveSetting: 'SaveSetting',
        urlUpdateSetting: 'UpdateSetting',
        urlGetAllEmailsetting: 'GetAllEmailsetting',

        //taskchecklist
        urlGettaskchecklist: 'GetAllTaskchecklist',
        urlSavetaskchecklist: 'SaveTaskchecklist',
        urlDeletetaskchecklist: 'DeleteTaskchecklist',
        urlUpdatetaskchecklist: 'UpdateTaskchecklist',


        //tasktargetmapping
        urlGetAllTasktargetmapping: 'GetAllTasktargetmapping',
        urlSaveTasktargetmapping: 'SaveTasktargetmapping',
        urlUpdateTasktargetmapping: 'UpdateTasktargetmapping',
        urlDeleteTasktargetmapping: 'DeleteTasktargetmapping',

        //project status
        urlDeleteProjectstatus: 'DeleteProjectstatus',
        urlGetProjectstatus: 'GetAllProjectstatus',
        urlSaveProjectstatus: 'SaveProjectstatus',
        urlUpdateProjectstatus: 'UpdateProjectstatus',

        //item
        urlDeleteItem: 'DeleteItem',
        urlGetItem: 'GetAllItem',
        urlSaveItem: 'SaveItem',
        urlUpdateItem: 'UpdateItem',
        urlGetAllTaskitem: 'GetAllTaskitem',       

        //Task Cancel
        urlDeleteTaskcancelreason: 'DeleteTaskcancelreason',
        urlGetTaskcancelreason: 'GetAllTaskcancelreason',
        urlSaveTaskcancelreason: 'SaveTaskcancelreason',
        urlUpdateTaskcancelreason: 'UpdateTaskcancelreason',

        //Task CloaseCall
        urlDeleteTaskclosecallreason: 'DeleteTaskclosecallreason',
        urlGetTaskclosecallreason: 'GetAllTaskclosecallreason',
        urlSaveTaskclosecallreason: 'SaveTaskclosecallreason',
        urlUpdateTaskclosecallreason: 'UpdateTaskclosecallreason',
        urlGetAllTaskCloseCall: 'GetAllTaskClosecall',


        //Task Question Type
        urlDeleteTaskquestiontype: 'DeleteTaskquestiontype',
        urlGetTaskquestiontype: 'GetAllTaskquestiontype',
        urlSaveTaskquestiontype: 'SaveTaskquestiontype',
        urlUpdateTaskquestiontype: 'UpdateTaskquestiontype',
        urlGetTaskquestiontypedetailById: 'GetTaskquestiontypedetailById',


        //Task Step Type
        urlDeleteTasksteptype: 'DeleteTasksteptype',
        urlGetTasksteptype: 'GetAllTasksteptype',
        urlSaveTasksteptype: 'SaveTasksteptype',
        urlUpdateTasksteptype: 'UpdateTasksteptype',
        urlGetTasksteptypedetailById: 'GetTasksteptypedetailById',


        urlGetonlineuser: 'getallonlineuser',
        urlDeleteimg: 'Deleteimg',
      
        urlUpdateUserrejectreason: 'UpdateUserrejectreason',
        urlUpdateUserrejectlistreason: 'UpdateUserrejectlistreason',
        urlgetrejectreason: 'GetUserrejectreason',
        urlsendrejectreason:'sendrejectreason',

        urlgettaskpreview: 'GetTaskPreview',
        urlgettaskselection: 'GetTaskSelection',
        urlgettaskcollecteditem: 'gettaskcollecteditem',
        urlgetagencypickproject: 'getagencypickproject',

        
        urlcreateinvoice: "createinvoice",
        urlsendinvoiceotp: "sendinvoiceotp",
        urlSaveagencyInvoice:"SaveagencyInvoice",
        urlGetPaymenttransaction: "GetagencyPaymenttransaction",

        urlGetAllAgency:"GetAllAgency",

        //upload
    //    urlSaveFile: 'Upload',

        replaceWord: '~TBL~',

        url_bulkstate: "savebulkstate",
        url_bulkcity: "savebulkcity",
        url_bulklookup: "savebulklookup",
        url_Getrolepagepermission: "Getrolepagepermission",

        url_saveregisteragency: "SaveRegisteragency",
        url_verifyagencyregister: "verifyagencyRegister",
        url_getalltaskchecklistanswer: "GetAllTaskchecklistanswer",
        
    });
})();
