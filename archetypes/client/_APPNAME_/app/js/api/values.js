"use strict"

const aj = require("../aj")
const http = require("../aj/http")

const preferences = require("../framework/preferences")
const config = require("../framework/config")

import _ from "underscore";
import {flatten} from "../utils/lang";
import * as query from "../framework/query";
import {get} from "./utils";

export function loadEntities(entity, _query) {
    if (_.isEmpty(_query)) {
        _query = query.create();
    }
    let url = config.get(`values.entities.url`) + "/" + entity
    return get(url, flatten(_query.cleaned()))
}

export function load(collection, keyword, params = {}) {
    let url = config.get("values.url") + "/" + collection
    if (!_.isEmpty(keyword)) {
    	url += "?keyword=" + keyword
    }

    let separator = "&"
    if (url.indexOf("?") == -1) {
        separator = "?"
    }

    let paramsString = ""
    _.each(_.allKeys(params), k => {
        paramsString += k + "=" + encodeURIComponent(params[k]) + "&"
    })

    if (!_.isEmpty(paramsString)) {
        url += separator + paramsString
    }

    return get(url)
}