"use strict"

import {Observable} from "../aj/events";

let instance = new Observable()

export function addObserver(evt, handler) {
    instance.on(evt, handler)

    logger.i("Added observer for event:", evt)
}

export function removeObserver(evt, handler) {
    instance.off(evt, handler)

    logger.i("Removed observer for event:", evt)
}

export function invoke(evt, data = null) {
    instance.invoke(evt, data)

    logger.i("Invoking observers for event:", evt)
}