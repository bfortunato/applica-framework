"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.account = exports.ACCOUNT = exports.session = exports.SESSION = undefined;

var _aj = require("../aj");

var aj = _interopRequireWildcard(_aj);

var _actions = require("../actions");

var actions = _interopRequireWildcard(_actions);

var _underscore = require("../libs/underscore");

var _ = _interopRequireWildcard(_underscore);

var _strings = require("../strings");

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var SESSION = exports.SESSION = "SESSION";
var session = exports.session = aj.createStore(SESSION, function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];


    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { isLoggedIn: false });

        case actions.LOGIN_COMPLETE:
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case actions.LOGIN_ERROR:
            return _.assign(state, { isLoggedIn: false, error: true });

        case actions.RESUME_SESSION:
            return _.assign(state, { isLoggedIn: false });

        case actions.RESUME_SESSION_COMPLETE:
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case actions.RESUME_SESSION_ERROR:
            return _.assign(state, { isLoggedIn: false, error: true });
    }
});

var ACCOUNT = exports.ACCOUNT = "ACCOUNT";
var account = exports.account = aj.createStore(ACCOUNT, function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { activationCode: "" };
    var action = arguments[1];


    switch (action.type) {
        case actions.REGISTER:
            return _.assign(state, { registered: false, error: false });

        case actions.REGISTRATION_COMPLETE:
            return _.assign(state, { registered: true, error: false, name: action.name, mail: action.mail, message: action.message });

        case actions.REGISTRATION_ERROR:
            return _.assign(state, { registered: false, error: true, message: action.message });

        case actions.SET_ACTIVATION_CODE:
            return _.assign(state, { activationCode: action.activationCode });

        case actions.CONFIRM_ACCOUNT:
            return _.assign(state, { confirmed: false, error: false });

        case actions.CONFIRM_ACCOUNT_COMPLETE:
            return _.assign(state, { confirmed: true, error: false });

        case actions.CONFIRM_ACCOUNT_ERROR:
            return _.assign(state, { confirmed: false, error: true, message: action.message });

        case actions.RECOVER_ACCOUNT:
            return _.assign(state, { recovered: false, error: false });

        case actions.RECOVER_ACCOUNT_COMPLETE:
            return _.assign(state, { recovered: true, error: false });

        case actions.RECOVER_ACCOUNT_ERROR:
            return _.assign(state, { recovered: false, error: true });
    }
});