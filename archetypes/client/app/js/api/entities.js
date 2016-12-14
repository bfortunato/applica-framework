"use strict"

import * as config from "../framework/config"
import { get, post, delete_ as delete__ } from "./utils"

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity
    return get(url, {queryJson: query})
}

export function delete_(entity, ids) {
    let url = config.get("entities.url") + "/" + entity
    return delete__(url, {entityIds: ids})
}