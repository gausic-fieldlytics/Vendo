
angular
      .module('app.table').factory('authData', authData);

function authData() {
    var authDataFactory = {};

    var _authentication = {
        IsAuthenticated: false,
        ispasswordchanged: "1",
        Username: "",
        loginId: "",
        sessionId: "",
        usertypeid: "",
        userid: "",
        userstatusid: "",
        rolecode: "",
        roleid: "",
        clientid: "",
        usertypecode: ""
    };
    authDataFactory.authenticationData = _authentication;

    return authDataFactory;
}
