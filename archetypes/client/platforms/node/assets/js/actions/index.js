"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.confirmAccountError = exports.CONFIRM_ACCOUNT_ERROR = exports.confirmAccountComplete = exports.CONFIRM_ACCOUNT_COMPLETE = exports.confirmAccount = exports.CONFIRM_ACCOUNT = exports.setActivationCode = exports.SET_ACTIVATION_CODE = exports.recoverAccountError = exports.RECOVER_ACCOUNT_ERROR = exports.recoverAccountComplete = exports.RECOVER_ACCOUNT_COMPLETE = exports.recoverAccount = exports.RECOVER_ACCOUNT = exports.registrationError = exports.REGISTRATION_ERROR = exports.registrationComplete = exports.REGISTRATION_COMPLETE = exports.register = exports.REGISTER = exports.logout = exports.LOGOUT = exports.resumeSessionError = exports.RESUME_SESSION_ERROR = exports.resumeSessionComplete = exports.RESUME_SESSION_COMPLETE = exports.resumeSession = exports.RESUME_SESSION = exports.loginError = exports.LOGIN_ERROR = exports.loginComplete = exports.LOGIN_COMPLETE = exports.login = exports.LOGIN = undefined;

var _aj = require("../aj");

var aj = _interopRequireWildcard(_aj);

var _session = require("../api/session");

var session = _interopRequireWildcard(_session);

var _account = require("../api/account");

var account = _interopRequireWildcard(_account);

var _responses = require("../api/responses");

var responses = _interopRequireWildcard(_responses);

var _plugins = require("../plugins");

var _lang = require("../utils/lang");

var _strings = require("../strings");

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var LOGIN = exports.LOGIN = "LOGIN";
var login = exports.login = aj.createAction(LOGIN, function (data) {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.mailAndPasswordRequired, "warning");
        return;
    }

    aj.dispatch({
        type: LOGIN
    });

    (0, _plugins.showLoader)();
    session.start(data.mail, data.password).then(function (user) {
        (0, _plugins.hideLoader)();
        (0, _plugins.toast)(_strings2.default.welcome + " " + user.name);

        loginComplete({ user: user });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, _strings2.default.badLogin, "error");

        loginError();
    });
});

var LOGIN_COMPLETE = exports.LOGIN_COMPLETE = "LOGIN_COMPLETE";
var loginComplete = exports.loginComplete = aj.createAction(LOGIN_COMPLETE, function (data) {
    aj.dispatch({
        type: LOGIN_COMPLETE,
        user: data.user
    });
});

var LOGIN_ERROR = exports.LOGIN_ERROR = "LOGIN_ERROR";
var loginError = exports.loginError = aj.createAction(LOGIN_ERROR, function (data) {
    aj.dispatch({
        type: LOGIN_ERROR
    });
});

var RESUME_SESSION = exports.RESUME_SESSION = "RESUME_SESSION";
var resumeSession = exports.resumeSession = aj.createAction(RESUME_SESSION, function (data) {
    aj.dispatch({
        type: RESUME_SESSION
    });

    session.resume().then(function (user) {
        (0, _plugins.hideLoader)();
        (0, _plugins.toast)(_strings2.default.welcome + " " + user.name);

        resumeSessionComplete({ user: user });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();

        resumeSessionError();
    });
});

var RESUME_SESSION_COMPLETE = exports.RESUME_SESSION_COMPLETE = "RESUME_SESSION_COMPLETE";
var resumeSessionComplete = exports.resumeSessionComplete = aj.createAction(RESUME_SESSION_COMPLETE, function (data) {
    aj.dispatch({
        type: RESUME_SESSION_COMPLETE,
        user: data.user
    });
});

var RESUME_SESSION_ERROR = exports.RESUME_SESSION_ERROR = "RESUME_SESSION_ERROR";
var resumeSessionError = exports.resumeSessionError = aj.createAction(RESUME_SESSION_ERROR, function (data) {
    aj.dispatch({
        type: RESUME_SESSION_ERROR
    });
});

var LOGOUT = exports.LOGOUT = "LOGOUT";
var logout = exports.logout = aj.createAction(LOGOUT, function (data) {
    session.destroy().then(function () {
        aj.dispatch({
            type: LOGOUT
        });
    });
});

var REGISTER = exports.REGISTER = "REGISTER";
var register = exports.register = aj.createAction(REGISTER, function (data) {
    if (_.isEmpty(data.name) || _.isEmpty(data.mail) || _.isEmpty(data.password)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.nameMailAndPasswordRequired, "warning");
        return;
    }

    aj.dispatch({
        type: REGISTER
    });

    (0, _plugins.showLoader)(_strings2.default.registering);
    account.register(data.name, data.mail, data.password).then(function () {
        (0, _plugins.hideLoader)();

        var message = (0, _lang.format)(_strings2.default.welcomeMessage, data.name, data.mail);
        registrationComplete({ name: data.name, mail: data.mail, message: message });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        registrationError();
    });
});

var REGISTRATION_COMPLETE = exports.REGISTRATION_COMPLETE = "REGISTRATION_COMPLETE";
var registrationComplete = exports.registrationComplete = aj.createAction(REGISTRATION_COMPLETE, function (data) {
    aj.dispatch({
        type: REGISTRATION_COMPLETE,
        mail: data.mail,
        name: data.name
    });
});

var REGISTRATION_ERROR = exports.REGISTRATION_ERROR = "REGISTRATION_ERROR";
var registrationError = exports.registrationError = aj.createAction(REGISTRATION_ERROR, function (data) {
    aj.dispatch({
        type: REGISTRATION_ERROR
    });
});

var RECOVER_ACCOUNT = exports.RECOVER_ACCOUNT = "RECOVER_ACCOUNT";
var recoverAccount = exports.recoverAccount = aj.createAction(RECOVER_ACCOUNT, function (data) {
    if (_.isEmpty(data.mail)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.mailRequired, "warning");
        return;
    }

    aj.dispatch({
        type: RECOVER_ACCOUNT
    });

    (0, _plugins.showLoader)();
    account.recover(data.mail).then(function () {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.congratulations, (0, _lang.format)(_strings2.default.accountRecovered, data.mail));

        recoverAccountComplete();
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        recoverAccountError();
    });
});

var RECOVER_ACCOUNT_COMPLETE = exports.RECOVER_ACCOUNT_COMPLETE = "RECOVER_ACCOUNT_COMPLETE";
var recoverAccountComplete = exports.recoverAccountComplete = aj.createAction(RECOVER_ACCOUNT_COMPLETE, function (data) {
    aj.dispatch({
        type: RECOVER_ACCOUNT_COMPLETE
    });
});

var RECOVER_ACCOUNT_ERROR = exports.RECOVER_ACCOUNT_ERROR = "RECOVER_ACCOUNT_ERROR";
var recoverAccountError = exports.recoverAccountError = aj.createAction(RECOVER_ACCOUNT_ERROR, function (data) {
    aj.dispatch({
        type: RECOVER_ACCOUNT_ERROR
    });
});

var SET_ACTIVATION_CODE = exports.SET_ACTIVATION_CODE = "SET_ACTIVATION_CODE";
var setActivationCode = exports.setActivationCode = aj.createAction(SET_ACTIVATION_CODE, function (data) {
    aj.dispatch({
        type: SET_ACTIVATION_CODE,
        activationCode: data.activationCode
    });
});

var CONFIRM_ACCOUNT = exports.CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT";
var confirmAccount = exports.confirmAccount = aj.createAction(CONFIRM_ACCOUNT, function (data) {
    if (_.isEmpty(data.activationCode)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.activationCodeRequired, "warning");
        return;
    }

    aj.dispatch({
        type: CONFIRM_ACCOUNT
    });

    (0, _plugins.showLoader)();
    account.confirm(data.activationCode).then(function () {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.congratulations, _strings2.default.accountConfirmed);

        confirmAccountComplete();
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        confirmAccountError();
    });
});

var CONFIRM_ACCOUNT_COMPLETE = exports.CONFIRM_ACCOUNT_COMPLETE = "CONFIRM_ACCOUNT_COMPLETE";
var confirmAccountComplete = exports.confirmAccountComplete = aj.createAction(CONFIRM_ACCOUNT_COMPLETE, function (data) {
    aj.dispatch({
        type: CONFIRM_ACCOUNT_COMPLETE
    });
});

var CONFIRM_ACCOUNT_ERROR = exports.CONFIRM_ACCOUNT_ERROR = "CONFIRM_ACCOUNT_ERROR";
var confirmAccountError = exports.confirmAccountError = aj.createAction(CONFIRM_ACCOUNT_ERROR, function (data) {
    aj.dispatch({
        type: CONFIRM_ACCOUNT_ERROR
    });
});