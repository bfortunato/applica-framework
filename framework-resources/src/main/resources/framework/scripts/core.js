/**
 * Applica (www.applica.guru).
 * User: Bruno Fortunato
 * Date: 2/21/13
 * Time: 1:25 PM
 */

define([], function() {
    var exports = {};

    /* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */

    var dateFormat = function () {
        var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var	_ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    var events = {};
    events.addListener = function(obj, evt, handler) {
        var listeners = obj.__events_listeners;
        if(!listeners) {
            listeners = {};
            obj.__events_listeners = listeners;
        }

        if(!listeners[evt]) {
            listeners[evt] = [];
        }

        listeners[evt].push(handler);
    };

    events.addListeners = function(obj, listeners) {
        for(var key in listeners) {
            events.addListener(obj, key, listeners[key]);
        }
    };

    events.on = function(obj, evt, handler) {
        if($.isPlainObject(evt)) {
            events.addListeners(obj, evt);
        } else {
            events.addListener(obj, evt, handler);
        }
    };

    events.live = function(obj, evt) {
        if(!obj.__events_offs) obj.__events_offs = {};
        if(evt) {
            obj.__events_offs[evt] = false;
        } else {
            obj.__events_off = false;
        }
    };

    events.die = function(obj, evt) {
        if(!obj.__events_offs) obj.__events_offs = {};
        if(evt) {
            obj.__events_offs[evt] = true;
        } else {
            obj.__events_off = true;
        }
    };

    events.invoke = function(obj, evt) {
        if(!obj.__events_offs) obj.__events_offs = {};
        if(obj.__events_off) return;
        if(obj.__events_offs[evt]) return;

        var listeners = obj.__events_listeners;
        if(!listeners) {
            listeners = {};
            obj.__events_listeners = listeners;
        }

        var handlers = listeners[evt];
        if(handlers) {
            var size = handlers.length;
            for (var i = 0; i < size; i++) {
                var h = handlers[i];
                h.apply(obj, Array.prototype.slice.call(arguments, 2));
            }
        }
    };

    function AObject() {}

    AObject.extend = function(obj) {
        return AObject.__doExtend(AObject, obj);
    };

    AObject.newInstance = function() {
        return new AObject();
    };

    AObject.__doExtend = function(superType, obj) {
        var inerithed = function(c) {
            if(c === "__AObject_prototype") {

            } else {
                if(!$.isFunction(obj.ctor)) {
                    obj.ctor = function() { superType.prototype.ctor.apply(this, arguments); };
                }

                obj.ctor.apply(this, arguments);
            }
        };

        inerithed.prototype = $.extend(new superType("__AObject_prototype"), obj);
        inerithed.super = superType.prototype;
        inerithed.newInstance = function() { return new inerithed(); };
        inerithed.extend = function(o) {
            return AObject.__doExtend(inerithed, o);
        };

        return inerithed;
    };

    var __doGet = function(obj, key) {
        var val = null;

        if($.isFunction(obj["get_" + key])) {
            val = obj["get_" + key]();
        } else {
            val = obj[key];
        }

        return val;
    };

    var __doSet = function(obj, key, value) {
        if($.isFunction(obj["set_" + key])) {
            obj["set_" + key](value);
        } else {
            obj[key] = value;
        }
    };

    AObject.prototype = {
        ctor: function() {
            this.callbacks = {};
        },

        get: function(key) {
            var val = null;
            var instance = this;
            var ikey = key;

            while(ikey.indexOf(".") != -1) {
                instance = __doGet(instance, ikey.substring(0, ikey.indexOf(".")));
                ikey = ikey.substring(ikey.indexOf(".") + 1);
            }

            val = __doGet(instance, ikey);

            return val;
        },

        set: function(key, value) {
            var sv = utils.callback(this, function(key, value) {
                var instance = this;
                var ikey = key;
                while(ikey.indexOf(".") != -1) {
                    var nkey = ikey.substring(0, ikey.indexOf("."));
                    var ninstance = __doGet(instance, nkey);
                    if(ninstance == undefined || ninstance == null) {
                        ninstance = instance[nkey] = new AObject();
                    }
                    instance = ninstance;
                    ikey = ikey.substring(ikey.indexOf(".") + 1);
                }

                __doSet(instance, ikey, value);

                if(instance instanceof AObject) {
                    instance.invoke(ikey + "_change");
                }
            });

            if($.isPlainObject(key)) {
                for(var k in key) {
                    sv(k, key[k]);
                }
            } else if (typeof key == "string") {
                sv(key, value);
            } else {
                throw "Provided key is not correct type";
            }
        },

        addListener: function(evt, handler) {
            events.addListener(this, evt, handler);
        },

        addListeners: function(listeners) {
            events.addListeners(this, evt);
        },

        on: function(evt, handler) {
            events.on(this, evt, handler);
        },

        invoke: function(evt) {
            Array.prototype.splice.call(arguments, 0, 0, this);
            events.invoke.apply(this, arguments);
        },

        live: function(evt) {
            events.live(this, evt);
        },

        die: function(evt) {
            events.die(this, evt);
        },

        callback: function() {
            if(!this.callbacks) {
                this.callbacks = {};
            }

            if(arguments.length > 1) {
                var fn = arguments[1];
                if(!$.isFunction(fn)) {
                    throw utils.format("Callback {0} is not a function", arguments[0]);
                }

                var arr = this.callbacks[arguments[0]];
                if (!arr) {
                    arr = [];
                    this.callbacks[arguments[0]] = arr;
                }

                arr.push(fn);
            } else {
                var arr = this.callbacks[arguments[0]];
                if (arr) {
                    this.callbacks[arguments[0]] = null;
                    var size = arr.length;
                    for (var i = 0; i < size; i++) {
                        var fn = arr[i];
                        if($.isFunction(fn)) {
                            Array.prototype.slice.call(arguments, 1);
                            fn.apply(this, arguments);
                        }
                    }
                }
            }
        }
    };

    var Disposable = AObject.extend({
        ctor: function() {
            this.disposables = [];
        },

        pushDispose: function(fn) {
            this.disposables.push(fn);
        },

        dispose: function() {
            //dispose created dialogs
            utils.each(this.disposables, function(dispose) {
                if($.isFunction(dispose)) {
                    dispose();
                }
            });

            this.disposables = [];
        }
    })

    var utils = {
        debug: function(message) {
            if($("div.debug").size() == 0) {
                $("body").append("<div class='debug'></div>");
            }

            $("div.debug").append(_E("p").text(message));
        },

        any: function (array, predicate) {
            var size = array.length;
            for (var i = 0; i < size; i++) {
                if (predicate(array[i])) return true;
            }

            return false;
        },

        findOne: function(array, predicate) {
            var items = utils.where(array, predicate);
            if(items.length > 0) {
                return items[0];
            }

            return null;
        },

        where: function (array, predicate) {
            var newArr = [];
            var size = array.length;
            for (var i = 0; i < size; i++) {
                if (predicate(array[i])) newArr.push(array[i]);
            }

            return newArr;
        },

        each: function (array, action) {
            if($.isPlainObject(array)) {
                for (var v in array) {
                    action(v);
                }
            } else if ($.isArray(array)) {
                var size = array.length;
                for (var i = 0; i < size; i++) {
                    action(array[i]);
                }
            }
        },

        callback: function (scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        },

        remove: function(array, predicate) {
            var elementsToRemove = utils.where(array, predicate);
            var newArray = [];
            utils.each(array, function(i){
                if(!utils.contains(elementsToRemove, i)) {
                    newArray.push(i);
                }
            });

            return newArray;
        },

        contains: function(array, item) {
            return utils.any(array, function(i) {
                return item == i;
            });
        },

        format: function(formatted) {
            if(!formatted) {
                throw "Please specify a format string"
            }

            var params = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < params.length; i++) {
                var regexp = new RegExp('\\{'+i+'\\}', 'gi');
                formatted = formatted.replace(regexp, params[i]);
            }
            return formatted;
        },

        formatDate: function(date, format) {
            if(!date) return "";
            if(typeof(date) == "number") {
                var o = new Date();
                o.setTime(date);
                date = o;
            }
            return dateFormat(date, format);
        },

        getFullElementSize: function(element, opts) {
            var options = $.extend({
                border: true,
                padding: true,
                margin: true
            }, opts);

            var height =
                $(element).height() +
                    (options.border ? parseInt($(element).css("border-top-width")) : 0) +
                    (options.border ? parseInt($(element).css("border-bottom-width")) : 0) +
                    (options.padding ? parseInt($(element).css("padding-bottom")) : 0) +
                    (options.padding ? parseInt($(element).css("padding-top")) : 0) +
                    (options.margin ? parseInt($(element).css("margin-bottom")) : 0) +
                    (options.margin ? parseInt($(element).css("margin-top")) : 0);

            var width =
                $(element).width() +
                    (options.border ? parseInt($(element).css("border-left-width")) : 0) +
                    (options.border ? parseInt($(element).css("border-right-width")) : 0) +
                    (options.padding ? parseInt($(element).css("padding-left")) : 0) +
                    (options.padding ? parseInt($(element).css("padding-right")) : 0) +
                    (options.margin ? parseInt($(element).css("margin-left")) : 0) +
                    (options.margin ? parseInt($(element).css("margin-right")) : 0);

            return { height: height, width: width };
        },

        bounds: function(elements) {
            var el = elements[0] || elements;
            var height, width;
            if(el == window) {
                height = $(window).height();
                width = $(window).width();
            } else {
                height = el.offsetHeight;
                width = el.offsetWidth;
            }
            return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
                top: 0,
                left: 0,
                width: width,
                height: height
            }, $(el).offset());
        },

        stringIsNullOrEmpty: function(str) {
            return (!str || /^\s*$/.test(str));
        },

        isEmpty: function(obj) {
            if (obj == undefined) { return true; }
            if (obj == null) { return true; }

            if ($.isArray(obj)) {
                return obj.length == 0;
            }

            if (obj == "") {
                return true;
            }

            return false;
        },

        setCrossBrowserCssProperty: function(element, property, value) {
            var obj = {};

            var prefixes = [
                "-moz-",
                "-webkit-",
                "-ms-",
                "-o-"
            ];

            utils.each(prefixes, function(p) {
                var prop = p + property;
                obj[prop] = value;
            });

            obj[property] = value;

            $(element).css(obj);
        },

        bindEvents: function(object, events) {
            for(var key in events) {
                var handler = events[key];
                $(obj).bind(key, handler);
            }
        },

        GUID : function() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        }

    };

    var dateUtils = {
        isSameDay: function(date, other) {
            date = new Date(date);
            other = new Date(other);

            if(other.getDate() == date.getDate() && other.getMonth() == date.getMonth() && other.getFullYear() == date.getFullYear()) {
                return true;
            }

            return false;
        },

        formatTime: function(date) {
            var format;
            var now = new Date();
            var mtime = new Date();
            mtime.setTime(date);

            if(dateUtils.isSameDay(mtime, now)) {
                format = "hh:MM:ss";
            } else {
                format = "dd mmm hh:MM"
            }
            return utils.formatDate(date, format);
        },

        formatDay: function(date) {
            var text;
            if(dateUtils.isSameDay(new Date().getTime(), date)) {
                text = "today"
            } else {
                text = utils.formatDate(new Date(date), "dd mmm yyyy");
            }

            return text;
        },

        monthsLocalizedArray: function(locale) {
            var result = [];
            for(var i = 0; i < 12; i++) {
                result.push(new Date(2010,i).toLocaleString(locale,{month:"long"}));
            }
            return result;
        },

        //return dd monthName yyyy
        getDateWithMonthName: function(locale, date) {
            var moths = this.monthsLocalizedArray(locale);
            return date.getDate() + " " + moths[date.getMonth()] + " " + date.getFullYear();
        }
    };

    exports.events = events;
    exports.AObject = AObject;
    exports.Disposable = Disposable;
    exports.utils = utils;
    exports.dateUtils = dateUtils;

    return exports;
});