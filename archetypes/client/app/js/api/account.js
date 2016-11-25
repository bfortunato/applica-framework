"use strict";

import * as config from "../framework/config"
import { get, post } from "./utils"

export function register(name, mail, password) {
    return post(config.get("account.register.url"), {name, mail, password})
}

export function recover(mail) {
    return post(config.get("account.recover.url"), {mail})
}

export function confirm(activationCode) {
    return post(config.get("account.confirm.url"), {activationCode})
}