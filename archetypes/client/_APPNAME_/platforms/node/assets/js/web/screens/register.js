"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strings = require("../../strings");

var _strings2 = _interopRequireDefault(_strings);

var _aj = require("../utils/aj");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AccountStore = require("../../stores").account;

var _require = require("../components/layout"),
    FullScreenLayout = _require.FullScreenLayout,
    Screen = _require.Screen;

var ui = require("../utils/ui");

var _require2 = require("../../actions"),
    _register = _require2.register;

var forms = require("../utils/forms");

var Register = function (_Screen) {
    _inherits(Register, _Screen);

    function Register(props) {
        _classCallCheck(this, Register);

        var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, props));

        (0, _aj.connect)(_this, AccountStore);
        return _this;
    }

    _createClass(Register, [{
        key: "register",
        value: function register() {
            var data = forms.serialize(this.refs.register_form);
            _register(data);
        }
    }, {
        key: "componentWillUpdate",
        value: function componentWillUpdate(props, state) {
            if (state.registered) {
                ui.navigate("/registrationComplete");
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                FullScreenLayout,
                null,
                React.createElement(
                    "div",
                    { className: "login-content" },
                    React.createElement(
                        "div",
                        { className: "lc-block toggled", id: "l-register" },
                        React.createElement(
                            "form",
                            { action: "javascript:;", className: "lcb-form", onSubmit: this.register.bind(this), ref: "register_form" },
                            React.createElement(
                                "div",
                                { className: "input-group m-b-20" },
                                React.createElement(
                                    "span",
                                    { className: "input-group-addon" },
                                    React.createElement("i", { className: "zmdi zmdi-account" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "fg-line" },
                                    React.createElement("input", { type: "text", name: "name", className: "form-control", placeholder: _strings2.default.name })
                                )
                            ),
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
                                "button",
                                { type: "submit", className: "btn btn-login btn-success btn-float animated fadeInLeft" },
                                React.createElement("i", { className: "zmdi zmdi-check" })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "lcb-navigation" },
                            React.createElement(
                                "a",
                                { href: "#login", "data-ma-block": "#l-login" },
                                React.createElement("i", { className: "zmdi zmdi-long-arrow-right" }),
                                " ",
                                React.createElement(
                                    "span",
                                    null,
                                    _strings2.default.signIn
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

    return Register;
}(Screen);

exports.default = Register;