"use strict";

var config = require("../config");

var _ = require("./../libs/underscore");

exports.get = function (key) {
    if (_.has(config, key)) {
        return config[key];
    } else {
        throw "Config not found: " + key;
    }
};