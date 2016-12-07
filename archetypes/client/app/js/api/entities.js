"use strict"

import * as config from "../framework/config"
import { get, post } from "./utils"

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity
    return get(url, {queryJson: query})
}