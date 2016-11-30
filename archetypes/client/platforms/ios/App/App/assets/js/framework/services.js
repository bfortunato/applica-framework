"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;
exports.register = register;

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
        value: function register(type, fn) {
            this.services[type] = fn;
        }
    }, {
        key: "getService",
        value: function getService(type) {
            if (this.services[type]) {
                return this.services[type];
            }

            throw new Error("Service not registered: " + type);
        }
    }]);

    return ServiceLocator;
}();

function get(type) {
    return ServiceLocator.instance().getService(type);
}

function register(type, fn) {
    ServiceLocator.instance().register(type, fn);
}