import * as aj from "../aj"
import * as types from "./types"
import * as actions from "../actions/types"

import * as _ from "../libs/underscore"

const initialState = {
    message: null
};

export const home = aj.createStore(types.HOME, (state = initialState, action) => {

    switch (action.type) {
        case actions.GET_MESSAGE:
            return _.assign(state, { message: action.message });
    }

});


export const session = aj.createStore(types.SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { action: action.type, user: action.user, loggedIn: action.loggedIn });

        case actions.RESUME_SESSION:
            return _.assign(state, { action: action.type, user: action.user, loggedIn: action.loggedIn });
    }

});


export const ui = aj.createStore(types.UI, (state = {loading: false}, action) => {

    switch (action.type) {
        case actions.SHOW_LOADING:
        case actions.HIDE_LOADING:
            return _.assign(state, {loading: action.loading});
    }

});