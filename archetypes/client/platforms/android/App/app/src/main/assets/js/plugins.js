"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alert = alert;
exports.confirm = confirm;
exports.showLoader = showLoader;
exports.hideLoader = hideLoader;
exports.toast = toast;

var _aj = require("../aj");

var aj = _interopRequireWildcard(_aj);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function alert(title, message, type) {
    return aj.exec("Alert", "alert", { title: title, message: message, type: type });
}

function confirm() {
    return new Promise(function (resolve, reject) {
        var callback = function callback(confirmed) {
            if (confirmed) {
                resolve();
            } else {
                reject();
            }
        };

        aj.exec("Alert", "confirm", { callback: callback }).catch(function () {
            return reject();
        });
    });
}

function showLoader() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    aj.exec("Loader", "show", { message: message });
}

function hideLoader() {
    aj.exec("Loader", "hide");
}

function toast(message) {
    aj.exec("Toast", "show", { message: message });
}