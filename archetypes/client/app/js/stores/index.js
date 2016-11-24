import * as aj from "../aj"
import * as actions from "../actions"
import * as _ from "../libs/underscore"
import strings from "../strings"

export const SESSION = "SESSION";
export const ACCOUNT = "ACCOUNT";


export const session = aj.createStore(SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { action: action.type, user: action.user, isLoggedIn: action.isLoggedIn });

        case actions.RESUME_SESSION:
            return _.assign(state, { action: action.type, user: action.user, isLoggedIn: action.isLoggedIn });
    }

});

export const account = aj.createStore(ACCOUNT, (state = {}, action) => {

    switch (action.type) {
        case actions.REGISTER:
            return _.assign(state, { registered: false, error: false });

        case actions.REGISTRATION_COMPLETE:
            return _.assign(state, { registered: true, error: false, name: action.name, mail: action.mail, message: action.message });

        case actions.REGISTRATION_ERROR:
            return _.assign(state, { registered: false, error: true, message: action.message });
    }

});