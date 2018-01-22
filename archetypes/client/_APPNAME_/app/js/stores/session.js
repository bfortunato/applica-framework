"use strict"

import * as aj from "../aj/index";
import {completed, failed} from "../utils/ajex";
import * as actions from "../actions/types";
import * as _ from "../libs/underscore";
import {SESSION} from "./types";


export const SessionStore = aj.createStore(SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { isLoggedIn: false });

        case completed(actions.LOGIN):
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case failed(actions.LOGIN):
            return _.assign(state, { isLoggedIn: false, error: true });

        case actions.RESUME_SESSION:
            return _.assign(state, { isLoggedIn: false, resumeComplete: false });

        case completed(actions.RESUME_SESSION):
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false, resumeComplete: true });

        case failed(actions.RESUME_SESSION):
            return _.assign(state, { isLoggedIn: false, error: true, resumeComplete: true });

        case actions.LOGOUT:
            return _.assign(state, {isLoggedIn: false, user: null, error: false, resumeComplete: false})
    }

});
