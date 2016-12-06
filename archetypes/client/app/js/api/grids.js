"use strict"

import * as config from "../framework/config"
import { get, post } from "./utils"

export function getGrid(id) {
    let url = config.get("grids.url") + "/" + id
    return get(url)
}