import _ from "underscore";
import {discriminated} from "../../utils/ajex";

function connectInternal(setState, component, stores, localState) {
    let singleStore = !_.isArray(stores)

    if (!_.isArray(stores)) {
        stores = [stores]
    }

    let originals = {
        componentDidMount: component.componentDidMount,
        componentWillUnmount: component.componentWillUnmount
    }

    if (singleStore) {
        component.state = singleStore.state || localState
    }

    component.componentDidMount = function() {
        _.each(stores, store => {
            store.subscribe(component, state => setState(component, state))
            setState(component, store.state || {})
        })

        if (_.isFunction(originals.componentDidMount)) {
            originals.componentDidMount.call(component)
        }
    }

    component.componentWillUnmount = function() {
        _.each(stores, store => {
            store.unsubscribe(component)
        })

        if (_.isFunction(originals.componentWillUnmount)) {
            originals.componentWillUnmount.call(component)
        }
    }
}

export function connect(component, stores, localState = {}) {
    return connectInternal((component, state) => component.setState(state), component, stores, localState)
}

export function connectDiscriminated(discriminator, component, stores, localState = {}) {
    return connectInternal((component, state) => component.setState(discriminated(state, discriminator)), component, stores, localState)
}