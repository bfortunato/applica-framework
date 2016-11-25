import * as aj from "../aj"
import * as actions from "../actions"
import * as _ from "../libs/underscore"
import strings from "../strings"

export const SESSION = "SESSION";
export const session = aj.createStore(SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { isLoggedIn: false });

        case actions.LOGIN_COMPLETE:
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case actions.LOGIN_ERROR:
            return _.assign(state, { isLoggedIn: false, error: true });

        case actions.RESUME_SESSION:
            return _.assign(state, { isLoggedIn: false });

        case actions.RESUME_SESSION_COMPLETE:
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case actions.RESUME_SESSION_ERROR:
            return _.assign(state, { isLoggedIn: false, error: true });
    }

});

export const ACCOUNT = "ACCOUNT";
export const account = aj.createStore(ACCOUNT, (state = {activationCode: ""}, action) => {

    switch (action.type) {
        case actions.REGISTER:
            return _.assign(state, { registered: false, error: false });

        case actions.REGISTRATION_COMPLETE:
            return _.assign(state, { registered: true, error: false, name: action.name, mail: action.mail, message: action.message });

        case actions.REGISTRATION_ERROR:
            return _.assign(state, { registered: false, error: true, message: action.message });

        case actions.SET_ACTIVATION_CODE:
            return _.assign(state, { activationCode: action.activationCode });

        case actions.CONFIRM_ACCOUNT:
            return _.assign(state, { confirmed: false, error: false });

        case actions.CONFIRM_ACCOUNT_COMPLETE:
            return _.assign(state, { confirmed: true, error: false });

        case actions.CONFIRM_ACCOUNT_ERROR:
            return _.assign(state, { confirmed: false, error: true, message: action.message });

        case actions.RECOVER_ACCOUNT:
            return _.assign(state, { recovered: false, error: false });

        case actions.RECOVER_ACCOUNT_COMPLETE:
            return _.assign(state, { recovered: true, error: false });

        case actions.RECOVER_ACCOUNT_ERROR:
            return _.assign(state, { recovered: false, error: true });
    }

});