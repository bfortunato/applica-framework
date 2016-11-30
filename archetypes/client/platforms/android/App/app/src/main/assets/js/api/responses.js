"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.msg = msg;
var OK = exports.OK = 0;
var ERROR = exports.ERROR = 1;
var UNAUTHORIZED = exports.UNAUTHORIZED = 2;

var ERROR_MAIL_ALREADY_EXISTS = exports.ERROR_MAIL_ALREADY_EXISTS = 1001;
var ERROR_MAIL_NOT_FOUND = exports.ERROR_MAIL_NOT_FOUND = 1002;
var ERROR_BAD_CREDENTIALS = exports.ERROR_BAD_CREDENTIALS = 1003;
var ERROR_TOKEN_GENERATION = exports.ERROR_TOKEN_GENERATION = 1004;
var ERROR_TOKEN_FORMAT = exports.ERROR_TOKEN_FORMAT = 1005;
var ERROR_MAIL_NOT_VALID = exports.ERROR_MAIL_NOT_VALID = 1006;
var ERROR_PASSWORD_NOT_VALID = exports.ERROR_PASSWORD_NOT_VALID = 1007;
var ERROR_VALIDATION = exports.ERROR_VALIDATION = 1008;

var messages = {};
messages[OK] = "OK";
messages[ERROR] = "Generic error";
messages[UNAUTHORIZED] = "Unauthorized";
messages[ERROR_MAIL_ALREADY_EXISTS] = "Mail already exists";
messages[ERROR_MAIL_NOT_FOUND] = "Mail not found";
messages[ERROR_BAD_CREDENTIALS] = "Bad mail or password";
messages[ERROR_TOKEN_GENERATION] = "Error generating token";
messages[ERROR_TOKEN_FORMAT] = "Bad token format";
messages[ERROR_MAIL_NOT_VALID] = "Mail not valid";
messages[ERROR_PASSWORD_NOT_VALID] = "Password not valid";
messages[ERROR_VALIDATION] = "Please check your data and try again";

function msg(code) {
    if (_.has(messages, code)) {
        return messages[code];
    }

    return "Code: = " + code;
}