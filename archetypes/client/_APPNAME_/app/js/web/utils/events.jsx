let EventEmitter = {}
EventEmitter.addListener = function(obj, evt, handler) {
    let listeners = obj.__events_listeners;
    if(!listeners) {
        listeners = {};
        obj.__events_listeners = listeners;
    }

    if(!listeners[evt]) {
        listeners[evt] = [];
    }

    listeners[evt].push(handler);
};

EventEmitter.addListeners = function(obj, listeners) {
    for(let key in listeners) {
        events.addListener(obj, key, listeners[key]);
    }
};

EventEmitter.removeListener = function(obj, evt, listener) {
    if (obj.__events_listeners && obj.__events_listeners[evt]) {
        obj.__events_listeners[evt] = obj.__events_listeners[evt].filter(l => l != listener);
    }
};

EventEmitter.on = function(obj, evt, handler) {
    if($.isPlainObject(evt)) {
        EventEmitter.addListeners(obj, evt);
    } else {
        EventEmitter.addListener(obj, evt, handler);
    }
};

EventEmitter.live = function(obj, evt) {
    if(!obj.__events_offs) obj.__events_offs = {};
    if(evt) {
        obj.__events_offs[evt] = false;
    } else {
        obj.__events_off = false;
    }
};

EventEmitter.die = function(obj, evt) {
    if(!obj.__events_offs) obj.__events_offs = {};
    if(evt) {
        obj.__events_offs[evt] = true;
    } else {
        obj.__events_off = true;
    }
};

EventEmitter.invoke = function(obj, evt) {
    if(!obj.__events_offs) obj.__events_offs = {};
    if(obj.__events_off) return;
    if(obj.__events_offs[evt]) return;

    let listeners = obj.__events_listeners;
    if(!listeners) {
        listeners = {};
        obj.__events_listeners = listeners;
    }

    let handlers = listeners[evt];
    if(handlers) {
        let size = handlers.length;
        for (let i = 0; i < size; i++) {
            let h = handlers[i];
            h.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
    }
};


class Observable {
    addListener(evt, handler) {
        EventEmitter.addListener(this, evt, handler);
    }

    addListeners(listeners) {
        EventEmitter.addListeners(this, listeners);
    }

    removeListener(evt, handler) {
        EventEmitter.removeListener(evt, handler);
    }

    on(evt, fn) {
        EventEmitter.on(this, evt, fn);
    }

    live(evt) {
        EventEmitter.live(this, evt);
    }

    die(evt) {
        EventEmitter.die(this, evt);
    }

    invoke(evt) {
        Array.prototype.splice.call(arguments, 0, 0, this);
        EventEmitter.invoke.apply(this, arguments);
    }
}

exports.EventEmitter = EventEmitter;
exports.Observable = Observable;
