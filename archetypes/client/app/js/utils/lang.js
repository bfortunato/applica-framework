/**
 * Format a string message (es: format("My name is {0}", "Bruno") returns "My name is Brnuo")
 * @param fmt
 * @param values
 * @returns {void|XML|string|*}
 */
export function format(fmt, ...values) {
    var args = values;
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

            if (!_.isArray(i[property])) {
                _.each(i[property], t => walk(t))
            }
        })
    } else {
        action(tree)

        if (!_.isArray(tree[property])) {
            _.each(tree[property], t => walk(t))
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