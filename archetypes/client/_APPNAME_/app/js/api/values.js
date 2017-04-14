"use strict"

const aj = require("../aj")
const http = require("../aj/http")

const preferences = require("../framework/preferences")
const config = require("../framework/config")

import * as _ from "../libs/underscore"
import {flatten} from "../utils/lang"
import * as query from "../api/query"
import {get} from "./utils"

export function loadEntities(entity, _query) {
    if (_.isEmpty(_query)) {
        _query = query.create();
    }
    let url = config.get(`values.entities.url`) + "/" + entity
    return get(url, flatten(_query.cleaned()))
}

export function load(collection, keyword) {
    let url = config.get("values.url") + "/" + collection
    if (!_.isEmpty(keyword)) {
    	url += "?keyword=" + keyword
    }
    return get(url)
}