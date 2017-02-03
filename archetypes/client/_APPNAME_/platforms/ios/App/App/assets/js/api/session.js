"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TYPE_FACEBOOK = exports.TYPE_MAIL = undefined;
exports.login = login;
exports.start = start;
exports.resume = resume;
exports.destroy = destroy;
exports.getLoggedUser = getLoggedUser;
exports.isLoggedIn = isLoggedIn;
exports.getSessionToken = getSessionToken;

var _underscore = require("../libs/underscore");

var _ = _interopRequireWildcard(_underscore);

var _responses = require("./responses");

var responses = _interopRequireWildcard(_responses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var aj = require("../aj");
var http = require("../aj/http");

var preferences = require("../framework/preferences");
var config = require("../framework/config");


var _loggedUser = void 0;
var _sessionToken = void 0;

var TYPE_MAIL = exports.TYPE_MAIL = "MAIL";
var TYPE_FACEBOOK = exports.TYPE_FACEBOOK = "FACEBOOK";

var STOP_OBJ = {};

function stop() {
    return STOP_OBJ;
}

function wrap(r, fn) {
    if (r == STOP_OBJ) {
        return STOP_OBJ;
    } else {
        return fn(r);
    }
}

function login(mail, password) {
    return new Promise(function (resolve, reject) {
        http.post(config.get("login.url"), { mail: mail, password: password }).then(function (json) {
            if (_.isEmpty(json)) {
                reject(responses.ERROR);
            } else {
                var response = JSON.parse(json);

                if (responses.OK != response.responseCode) {
                    reject(response.responseCode);
                } else {
                    resolve(response);
                }
            }
        }).catch(function (e) {
            logger.e("Error logging in:", e);
            reject(responses.ERROR);
        });
    });
}

function start(mail, password) {
    return new Promise(function (resolve, reject) {
        _loggedUser = null;
        _sessionToken = null;

        var data = {};

        preferences.load().then(function () {
            return login(mail, password);
        }).then(function (response) {
            preferences.set("session.type", TYPE_MAIL);
            preferences.set("session.mail", mail);
            preferences.set("session.password", password);

            _sessionToken = response.token;
            _loggedUser = response.user;

            return preferences.save();
        }).then(function (r) {
            resolve(_loggedUser);
        }).catch(function (e) {
            _loggedUser = null;
            _sessionToken = null;

            preferences.load().then(function () {
                preferences.set("session.type", null);
                preferences.set("session.mail", null);
                preferences.set("session.password", null);
                return preferences.save();
            }).catch(function (e) {
                logger.e(e);
            });

            reject(e);
        });
    });
}

function resume() {
    return new Promise(function (resolve, reject) {
        _loggedUser = null;
        _sessionToken = null;

        preferences.load().then(function () {
            var type = preferences.get("session.type");
            var mail = preferences.get("session.mail");
            var password = preferences.get("session.password");

            if (type == TYPE_MAIL && mail && password) {
                return start(mail, password);
            } else {
                reject(responses.ERROR);
                return stop();
            }
        }).then(function (r) {
            return wrap(r, function () {
                resolve(r);
            });
        }).catch(function (e) {
            reject(e);
        });
    });
}

function destroy() {
    _loggedUser = null;
    _sessionToken = null;

    return preferences.load().then(function () {
        preferences.set("session.type", null);
        preferences.set("session.mail", null);
        preferences.set("session.password", null);
        return preferences.save();
    }).catch(function (e) {
        logger.e(e);
    });
}

function getLoggedUser() {
    return _loggedUser;
}

function isLoggedIn() {
    return _loggedUser != null;
}

function getSessionToken() {
    return _sessionToken;
}