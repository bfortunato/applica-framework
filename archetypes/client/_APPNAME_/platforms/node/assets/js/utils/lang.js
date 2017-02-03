'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.format = format;
exports.optional = optional;
/**
 * Format a string message (es: format("My name is {0}", "Bruno") returns "My name is Brnuo")
 * @param fmt
 * @param values
 * @returns {void|XML|string|*}
 */
function format(fmt) {
    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
    }

    var args = values;
    return fmt.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

/**
 * Gets checked value (check for null or undefined) and gets the default value in case of fail
 * @param val Value of function to check
 * @param def Default value or function
 */
function optional(val, def) {
    var v = void 0;

    try {
        v = _.isFunction(val) ? val() : val;
    } catch (e) {}

    if (v == undefined) {
        v = _.isFunction(def) ? def() : def;
    }

    return v;
}