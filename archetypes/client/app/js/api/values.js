"use strict"

const aj = require("../aj")
const http = require("../aj/http")

const preferences = require("../framework/preferences")
const config = require("../framework/config")
import * as _ from "../libs/underscore"
import * as responses from "./responses"
import {get} from "./utils"

export function load(collection, keyword) {
    let url = config.get(`values.${collection}.url`)
    if (!_.isEmpty(keyword)) {
    	url += "?keyword=" + keyword
    }
    return get(url)
}