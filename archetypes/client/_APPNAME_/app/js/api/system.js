"use strict";

import * as config from "../framework/config";
import {get} from "./utils";

export function getSystemInfos() {
    return get(config.get("system.url") + "/version");
}