"use strict"

import * as config from "../framework/config"
import * as utils from "./utils"
import * as _ from "../libs/underscore"
import {flatten} from "../utils/lang"

export function find(entity, query) {
    return load(entity, query)
}

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity
    return utils.get(url, flatten(query.cleaned()))
}

export function delete_(entity, ids) {
    if (!_.isArray(ids)) {
        throw new Error("ids is not an array")
    }

    let data = []
    for (let i = 0; i < ids.length; i++) {
        data.push(`${ids[i]}`)
    }

    let url = config.get("entities.url") + "/" + entity + "/delete"
    return utils.post(url, {ids: data.join()})
}

export function save(entity, data) {
    let url = config.get("entities.url") + "/" + entity
    return utils.postJson(url, data)
}

export function get(entity, id) {
    let url = config.get("entities.url") + "/" + entity + "/" + id
    return utils.get(url)
}