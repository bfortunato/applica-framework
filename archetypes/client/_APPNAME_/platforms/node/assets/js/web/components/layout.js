"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lang = require("../../utils/lang");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SessionStore = require("../../stores").session;

var _require = require("../../actions"),
    _logout = _require.logout;

var ui = require("../utils/ui");

var _require2 = require("./loader"),
    PageLoader = _require2.PageLoader,
    GlobalLoader = _require2.GlobalLoader;

var _require3 = require("../utils/aj"),
    connect = _require3.connect;

function showPageLoader() {
    $(".page-loader").show();
}

function hidePageLoader() {
    $(".page-loader").fadeOut(500);
}

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    _createClass(Header, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "header",
                { id: "header", className: "clearfix", "data-ma-theme": "blue" },
                React.createElement(
                    "ul",
                    { className: "h-inner" },
                    React.createElement(
                        "li",
                        { className: "hi-trigger ma-trigger", "data-ma-action": "sidebar-open", "data-ma-target": "#sidebar" },
                        React.createElement(
                            "div",
                            { className: "line-wrap" },
                            React.createElement("div", { className: "line top" }),
                            React.createElement("div", { className: "line center" }),
                            React.createElement("div", { className: "line bottom" })
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "hi-logo hidden-xs" },
                        React.createElement(
                            "a",
                            { href: "index.html" },
                            "_APPNAME_"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "pull-right" },
                        React.createElement(
                            "ul",
                            { className: "hi-menu" },
                            React.createElement(
                                "li",
                                { "data-ma-action": "search-open" },
                                React.createElement(
                                    "a",
                                    { href: "" },
                                    React.createElement("i", { className: "him-icon zmdi zmdi-search" })
                                )
                            ),
                            React.createElement(
                                "li",
                                { className: "dropdown" },
                                React.createElement(
                                    "a",
                                    { "data-toggle": "dropdown", href: "" },
                                    React.createElement("i", { className: "him-icon zmdi zmdi-more-vert" })
                                ),
                                React.createElement(
                                    "ul",
                                    { className: "dropdown-menu pull-right" },
                                    React.createElement(
                                        "li",
                                        { className: "hidden-xs" },
                                        React.createElement(
                                            "a",
                                            { "data-ma-action": "fullscreen", href: "" },
                                            "Toggle Fullscreen"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "" },
                                            "Privacy Settings"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "" },
                                            "Other Settings"
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "h-search-wrap" },
                    React.createElement(
                        "div",
                        { className: "hsw-inner" },
                        React.createElement("i", { className: "hsw-close zmdi zmdi-arrow-left", "data-ma-action": "search-close" }),
                        React.createElement("input", { type: "text" })
                    )
                )
            );
        }
    }]);

    return Header;
}(React.Component);

var ProfileBox = function (_React$Component2) {
    _inherits(ProfileBox, _React$Component2);

    function ProfileBox(props) {
        _classCallCheck(this, ProfileBox);

        var _this2 = _possibleConstructorReturn(this, (ProfileBox.__proto__ || Object.getPrototypeOf(ProfileBox)).call(this, props));

        connect(_this2, SessionStore);
        return _this2;
    }

    _createClass(ProfileBox, [{
        key: "logout",
        value: function logout() {
            _logout();
            ui.navigate("/login");
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { className: "s-profile" },
                React.createElement(
                    "a",
                    { href: "", "data-ma-action": "profile-menu-toggle" },
                    React.createElement(
                        "div",
                        { className: "sp-pic" },
                        React.createElement("img", { src: "theme/img/demo/profile-pics/1.jpg", alt: "" })
                    ),
                    React.createElement(
                        "div",
                        { className: "sp-info" },
                        (0, _lang.optional)(function () {
                            return _this3.state.user.name;
                        }, "NA"),
                        React.createElement("i", { className: "zmdi zmdi-caret-down" })
                    )
                ),
                React.createElement(
                    "ul",
                    { className: "main-menu" },
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            React.createElement("i", { className: "zmdi zmdi-account" }),
                            " View Profile"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            React.createElement("i", { className: "zmdi zmdi-input-antenna" }),
                            " Privacy Settings"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            React.createElement("i", { className: "zmdi zmdi-settings" }),
                            " Settings"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "javascript:", onClick: this.logout.bind(this) },
                            React.createElement("i", { className: "zmdi zmdi-time-restore" }),
                            " Logout"
                        )
                    )
                )
            );
        }
    }]);

    return ProfileBox;
}(React.Component);

var SideBar = function (_React$Component3) {
    _inherits(SideBar, _React$Component3);

    function SideBar() {
        _classCallCheck(this, SideBar);

        return _possibleConstructorReturn(this, (SideBar.__proto__ || Object.getPrototypeOf(SideBar)).apply(this, arguments));
    }

    _createClass(SideBar, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "aside",
                { id: "sidebar", className: "sidebar c-overflow" },
                React.createElement(ProfileBox, null),
                React.createElement(
                    "ul",
                    { className: "main-menu" },
                    React.createElement(
                        "li",
                        { className: "active" },
                        React.createElement(
                            "a",
                            { href: "index.html" },
                            React.createElement("i", { className: "zmdi zmdi-home" }),
                            " Home"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "theme/typography.html" },
                            React.createElement("i", { className: "zmdi zmdi-format-underlined" }),
                            " Typography"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "theme/tables.html" },
                            React.createElement("i", { className: "zmdi zmdi-view-list" }),
                            " Tables"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "theme/form-elements.html" },
                            React.createElement("i", { className: "zmdi zmdi-collection-text" }),
                            " Form Elements"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "theme/buttons.html" },
                            React.createElement("i", { className: "zmdi zmdi-crop-16-9" }),
                            " Buttons"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "theme/icons.html" },
                            React.createElement("i", { className: "zmdi zmdi-airplane" }),
                            "Icons"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "sub-menu" },
                        React.createElement(
                            "a",
                            { href: "", "data-ma-action": "submenu-toggle" },
                            React.createElement("i", { className: "zmdi zmdi-collection-item" }),
                            " Sample Pages"
                        ),
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "theme/login.html" },
                                    "Login and Sign Up"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "theme/lockscreen.html" },
                                    "Lockscreen"
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "theme/404.html" },
                                    "Error 404"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "sub-menu" },
                        React.createElement(
                            "a",
                            { href: "", "data-ma-action": "submenu-toggle" },
                            React.createElement("i", { className: "zmdi zmdi-menu" }),
                            " 3 Level Menu"
                        ),
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "theme/form-elements.html" },
                                    "Level 2 link"
                                )
                            ),
                            React.createElement(
                                "li",
                                { className: "sub-menu" },
                                React.createElement(
                                    "a",
                                    { href: "", "data-ma-action": "submenu-toggle" },
                                    "I have children too"
                                ),
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "" },
                                            "Level 3 link"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "" },
                                            "Another Level 3 link"
                                        )
                                    ),
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "a",
                                            { href: "" },
                                            "Third one"
                                        )
                                    )
                                )
                            ),
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "" },
                                    "One more 2"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SideBar;
}(React.Component);

var Footer = function (_React$Component4) {
    _inherits(Footer, _React$Component4);

    function Footer() {
        _classCallCheck(this, Footer);

        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    _createClass(Footer, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "footer",
                { id: "footer" },
                "Copyright &copy 2016 Applica srl",
                React.createElement(
                    "ul",
                    { className: "f-menu" },
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            "Home"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            "Dashboard"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            "Reports"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            "Support"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "" },
                            "Contact"
                        )
                    )
                )
            );
        }
    }]);

    return Footer;
}(React.Component);

var Layout = function (_React$Component5) {
    _inherits(Layout, _React$Component5);

    function Layout() {
        _classCallCheck(this, Layout);

        return _possibleConstructorReturn(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).apply(this, arguments));
    }

    _createClass(Layout, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Header, null),
                React.createElement(
                    "section",
                    { id: "main" },
                    React.createElement(SideBar, null),
                    React.createElement(
                        "section",
                        { id: "content" },
                        React.createElement(
                            "div",
                            { className: "container" },
                            this.props.children
                        )
                    )
                ),
                React.createElement(Footer, null)
            );
        }
    }]);

    return Layout;
}(React.Component);

var FullScreenLayout = function (_React$Component6) {
    _inherits(FullScreenLayout, _React$Component6);

    function FullScreenLayout() {
        _classCallCheck(this, FullScreenLayout);

        return _possibleConstructorReturn(this, (FullScreenLayout.__proto__ || Object.getPrototypeOf(FullScreenLayout)).apply(this, arguments));
    }

    _createClass(FullScreenLayout, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                this.props.children
            );
        }
    }]);

    return FullScreenLayout;
}(React.Component);

var ScreenContainer = function (_React$Component7) {
    _inherits(ScreenContainer, _React$Component7);

    function ScreenContainer(props) {
        _classCallCheck(this, ScreenContainer);

        var _this8 = _possibleConstructorReturn(this, (ScreenContainer.__proto__ || Object.getPrototypeOf(ScreenContainer)).call(this, props));

        _this8.state = {
            currentScreen: null
        };
        return _this8;
    }

    _createClass(ScreenContainer, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this9 = this;

            ui.addScreenChangeListener(function (screen) {
                //showPageLoader();
                _this9.setState(_.assign(_this9.state, { currentScreen: screen }));
                //hidePageLoader();
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (_.isEmpty(this.state.currentScreen)) {
                return React.createElement("div", null);
            }
            return this.state.currentScreen;
        }
    }]);

    return ScreenContainer;
}(React.Component);

var Screen = function (_React$Component8) {
    _inherits(Screen, _React$Component8);

    function Screen() {
        _classCallCheck(this, Screen);

        return _possibleConstructorReturn(this, (Screen.__proto__ || Object.getPrototypeOf(Screen)).apply(this, arguments));
    }

    return Screen;
}(React.Component);

var Index = function (_React$Component9) {
    _inherits(Index, _React$Component9);

    function Index(props) {
        _classCallCheck(this, Index);

        var _this11 = _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).call(this, props));

        _this11.state = {};
        return _this11;
    }

    _createClass(Index, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(PageLoader, null),
                React.createElement(GlobalLoader, null),
                React.createElement(ScreenContainer, null)
            );
        }
    }]);

    return Index;
}(React.Component);

exports.Index = Index;
exports.Screen = Screen;
exports.FullScreenLayout = FullScreenLayout;
exports.Layout = Layout;
exports.Header = Header;
exports.Footer = Footer;