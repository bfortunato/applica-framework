"use strict";

import * as http from "../aj/http"
import * as responses from "./responses"
import * as config from "../framework/config"

export function register(name, mail, password) {
    return new Promise((resolve, reject) => {
        http.post(config.get("account.register.url"), {name, mail, password})
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK == response.responseCode) {
                        reject(response.responseCode)
                    }

                    resolve()
                }
            })
            .catch(e => {
                logger.e("Error registering user:", e)
                reject(responses.ERROR)
            })
    })
}