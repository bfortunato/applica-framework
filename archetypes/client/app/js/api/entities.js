"use strict"

import * as config from "../framework/config"
import { get, post, delete_ as delete__ } from "./utils"
import * as _ from "../libs/underscore"

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity
    return get(url, {queryJson: query})
}

export function delete_(entity, ids) {
    if (!_.isArray(ids)) {
        throw new Error("ids is not an array")
    }

    let data = []
    for (let i = 0; i < ids.length; i++) {
        data.push(`${ids[i]}`)
    }

    let url = config.get("entities.url") + "/" + entity
    return delete__(url, {entityIds: data.join()})
}

export function save(entity, data) {
    let url = config.get("entities.url") + "/" + entity
    return post(url, data)
}