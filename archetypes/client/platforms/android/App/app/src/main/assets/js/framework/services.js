"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceLocator = function () {
    _createClass(ServiceLocator, null, [{
        key: "instance",
        value: function instance() {
            if (!ServiceLocator.__instance) {
                ServiceLocator.__instance = new ServiceLocator("applica");
            }

            return ServiceLocator.__instance;
        }
    }]);

    function ServiceLocator(pwd) {
        _classCallCheck(this, ServiceLocator);

        if (pwd != "applica") {
            throw new Error("ServiceLocator is a singleton. Please use ServiceLocator.instance()");
        }

        this.services = {};
    }

    _createClass(ServiceLocator, [{
        key: "register",
        value: function register(type, builder) {
            this.services[type] = builder;
        }
    }, {
        key: "getService",
        value: function getService(type) {
            if (this.services[type] && _typeof(this.services[type] == "function")) {
                return this.services[type]();
            }

            throw new Error("Service not registered: " + type);
        }
    }]);

    return ServiceLocator;
}();

exports.ServiceLocator = ServiceLocator;

exports.get = function (type) {
    return ServiceLocator.instance().getService(type);
};