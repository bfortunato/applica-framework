"use strict"

const aj = require("../aj")
const http = require("../aj/http")

const preferences = require("../framework/preferences")
const config = require("../framework/config")
import * as _ from "../libs/underscore"
import * as responses from "./responses"

let _loggedUser
let _sessionToken

export const TYPE_MAIL = "MAIL"
export const TYPE_FACEBOOK = "FACEBOOK"

let STOP_OBJ = {}

function stop() {
    return STOP_OBJ
}

function wrap(r, fn) {
    if (r == STOP_OBJ) {
        return STOP_OBJ
    } else {
        return fn(r)
    }
}

export function login(mail, password) {
    return new Promise((resolve, reject) => {
        http.post(config.get("login.url"), {mail, password})
            .then(json => {
                if (_.isEmpty(json)) {
                    reject(responses.ERROR)
                } else {
                    let response = JSON.parse(json)

                    if (responses.OK == response.responseCode) {
                        reject(response.responseCode)
                    }

                    resolve(response.token)
                }
            })
            .catch(e => {
                logger.e("Error logging in:", e)
                reject(responses.ERROR)
            })
    })
}

export function start(mail, password) {
    return new Promise((resolve, reject) => {
        _loggedUser = null
        _sessionToken = null

        let data = {}

        preferences.load()
            .then(() => { return login(mail, password) })
            .then(token => {
                preferences.set("session.type", TYPE_MAIL)
                preferences.set("session.mail", mail)
                preferences.set("session.password", password)

                _sessionToken = token
                _loggedUser = {
                    type: TYPE_MAIL,
                    mail: mail,
                    data: data,
                }

                return preferences.save()
            })
            .then((r) => {
                resolve(_loggedUser)
            })
            .catch((e) => {
                _loggedUser = null
                _sessionToken = null

                preferences.load()
                    .then(() => {
                        preferences.set("session.type", null)
                        preferences.set("session.mail", null)
                        preferences.set("session.password", null)
                        return preferences.save()
                    })
                    .catch((e) => {
                        logger.e(e)
                    })

                reject(e)
            })
    })
}

export function resume() {
    return new Promise((resolve, reject) => {
        _loggedUser = null
        _sessionToken = null

        preferences.load()
            .then(() => {
                var type = preferences.get("session.type")
                var mail = preferences.get("session.mail")
                var password = preferences.get("session.password")

                if ((type == TYPE_MAIL && mail && password)) {
                    return start(mail, password)
                } else {
                    reject(responses.ERROR)
                    return stop()
                }
            })
            .then((r) => {
                return wrap(r, () => {
                    resolve(r)
                })
            })
            .catch(e => {reject(e)})
    })
}

export function destroy() {
    _loggedUser = null
    _sessionToken = null

    return preferences.load()
        .then(() => {
            preferences.set("session.type", null)
            preferences.set("session.mail", null)
            preferences.set("session.password", null)
            return preferences.save()
        })
        .catch((e) => {
            logger.e(e)
        })
}

export function getLoggedUser() {
    return _loggedUser
}

export function isLoggedIn() {
    return _loggedUser != null
}

export function getSessionToken() {
    return _sessionToken
}

