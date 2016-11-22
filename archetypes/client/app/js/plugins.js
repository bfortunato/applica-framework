"use strict"

import * as aj from "../aj"

export function alert(title, message, type) {
    return aj.exec("Alert", "alert", {title, message, type})
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

        aj.exec("Alert", "confirm", {callback}).catch(() => reject())
    })
}

export function showLoader(message = "") {
    aj.exec("Loader", "show", {message})
}

export function hideLoader() {
    aj.exec("Loader", "hide")
}

export function toast(message) {
    aj.exec("Toast", "show", {message})
}