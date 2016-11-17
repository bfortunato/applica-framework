"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.home = undefined;

var _aj = require("../aj");

var aj = _interopRequireWildcard(_aj);

var _types = require("./types");

var types = _interopRequireWildcard(_types);

var _types2 = require("../actions/types");

var actions = _interopRequireWildcard(_types2);

var _underscore = require("../libs/underscore");

var _ = _interopRequireWildcard(_underscore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initialState = {
    message: null
};

var home = exports.home = aj.createStore(types.HOME, function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];


    switch (action.type) {
        case actions.GET_MESSAGE:
            return _.assign(state, { message: action.message });
    }
});