"use strict"

import * as config from "../framework/config"
import * as utils from "./utils"
import * as _ from "../libs/underscore"

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity
    logger.i("quering with ", JSON.stringify(query.cleaned))
    return utils.get(url, {queryJson: JSON.stringify(query.cleaned())})
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
    return utils.delete_(url, {entityIds: data.join()})
}

export function save(entity, data) {
    let url = config.get("entities.url") + "/" + entity
    return utils.post(url, data)
}

export function get(entity, id) {
    let url = config.get("entities.url") + "/" + entity + "/" + id
    return utils.get(url)
}