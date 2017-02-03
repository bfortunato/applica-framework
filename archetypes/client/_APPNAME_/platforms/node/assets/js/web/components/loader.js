"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageLoader = function (_React$Component) {
    _inherits(PageLoader, _React$Component);

    function PageLoader() {
        _classCallCheck(this, PageLoader);

        return _possibleConstructorReturn(this, (PageLoader.__proto__ || Object.getPrototypeOf(PageLoader)).apply(this, arguments));
    }

    _createClass(PageLoader, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.state.loading) {
                $(this.refs.page_loader).show();
            } else {
                $(this.refs.page_loader).fadeOut(500);
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "page-loader", style: { display: "block" } },
                React.createElement(
                    "div",
                    { className: "preloader" },
                    React.createElement(
                        "svg",
                        { className: "pl-circular", viewBox: "25 25 50 50" },
                        React.createElement("circle", { className: "plc-path", cx: "50", cy: "50", r: "20" })
                    ),
                    React.createElement(
                        "p",
                        null,
                        "Please wait..."
                    )
                )
            );
        }
    }]);

    return PageLoader;
}(React.Component);

var GlobalLoader = function (_React$Component2) {
    _inherits(GlobalLoader, _React$Component2);

    function GlobalLoader() {
        _classCallCheck(this, GlobalLoader);

        return _possibleConstructorReturn(this, (GlobalLoader.__proto__ || Object.getPrototypeOf(GlobalLoader)).apply(this, arguments));
    }

    _createClass(GlobalLoader, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "global-loader", style: { display: "none" } },
                React.createElement("div", { className: "layer" }),
                React.createElement(
                    "div",
                    { className: "preloader" },
                    React.createElement(
                        "svg",
                        { className: "pl-circular", viewBox: "25 25 50 50" },
                        React.createElement("circle", { className: "plc-path", cx: "50", cy: "50", r: "20" })
                    )
                ),
                React.createElement(
                    "p",
                    { className: "message" },
                    "Please wait..."
                )
            );
        }
    }]);

    return GlobalLoader;
}(React.Component);

var Preloader = function (_React$Component3) {
    _inherits(Preloader, _React$Component3);

    function Preloader() {
        _classCallCheck(this, Preloader);

        return _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).apply(this, arguments));
    }

    _createClass(Preloader, [{
        key: "render",
        value: function render() {
            return this.props.visible || true ? React.createElement(
                "div",
                { className: "preloader" },
                React.createElement(
                    "svg",
                    { className: "pl-circular", viewBox: "25 25 50 50" },
                    React.createElement("circle", { className: "plc-path", cx: "50", cy: "50", r: "20" })
                )
            ) : null;
        }
    }]);

    return Preloader;
}(React.Component);

exports.PageLoader = PageLoader;
exports.GlobalLoader = GlobalLoader;
exports.Preloader = Preloader;