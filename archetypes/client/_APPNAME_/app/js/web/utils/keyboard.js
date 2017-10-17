"use strict"

let pressedKeys = {}

const onWindowKeyUp = (e) => {
    pressedKeys[e.which] = false
}

const onWindowKeyDown = (e) => {
    pressedKeys[e.which] = true
}

const onWindowBlur = (e) => {
    pressedKeys = {}
}

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

export function attach() {
    window.addEventListener("keydown", onWindowKeyDown)
    window.addEventListener("keyup", onWindowKeyUp)
    window.addEventListener("blur", onWindowBlur)

    if (DEBUG) {
        logger.i("Keyboard attached to global key events")
    }
}

export function detach() {
    window.removeEventListener("keydown", onWindowKeyDown)
    window.removeEventListener("keyup", onWindowKeyUp)
    window.removeEventListener("blur", onWindowBlur)

    if (DEBUG) {
        logger.i("Keyboard detached from global key events")
    }
}

export function isShiftPressed() {
    return pressedKeys[16]
}

export function isControlPressed() {
    if (isMac()) {
        return pressedKeys[91] || pressedKeys[93]
    } else {
        return pressedKeys[17]
    }
}