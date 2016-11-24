import * as aj from "../aj"
import * as actions from "../actions"
import * as _ from "../libs/underscore"

export const SESSION = "SESSION";


export const session = aj.createStore(SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { action: action.type, user: action.user, isLoggedIn: action.isLoggedIn });

        case actions.RESUME_SESSION:
            return _.assign(state, { action: action.type, user: action.user, isLoggedIn: action.isLoggedIn });
    }

});