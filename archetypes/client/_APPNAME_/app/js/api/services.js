import _ from "underscore"
import * as  aj from "../aj"
import * as http from "../aj/http"
import * as preferences from "../framework/preferences"
import * as config from"../framework/config"
import * as utils from "./utils"

function get(url, data) {
    url = config.get("service.url") + url

    return utils.get(url, data)
}

function post(url, data) {
    url = config.get("service.url") + url

    return utils.post(url, data)
}

function postJson(url, data) {
    url = config.get("service.url") + url

    return utils.postJson(url, data)
}

function put(url, data) {
    url = config.get("service.url") + url

    return utils.put(url, data)
}

function _delete(url, data) {
    url = config.get("service.url") + url

    return utils.delete(url, data)
}

export default {
    get,
    post,
    put,
    postJson,
    "delete": _delete
}