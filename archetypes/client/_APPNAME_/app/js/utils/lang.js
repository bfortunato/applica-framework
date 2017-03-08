import * as _ from "../libs/underscore";

/**
 * Format a string message (es: format("My name is {0}", "Bruno") returns "My name is Brnuo")
 * @param fmt
 * @param values
 * @returns {void|XML|string|*}
 */
export function format(fmt, ...values) {
    let args = values;
    return fmt.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}

/**
 * Gets checked value (check for null or undefined) and gets the default value in case of fail
 * @param val Value of function to check
 * @param def Default value or function
 */
export function optional(val, def) {
    let v;

    try {
        v = _.isFunction(val) ? val() : val
    } catch(e) {}

    if (v == undefined || v == null) {
        v = _.isFunction(def) ? def() : def
    }

    return v
}

/**
 * Gets a boolean value casting from val if is not null or undefined
 */
export function parseBoolean(val) {
    if (val == null) { return null }
    if (val == undefined) { return undefined }

    return (val == true || parseInt(val) > 0 || val == "true")
}

/**
 * Walk in a composite object
 * @param tree
 * @param property
 * @param action
 */
export function walk(tree, property = "children", action) {
    if (_.isArray(tree)) {
        _.each(tree, i => {
            action(i)

            if (_.isArray(i[property])) {
                _.each(i[property], t => walk(t, property, action))
            }
        })
    } else {
        action(tree)

        if (_.isArray(tree[property])) {
            _.each(tree[property], t => walk(t, property, action))
        }
    }

    return tree
}

class ObjectUser {
    constructor(o) {
        this.o = o
    }

    run(fn) {
        fn(this.o)
        return this.o
    }

    get() {
        return this.o
    }
}

/**
 * A strategy to do something with an object and get it
 */
export function use(o) {
    return new ObjectUser(o)
}

/**
 * Make a flatten object from plain object
 */

export function flatten(target) {
    if (!_.isObject(target)) {
        return {}
    }

    const delimiter = "."
    let output = {}

    function step(obj, prev, currentKey) {
        let keys = _.keys(obj)
        _.each(keys, k => {
            let newKey = prev ? currentKey + delimiter + k : k
            if (_.isArray(obj)) {
                newKey = currentKey + "[" + k + "]"
            }

            let value = obj[k]
            if (value != null && value != undefined) {
                if (_.isObject(value)) {
                    step(value, obj, newKey)
                } else {
                    output[newKey] = value
                }
            }
        })
    }

    step(target, null, "")

    return output
}

/**
 * Generates unique identifier
 * @returns {string}
 */
export function uuid() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/**
 * Updates list element found with predicate and return an updated copy of the list
 * @param list
 * @param predicate
 * @param updater
 */
export function updatedList(list, predicate, updater, addIfNotFound = false) {
    if (_.isArray(list) && _.isFunction(predicate) && _.isFunction(updater)) {
        let result = new Array(list.length)
        let found = false
        for (let i = 0; i < list.length; i++) {
            let v = list[i]
            if (predicate(v)) {
                result[i] = _.assign(v, updater(v))
                found = true
            } else {
                result[i] = v
            }
        }

        if (addIfNotFound && !found) {
            result.push(updater(null))
        }

        return result;
    } else {
        logger.w("Bad parameters in updater. Returning an empty list")
        return []
    }

}