"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var storage = require("../aj/storage");

var Preferences = function () {
    _createClass(Preferences, null, [{
        key: "instance",
        value: function instance() {
            if (!Preferences._instance) {
                Preferences._instance = new Preferences();
            }

            return Preferences._instance;
        }
    }]);

    function Preferences() {
        _classCallCheck(this, Preferences);

        this.path = "preferences.json";
        this.data = {};
    }

    _createClass(Preferences, [{
        key: "load",
        value: function load() {
            var _this = this;

            logger.i("Loading preferences...");

            this.data = {};

            return new Promise(function (resolve, reject) {
                storage.exists(_this.path).then(function (exists) {
                    if (exists) {
                        return storage.readText(_this.path).then(function (content) {
                            logger.i("Preferences:", content);
                            try {
                                _this.data = JSON.parse(content);
                            } catch (e) {}
                            resolve(_this);
                        });
                    } else {
                        resolve(_this);
                    }
                }).catch(function (e) {
                    return reject(e);
                });
            });
        }
    }, {
        key: "get",
        value: function get(key) {
            return this.data[key];
        }
    }, {
        key: "set",
        value: function set(key, value) {
            this.data[key] = value;
        }
    }, {
        key: "save",
        value: function save() {
            var _this2 = this;

            logger.i("Saving preferences", JSON.stringify(this.data));
            return new Promise(function (resolve, reject) {
                storage.writeText(_this2.path, JSON.stringify(_this2.data)).then(function () {
                    resolve();
                }).catch(function (e) {
                    return reject(e);
                });
            });
        }
    }, {
        key: "clear",
        value: function clear() {
            this.data = {};
        }
    }]);

    return Preferences;
}();

exports.Preferences = Preferences;

exports.load = function () {
    return Preferences.instance().load();
};

exports.get = function (key) {
    return Preferences.instance().get(key);
};

exports.set = function (key, value) {
    return Preferences.instance().set(key, value);
};

exports.save = function () {
    return Preferences.instance().save();
};

exports.clear = function () {
    return Preferences.instance().clear();
};