"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.post = post;
exports.get = get;

var _http = require("../aj/http");

var http = _interopRequireWildcard(_http);

var _responses = require("./responses");

var responses = _interopRequireWildcard(_responses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function post(url, data) {
    return new Promise(function (resolve, reject) {
        http.post(url, data).then(function (json) {
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
            logger.e("Error in request:", e);
            reject(responses.ERROR);
        });
    });
}

function get(url, data) {
    return new Promise(function (resolve, reject) {
        http.get(url, data).then(function (json) {
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
            logger.e("Error in request:", e);
            reject(responses.ERROR);
        });
    });
}