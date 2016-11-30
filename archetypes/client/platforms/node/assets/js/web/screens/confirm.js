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
var forms = require("../utils/forms");

var _require2 = require("../../actions"),
    setActivationCode = _require2.setActivationCode,
    confirmAccount = _require2.confirmAccount;

var Recover = function (_Screen) {
    _inherits(Recover, _Screen);

    function Recover(props) {
        _classCallCheck(this, Recover);

        var _this = _possibleConstructorReturn(this, (Recover.__proto__ || Object.getPrototypeOf(Recover)).call(this, props));

        (0, _aj.connect)(_this, AccountStore, { activationCode: "" });
        return _this;
    }

    _createClass(Recover, [{
        key: "confirm",
        value: function confirm() {
            var data = forms.serialize(this.refs.confirm_form);
            confirmAccount(data);
        }
    }, {
        key: "componentWillUpdate",
        value: function componentWillUpdate(props, state) {
            if (state.confirmed) {
                ui.navigate("/");
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            setActivationCode({ activationCode: this.props.activationCode });
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
                        { className: "lc-block toggled", id: "l-forget-password" },
                        React.createElement(
                            "form",
                            { action: "javascript:;", className: "lcb-form", onSubmit: this.confirm.bind(this), ref: "confirm_form" },
                            React.createElement(
                                "p",
                                { className: "text-left" },
                                _strings2.default.accountConfirmText
                            ),
                            React.createElement(
                                "div",
                                { className: "input-group m-b-20" },
                                React.createElement(
                                    "span",
                                    { className: "input-group-addon" },
                                    React.createElement("i", { className: "zmdi zmdi-lock" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "fg-line" },
                                    React.createElement("input", { type: "text", name: "activationCode", className: "form-control", placeholder: _strings2.default.activationCode, value: this.state.activationCode })
                                )
                            ),
                            React.createElement(
                                "button",
                                { type: "submit", className: "btn btn-login btn-success btn-float animated fadeInLeft" },
                                React.createElement("i", { className: "zmdi zmdi-lock-open" })
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
                                { href: "#register", "data-ma-block": "#l-register" },
                                React.createElement("i", { className: "zmdi zmdi-plus" }),
                                " ",
                                React.createElement(
                                    "span",
                                    null,
                                    _strings2.default.register
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Recover;
}(Screen);

exports.default = Recover;