"use strict"

import * as aj from "../aj/index";
import * as actions from "../actions/types";
import _ from "underscore";
import {SYSTEM} from "./types";
import {completed} from "../utils/ajex";

export const SystemStore = aj.createStore(SYSTEM, (state = {}, action) => {

    switch (action.type) {
        case completed(actions.SYSTEM_INFORMATIONS):
            return _.assign(state, { apiVersion: action.apiVersion, backendVersion: action.backendVersion, copyrightInfos: action.copyrightInfos});

    }

});
