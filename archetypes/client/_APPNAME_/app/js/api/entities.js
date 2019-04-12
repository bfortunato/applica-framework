"use strict"

import * as config from "../framework/config";
import * as utils from "./utils";
import {addToken} from "./utils";
import _ from "underscore";
import {flatten} from "../utils/lang";
import * as http from "../aj/http";
import * as responses from "./responses";

export function find(entity, query) {
    return load(entity, query)
}

export function load(entity, query) {
    let url = config.get("entities.url") + "/" + entity + "/find"
    return utils.postJson(url, query.cleaned())
}

export function delete_(entity, ids) {
    if (!_.isArray(ids)) {
        throw new Error("ids is not an array")
    }

    let data = []
    for (let i = 0; i < ids.length; i++) {
        data.push(`${ids[i]}`)
    }

    let url = config.get("entities.url") + "/" + entity + "/delete"
    return utils.post(url, {ids: data.join()})
}

export function save(entity, data) {
    let url = config.get("entities.url") + "/" + entity
    return new Promise((resolve, reject) => {
        let json = typeof(data) === "string" ? data : JSON.stringify(data)
        let headers = {"Content-Type": "application/json"}
        http.post(url, json, addToken(headers))
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK != response.responseCode) {
                        reject(response)
                    } else {
                        resolve(response)
                    }
                }
            })
            .catch(e => {
                logger.e("Error in request:", e)
                reject(responses.ERROR)
            })
    })
}


export function get(entity, id, params) {
    let url = config.get("entities.url") + "/" + entity + "/" + id
    return utils.get(url, params)
}

export function checkRevisionEnableStatus(entity) {
    let url = config.get("revision.url") + "/checkStatus/" + entity
    return utils.get(url)
}