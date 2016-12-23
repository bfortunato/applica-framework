"use strict"

function isMac() {
    return navigator.platform.indexOf('Mac') > -1
}

export function isControl(which) {
    if (isMac()) {
        return which == 91 || which == 93
    } else {
        return which == 17
    }
}

export function isShift(which) {
    return which == 16
}

export function isUp(which) {
    return which == 38
}

export function isDown(which) {
    return which == 40
}

export function isEnter(which) {
    return which == 13
}

export function isCancel(which) {
    return which == 46 || which == 8
}

export function isEsc(which) {
    return which == 27
}