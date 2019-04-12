"use strict"

import * as aj from "../aj/index";
import {completed, failed} from "../utils/ajex";
import * as actions from "../actions/types";
import _ from "underscore";
import {UI} from "./types";

export const UIStore = aj.createStore(UI, (state = {}, action) => {

    switch (action.type) {
        case actions.GET_USER_COVER_IMAGE:
            return _.assign(state, {error: false});

        case completed(actions.GET_USER_COVER_IMAGE):
            return _.assign(state, {error: false, cover: action.data});

        case failed(actions.GET_USER_COVER_IMAGE):
            return _.assign(state, {error: true});

        case actions.GET_USER_PROFILE_IMAGE:
            return _.assign(state, {error: false});

        case completed(actions.GET_USER_PROFILE_IMAGE):
            return _.assign(state, {error: false, profileImage: action.data});

        case failed(actions.GET_USER_PROFILE_IMAGE):
            return _.assign(state, {error: true});
    }

});