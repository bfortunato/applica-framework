"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.register = register;
exports.recover = recover;
exports.confirm = confirm;

var _config = require("../framework/config");

var config = _interopRequireWildcard(_config);

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function register(name, mail, password) {
    return (0, _utils.post)(config.get("account.register.url"), { name: name, mail: mail, password: password });
}

function recover(mail) {
    return (0, _utils.post)(config.get("account.recover.url"), { mail: mail });
}

function confirm(activationCode) {
    return (0, _utils.post)(config.get("account.confirm.url"), { activationCode: activationCode });
}