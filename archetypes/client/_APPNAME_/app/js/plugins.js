"use strict"

import * as aj from "../aj"

let loaderCounter = 0

export function alert(title, message, type) {
    return aj.exec("Alert", "alert", {title, message, type}, function() {}).then(() => {}).catch(() => {})
}

export function confirm() {
    return new Promise((resolve, reject) => {
        let callback = (confirmed) => {
            if (confirmed) {
                resolve()
            } else {
                reject()
            }
        }

        aj.exec("Alert", "confirm", {}, callback).then(() => {}).catch(() => reject())
    })
}

export function showLoader(message = "") {
    if (loaderCounter <= 0) {
        aj.exec("Loader", "show", {message}, function() {}).then(() => {}).catch(() => {})
    }

    loaderCounter++;
}

export function hideLoader() {
    loaderCounter--

    if (loaderCounter <= 0) {
        aj.exec("Loader", "hide", {}, function () {}).then(() => {}).catch(() => {})
    }

}

export function toast(message) {
    aj.exec("Toast", "show", {message}, function() {}).then(() => {}).catch(() => {})
}