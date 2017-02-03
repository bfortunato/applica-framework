"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = {};
EventEmitter.addListener = function (obj, evt, handler) {
    var listeners = obj.__events_listeners;
    if (!listeners) {
        listeners = {};
        obj.__events_listeners = listeners;
    }

    if (!listeners[evt]) {
        listeners[evt] = [];
    }

    listeners[evt].push(handler);
};

EventEmitter.addListeners = function (obj, listeners) {
    for (var key in listeners) {
        events.addListener(obj, key, listeners[key]);
    }
};

EventEmitter.removeListener = function (obj, evt, listener) {
    if (obj.__events_listeners && obj.__events_listeners[evt]) {
        obj.__events_listeners[evt] = obj.__events_listeners[evt].filter(function (l) {
            return l != listener;
        });
    }
};

EventEmitter.on = function (obj, evt, handler) {
    if ($.isPlainObject(evt)) {
        EventEmitter.addListeners(obj, evt);
    } else {
        EventEmitter.addListener(obj, evt, handler);
    }
};

EventEmitter.live = function (obj, evt) {
    if (!obj.__events_offs) obj.__events_offs = {};
    if (evt) {
        obj.__events_offs[evt] = false;
    } else {
        obj.__events_off = false;
    }
};

EventEmitter.die = function (obj, evt) {
    if (!obj.__events_offs) obj.__events_offs = {};
    if (evt) {
        obj.__events_offs[evt] = true;
    } else {
        obj.__events_off = true;
    }
};

EventEmitter.invoke = function (obj, evt) {
    if (!obj.__events_offs) obj.__events_offs = {};
    if (obj.__events_off) return;
    if (obj.__events_offs[evt]) return;

    var listeners = obj.__events_listeners;
    if (!listeners) {
        listeners = {};
        obj.__events_listeners = listeners;
    }

    var handlers = listeners[evt];
    if (handlers) {
        var size = handlers.length;
        for (var i = 0; i < size; i++) {
            var h = handlers[i];
            h.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
    }
};

var Observable = function () {
    function Observable() {
        _classCallCheck(this, Observable);
    }

    _createClass(Observable, [{
        key: "addListener",
        value: function addListener(evt, handler) {
            EventEmitter.addListener(this, evt, handler);
        }
    }, {
        key: "addListeners",
        value: function addListeners(listeners) {
            EventEmitter.addListeners(this, listeners);
        }
    }, {
        key: "removeListener",
        value: function removeListener(evt, handler) {
            EventEmitter.removeListener(evt, handler);
        }
    }, {
        key: "on",
        value: function on(evt, fn) {
            EventEmitter.on(this, evt, fn);
        }
    }, {
        key: "live",
        value: function live(evt) {
            EventEmitter.live(this, evt);
        }
    }, {
        key: "die",
        value: function die(evt) {
            EventEmitter.die(this, evt);
        }
    }, {
        key: "invoke",
        value: function invoke(evt) {
            Array.prototype.splice.call(arguments, 0, 0, this);
            EventEmitter.invoke.apply(this, arguments);
        }
    }]);

    return Observable;
}();

exports.EventEmitter = EventEmitter;
exports.Observable = Observable;