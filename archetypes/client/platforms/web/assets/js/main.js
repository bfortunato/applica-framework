"use strict";

var _layout = require("./components/layout");

var _login = require("./screens/login");

var _login2 = _interopRequireDefault(_login);

var _register = require("./screens/register");

var _register2 = _interopRequireDefault(_register);

var _recover = require("./screens/recover");

var _recover2 = _interopRequireDefault(_recover);

var _home = require("./screens/home");

var _home2 = _interopRequireDefault(_home);

var _ui = require("./utils/ui");

var ui = _interopRequireWildcard(_ui);

var _pluginsimpl = require("./pluginsimpl");

var plugins = _interopRequireWildcard(_pluginsimpl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Register plugins */
plugins.register();

/* Login routes */
ui.addRoute("/login", function (params) {
  return ui.changeScreen(React.createElement(_login2.default, null));
});
ui.addRoute("/register", function (params) {
  return ui.changeScreen(React.createElement(_register2.default, null));
});
ui.addRoute("/recover", function (params) {
  return ui.changeScreen(React.createElement(_recover2.default, null));
});

/* home route */
ui.addRoute("/", function (params) {
  return ui.changeScreen(React.createElement(_home2.default, null));
});

ReactDOM.render(React.createElement(_layout.Index, null), document.getElementById("entry-point"));

ui.startNavigation();