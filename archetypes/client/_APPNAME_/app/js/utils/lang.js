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
 * Gets a forced boolean value casting also if is null or undefined (false in this case)
 */
export function forceBoolean(val) {
    if (val == null) { return false }
    if (val == undefined) { return false }

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
                result[i] = _.assign({}, v, updater(v))
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

/**
 * List on each list element and assign returned updater object to current element.
 * Each element will be a new element and list will be a new list, using immutability
 * @param list
 * @param updater
 */
export function peek(list, updater) {
    let newList = []

    _.each(list, i => {
        let obj = updater(i)
        if (obj === undefined && obj === null) {
            obj = {}
        }        

        newList.push(_.assign({}, i, obj))
    })

    return newList
}


/**
 * Gets object differences
 * @param o1
 * @param o2
 */
 export function diff(o1, o2) {
    let fo1 = flatten(o1)
    let fo2 = flatten(o2)

    let diff = []
    _.each(_.keys(fo1), k => {
        let v1 = fo1[k]
        if (!_.has(fo2, k)) {
            diff.push({property: k, type: "add", value: v1})
        } else {
            let v2 = fo2[k]
            if (v1 !== v2) {
                diff.push({property: k, type: "change", value: v1, oldValue: v2})
            }
        }
    })

    _.each(_.keys(fo2), k => {
        if (!_.has(fo1, k)) {
            diff.push({property: k, type: "remove", value: fo2[k]})
        }
    })

    return diff
 }
 
/**
 * Return true if object tree is different
 * @param o1
 * @param o2
 */
 export function isDifferent(o1, o2) {
    let fo1 = flatten(o1)
    let fo2 = flatten(o2)

    try {
        _.each(_.keys(fo1), k => {
            let v1 = fo1[k]
            if (!_.has(fo2, k)) {
                throw true
            } else {
                let v2 = fo2[k]
                if (v1 !== v2) {
                    throw true
                }
            }
        })

        _.each(_.keys(fo2), k => {
            if (!_.has(fo1, k)) {
                throw true
            }
        })
    } catch (e) {
        return true
    }

    return false
 }


/**
 * Gets matchings characters positions of s1 in s2, inspired to sublime text commands palette search mode
 */
export function stringMatches(s1, s2, caseSensitive = false) {
    let matches = []

    if (!caseSensitive) {
        s1 = s1.toLowerCase()
        s2 = s2.toLowerCase()
    }

    if (s1 && s1.length > 0 && s2 && s2.length > 0) {
        let i1 = 0
        let i2 = 0

        while(i1 < s1.length) {
            let c1 = s1.charAt(i1++)
            let i2 = s2.indexOf(c1, i2 + 1)
            if (i2 != -1) {
                matches.push({index: i2, char: c1})
            } else {
                break
            }
        }
    }

    return matches
}


window.stringMatches = stringMatches



