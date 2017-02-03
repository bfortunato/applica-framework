"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.start = start;
exports.resume = resume;
exports.getLoggedUser = getLoggedUser;
exports.isLoggedIn = isLoggedIn;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var aj = require("../aj");
var http = require("../aj/http");

var services = require("./services");
var preferences = require("./preferences");
var config = require("./config");

var loggedUser = null;

var TYPE_MAIL = exports.TYPE_MAIL = "MAIL";
var TYPE_FACEBOOK = exports.TYPE_FACEBOOK = "FACEBOOK";

var RestSessionService = function () {
    function RestSessionService() {
        _classCallCheck(this, RestSessionService);
    }

    _createClass(RestSessionService, [{
        key: "login",
        value: function login(mail, password) {
            return new Promise(function (resolve, reject) {
                http.post(config.get("login.url"), { mail: mail, password: password }).then(function (response) {
                    if (response.error) {
                        throw new Error(response.message);
                    }

                    resolve(response.value);
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }]);

    return RestSessionService;
}();

function start(mail, password) {
    return new Promise(function (resolve, reject) {
        loggedUser = null;

        var sessionService = services.get("SessionService");
        sessionService.login(mail, password).then(function (response) {
            preferences.load().then(function () {
                preferences.set("session.type", TYPE_MAIL);
                preferences.set("session.mail", mail);
                preferences.set("session.password", password);
                preferences.save();
            });

            loggedUser = {
                type: TYPE_MAIL,
                mail: mail,
                data: response
            };
        }).catch(function () {
            loggedUser = null;

            preferences.load().then(function () {
                preferences.set("session.type", false);
                preferences.set("session.mail", false);
                preferences.set("session.password", false);
                preferences.save();
            });
            reject("Cannot login");
        });
    });
}

function resume() {
    var _this = this;

    return new Promise(function (resolve, reject) {
        loggedUser = null;

        preferences.load().then(function (preferences) {
            var type = preferences.get("session.type");
            var mail = preferences.get("session.mail");
            var password = preferences.get("session.password");

            if (type == Session.TYPE_MAIL && mail && password) {
                return _this.start(mail, password);
            } else {
                reject("Cannot resume session");
            }
        });
    });
}

function getLoggedUser() {
    return loggedUser;
}

function isLoggedIn() {
    return loggedUser != null;
}

exports.RestSessionService = RestSessionService;