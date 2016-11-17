"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMessage = undefined;

var _types = require("./types");

var types = _interopRequireWildcard(_types);

var _aj = require("../aj");

var aj = _interopRequireWildcard(_aj);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getMessage = exports.getMessage = aj.createAction(types.GET_MESSAGE, function (data) {
    aj.dispatch({
        type: types.GET_MESSAGE,
        message: "Hello World"
    });
});