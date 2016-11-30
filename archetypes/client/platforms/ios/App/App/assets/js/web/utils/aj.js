"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connect = connect;
function connect(component, stores) {
    var localState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var singleStore = !_.isArray(stores);

    if (!_.isArray(stores)) {
        stores = [stores];
    }

    var originals = {
        componentDidMount: component.componentDidMount,
        componentWillUnmount: component.componentWillUnmount
    };

    if (singleStore) {
        component.state = singleStore.state || localState;
    }

    component.componentDidMount = function () {
        _.each(stores, function (store) {
            store.subscribe(component, function (state) {
                return component.setState(state);
            });
            component.setState(store.state || {});
        });

        if (_.isFunction(originals.componentDidMount)) {
            originals.componentDidMount.call(component);
        }
    };

    component.componentWillUnmount = function () {
        _.each(stores, function (store) {
            store.unsubscribe(component);
        });

        if (_.isFunction(originals.componentWillUnmount)) {
            originals.componentWillUnmount.call(component);
        }
    };
}