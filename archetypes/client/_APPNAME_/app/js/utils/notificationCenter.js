"use strict"

import {Observable} from "../aj/events";

let instance = new Observable()

export function addObserver(evt, handler) {
	logger.i("Added observer for event:", evt)
    return instance.on(evt, handler)
}

export function removeObserver(evt, handler) {
    logger.i("Removed observer for event:", evt)
    instance.off(evt, handler)
}

export function invoke(evt, data = null) {
    logger.i("Invoking observers for event:", evt)
    instance.invoke(evt, data)
}