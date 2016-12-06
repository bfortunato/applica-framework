"use strict"

import * as config from "../framework/config"
import { get, post } from "./utils"

export function load(entities, query) {
    let url = config.get("entities.url") + "/" + id
    return get(url)
}