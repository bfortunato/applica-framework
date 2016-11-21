"use strict";

var _index = require("components/index");

var _login = require("screens/login");

var _login2 = _interopRequireDefault(_login);

var _ui = require("utils/ui");

var ui = _interopRequireWildcard(_ui);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

alert("main");

ReactDOM.render(React.createElement(_index.Index, null), document.getElementById("entry-point"));

ui.addRoute("login", function (params) {
  return ui.changeScreen(React.createElement(_login2.default, null));
});