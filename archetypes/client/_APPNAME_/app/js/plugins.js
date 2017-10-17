"use strict"

import * as aj from "./aj";

let loaderCounter = 0
let unobstrusiveLoaderCounter = 0

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

    loaderCounter++
}

export function hideLoader() {
    loaderCounter--

    if (loaderCounter <= 0) {
        aj.exec("Loader", "hide", {}, function () {}).then(() => {}).catch(() => {})
    }

}

export function showUnobtrusiveLoader(message = "") {
    if (unobstrusiveLoaderCounter <= 0) {
        aj.exec("Loader", "showUnobtrusive", {message}, function() {}).then(() => {}).catch(() => {})
    }

    unobstrusiveLoaderCounter++
}

export function hideUnobtrusiveLoader() {
    unobstrusiveLoaderCounter--

    if (unobstrusiveLoaderCounter <= 0) {
        aj.exec("Loader", "hideUnobtrusive", {}, function () {}).then(() => {}).catch(() => {})
    }

}

export function toast(message) {
    aj.exec("Toast", "show", {message}, function() {}).then(() => {}).catch(() => {})
}