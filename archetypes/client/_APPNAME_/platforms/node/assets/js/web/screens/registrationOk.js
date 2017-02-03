"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AccountStore = require("../../stores").account;

var _require = require("../components/layout"),
    FullScreenLayout = _require.FullScreenLayout,
    Screen = _require.Screen;

var ui = require("../utils/ui");

var _require2 = require("../../actions"),
    login = _require2.login;

var forms = require("../utils/forms");

var _require3 = require("../components/loader"),
    Preloader = _require3.Preloader;

var _require4 = require("../utils/aj"),
    connect = _require4.connect;

var strings = require("../../strings");

var RegistrationOk = function (_Screen) {
    _inherits(RegistrationOk, _Screen);

    function RegistrationOk(props) {
        _classCallCheck(this, RegistrationOk);

        var _this = _possibleConstructorReturn(this, (RegistrationOk.__proto__ || Object.getPrototypeOf(RegistrationOk)).call(this, props));

        connect(_this, AccountStore);
        return _this;
    }

    _createClass(RegistrationOk, [{
        key: "goHome",
        value: function goHome() {
            ui.navigate("/");
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
                        { className: "lc-block toggled", id: "l-login" },
                        React.createElement(
                            "div",
                            { className: "text-center m-b-10" },
                            React.createElement("img", { src: "resources/images/logo.png" })
                        ),
                        React.createElement(
                            "div",
                            { className: "jumbotron" },
                            React.createElement(
                                "h1",
                                null,
                                strings.congratulations,
                                "!"
                            ),
                            React.createElement(
                                "p",
                                null,
                                this.state.welcomeMessage
                            ),
                            React.createElement(
                                "p",
                                null,
                                React.createElement(
                                    "a",
                                    { className: "btn btn-primary btn-lg waves-effect", href: "javascript:;", onClick: this.goHome.bind(this), role: "button" },
                                    strings.continue
                                )
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
                                    strings.register
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
                                    strings.forgotPassword
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return RegistrationOk;
}(Screen);

exports.default = RegistrationOk;