"use strict";

import "./libs/polyfill"
import "./stores"
import "./actions"
import * as services from "./framework/services"
import { login } from "./services"

export const main = function() {
    services.register("login", login);
};
