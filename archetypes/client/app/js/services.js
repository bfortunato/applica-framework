"use strict";

import * as http from "./aj/http"
import * as config from "./framework/config"
import * as _ from "./libs/underscore"

export function login(mail, password) {
    return new Promise((resolve, reject) => {
        http.post(config.get("login.url"), {mail, password})
            .then(json => {
                if (_.isEmpty(json)) {
                    reject("Could not login");
                } else {
                    let response = JSON.parse(json);

                    if (response.error) {
                        reject(response.message);
                    }

                    resolve(response.value);
                }
            })
            .catch(e => {
                logger.e("Error logging in:", e);
                reject(e);
            })
    });
}

export function fakeLogin(mail, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.6) {
                reject("Random error generated")
            } else {
                resolve({id: 1, mail: mail, name: "Bruno Fortunato"})
            }

        }, 1500);
    });
}