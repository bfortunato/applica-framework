"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadEntities = exports.LOAD_ENTITIES = exports.getGrid = exports.GET_GRID = exports.confirmAccount = exports.CONFIRM_ACCOUNT = exports.setActivationCode = exports.SET_ACTIVATION_CODE = exports.recoverAccount = exports.RECOVER_ACCOUNT = exports.register = exports.REGISTER = exports.logout = exports.LOGOUT = exports.resumeSession = exports.RESUME_SESSION = exports.login = exports.LOGIN = undefined;

var _aj = require("./aj");

var aj = _interopRequireWildcard(_aj);

var _ajex = require("./utils/ajex");

var _session = require("./api/session");

var session = _interopRequireWildcard(_session);

var _account = require("./api/account");

var account = _interopRequireWildcard(_account);

var _responses = require("./api/responses");

var responses = _interopRequireWildcard(_responses);

var _plugins = require("./plugins");

var _lang = require("./utils/lang");

var _strings = require("./strings");

var _strings2 = _interopRequireDefault(_strings);

var _grids = require("./api/grids");

var grids = _interopRequireWildcard(_grids);

var _entities = require("./api/entities");

var entities = _interopRequireWildcard(_entities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var LOGIN = exports.LOGIN = "LOGIN";
var login = exports.login = (0, _ajex.createAsyncAction)(LOGIN, function (data) {
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

        login.complete({ user: user });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, _strings2.default.badLogin, "error");

        login.fail();
    });
});

var RESUME_SESSION = exports.RESUME_SESSION = "RESUME_SESSION";
var resumeSession = exports.resumeSession = (0, _ajex.createAsyncAction)(RESUME_SESSION, function (data) {
    aj.dispatch({
        type: RESUME_SESSION
    });

    session.resume().then(function (user) {
        (0, _plugins.hideLoader)();
        (0, _plugins.toast)(_strings2.default.welcome + " " + user.name);

        resumeSession.complete({ user: user });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();

        resumeSession.fail();
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
var register = exports.register = (0, _ajex.createAsyncAction)(REGISTER, function (data) {
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
        register.complete({ name: data.name, mail: data.mail, message: message });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        register.fail();
    });
});

var RECOVER_ACCOUNT = exports.RECOVER_ACCOUNT = "RECOVER_ACCOUNT";
var recoverAccount = exports.recoverAccount = (0, _ajex.createAsyncAction)(RECOVER_ACCOUNT, function (data) {
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

        recoverAccount.complete();
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        recoverAccount.fail();
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
var confirmAccount = exports.confirmAccount = (0, _ajex.createAsyncAction)(CONFIRM_ACCOUNT, function (data) {
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

        confirmAccount.complete();
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        confirmAccount.fail();
    });
});

/** Grids actions **/

var GET_GRID = exports.GET_GRID = "GET_GRID";
var getGrid = exports.getGrid = (0, _ajex.createAsyncAction)(GET_GRID, function (data) {
    if (_.isEmpty(data.id)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.pleaseSpecifyId);
        return;
    }

    aj.dispatch({
        type: GET_GRID
    });

    (0, _plugins.showLoader)();
    grids.getGrid(data.id).then(function (response) {
        (0, _plugins.hideLoader)();

        getGrid.complete({ grid: JSON.parse(response.value) });
    }).catch(function (e) {
        (0, _plugins.hideLoader)();
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        getGrid.fail();
    });
});

/** Entities **/

var LOAD_ENTITIES = exports.LOAD_ENTITIES = "LOAD_ENTITIES";
var loadEntities = exports.loadEntities = (0, _ajex.createAsyncAction)(LOAD_ENTITIES, function (data) {
    if (_.isEmpty(data.entity)) {
        (0, _plugins.alert)(_strings2.default.problemOccoured, _strings2.default.pleaseSpecifyEntity);
        return;
    }

    aj.dispatch({
        type: LOAD_ENTITIES
    });

    entities.load(data.entity, !_.isEmpty(data.query) ? data.query.toJSON() : null).then(function (response) {
        loadEntities.complete({ result: response.value });
    }).catch(function (e) {
        (0, _plugins.alert)(_strings2.default.ooops, responses.msg(e), "error");

        loadEntities.fail();
    });
});