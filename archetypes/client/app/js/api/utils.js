"use strict"

import * as http from "../aj/http"
import * as responses from "./responses"

export function post(url, data) {
    return new Promise((resolve, reject) => {
        http.post(url, data)
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK != response.responseCode) {
                        reject(response.responseCode)
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

export function get(url, data) {
    return new Promise((resolve, reject) => {
        http.get(url, data)
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK != response.responseCode) {
                        reject(response.responseCode)
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

export function delete_(url, data) {
    return new Promise((resolve, reject) => {
        http.delete(url, data)
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK != response.responseCode) {
                        reject(response.responseCode)
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