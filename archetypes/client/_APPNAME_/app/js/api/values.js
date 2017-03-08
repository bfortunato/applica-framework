"use strict"

const aj = require("../aj")
const http = require("../aj/http")

const preferences = require("../framework/preferences")
const config = require("../framework/config")
import * as _ from "../libs/underscore"
import * as responses from "./responses"
import {get} from "./utils"

export function loadEntities(entity, keyword) {
    let url = config.get(`values.entities.url`) + "/" + entity
    if (!_.isEmpty(keyword)) {
        url += "?keyword=" + keyword
    }
    return get(url)
}

export function load(collection, keyword) {
    let url = config.get("values.url") + "/" + collection
    if (!_.isEmpty(keyword)) {
    	url += "?keyword=" + keyword
    }
    return get(url)
}