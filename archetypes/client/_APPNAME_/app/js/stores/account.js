"use strict"

import * as aj from "../aj/index";
import {completed, failed} from "../utils/ajex";
import * as actions from "../actions/types";
import _ from "underscore";
import {ACCOUNT} from "./types";


export const AccountStore = aj.createStore(ACCOUNT, (state = {activationCode: ""}, action) => {

    switch (action.type) {
        case actions.REGISTER:
            return _.assign(state, { registered: false, error: false });

        case completed(actions.REGISTER):
            return _.assign(state, { registered: true, error: false, name: action.name, mail: action.mail, message: action.message });

        case failed(actions.REGISTER):
            return _.assign(state, { registered: false, error: true, message: action.message });

        case actions.SET_ACTIVATION_CODE:
            return _.assign(state, { activationCode: action.activationCode });

        case actions.CONFIRM_ACCOUNT:
            return _.assign(state, { confirmed: false, error: false });

        case completed(actions.CONFIRM_ACCOUNT):
            return _.assign(state, { confirmed: true, error: false });

        case failed(actions.CONFIRM_ACCOUNT):
            return _.assign(state, { confirmed: false, error: true, message: action.message });

        case actions.RECOVER_ACCOUNT:
            return _.assign(state, { recovered: false, error: false });

        case completed(actions.RECOVER_ACCOUNT):
            return _.assign(state, { recovered: true, error: false });

        case failed(actions.RECOVER_ACCOUNT):
            return _.assign(state, { recovered: false, error: true });
    }

});
