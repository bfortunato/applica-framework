"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layout = require("../components/layout");

var _actions = require("../../actions");

var _forms = require("../utils/forms");

var forms = _interopRequireWildcard(_forms);

var _strings = require("../../strings");

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_Screen) {
    _inherits(Login, _Screen);

    function Login() {
        _classCallCheck(this, Login);

        return _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).apply(this, arguments));
    }

    _createClass(Login, [{
        key: "login",
        value: function login() {
            var data = forms.serialize(this.refs.login_form);
            (0, _actions.login)(data);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                _layout.FullScreenLayout,
                null,
                React.createElement(
                    "div",
                    { className: "login-content" },
                    React.createElement(
                        "div",
                        { className: "lc-block toggled", id: "l-login" },
                        React.createElement(
                            "div",
                            { className: "text-center m-b-10" },
                            React.createElement("img", { src: "resources/images/logo.png" })
                        ),
                        React.createElement(
                            "form",
                            { action: "javascript:", className: "lcb-form", onSubmit: this.login.bind(this), ref: "login_form" },
                            React.createElement(
                                "div",
                                { className: "input-group m-b-20" },
                                React.createElement(
                                    "span",
                                    { className: "input-group-addon" },
                                    React.createElement("i", { className: "zmdi zmdi-email" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "fg-line" },
                                    React.createElement("input", { type: "email", name: "mail", className: "form-control", placeholder: _strings2.default.mailAddress })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "input-group m-b-20" },
                                React.createElement(
                                    "span",
                                    { className: "input-group-addon" },
                                    React.createElement("i", { className: "zmdi zmdi-male" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "fg-line" },
                                    React.createElement("input", { type: "password", name: "password", className: "form-control", placeholder: _strings2.default.password })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "checkbox" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "checkbox", name: "remember_me", value: "1" }),
                                    React.createElement("i", { className: "input-helper" }),
                                    "Keep me signed in"
                                )
                            ),
                            React.createElement(
                                "button",
                                { type: "submit", className: "btn btn-login btn-success btn-float animated fadeInLeft" },
                                React.createElement("i", { className: "zmdi zmdi-arrow-forward" })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "lcb-navigation" },
                            React.createElement(
                                "a",
                                { href: "#register", "data-ma-block": "#l-register" },
                                React.createElement("i", { className: "zmdi zmdi-plus" }),
                                " ",
                                React.createElement(
                                    "span",
                                    null,
                                    _strings2.default.register
                                )
                            ),
                            React.createElement(
                                "a",
                                { href: "#recover", "data-ma-block": "#l-forget-password" },
                                React.createElement(
                                    "i",
                                    null,
                                    "?"
                                ),
                                " ",
                                React.createElement(
                                    "span",
                                    null,
                                    _strings2.default.forgotPassword
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Login;
}(_layout.Screen);

exports.default = Login;