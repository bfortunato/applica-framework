"use strict"

import * as _ from "../libs/underscore";
import * as aj from "../aj";

export function completed(action) {
    return action + "_COMPLETE"
}

export function failed(action) {
    return action + "_FAIL"
}

export function createAsyncAction(type, action) {
    let normal = aj.createAction(type, action)
    normal.complete = aj.createAction(completed(type), (data) => {
        aj.dispatch(_.assign({type: completed(type), error: false}, data))
    })
    normal.fail = aj.createAction(failed(type), (data) => {
        aj.dispatch(_.assign({type: failed(type), error: true}, data))
    })
    return normal
}

export function discriminate(state, discriminator, newValues) {
    let ds = state[discriminator] = state[discriminator] || {}
    _.assign(ds, newValues)
    return state
}

export function discriminated(state, discriminator) {
    return state[discriminator] || {}
}