"use strict"

import * as aj from "../aj/index";
import {completed, failed} from "../utils/ajex";
import * as actions from "../actions/types";
import _ from "underscore";
import {PASSWORD_RECOVERY} from "./types";

export function passwordRecoveryDefaultState () {
    return {
        recoveryStep: 1,
        mail: undefined,
        code: undefined,
    }
}

export const PasswordRecoveryStore = aj.createStore(PASSWORD_RECOVERY, (state = passwordRecoveryDefaultState(), action) => {

    switch (action.type) {

        case completed(actions.REQUEST_RECOVERY_CODE):
            return _.assign(state, {error: false, mail: action.mail, recoveryStep: 2});
        case failed(actions.REQUEST_RECOVERY_CODE):
            return _.assign(state, {error: true});

        case completed(actions.VALIDATE_RECOVERY_CODE):
            return _.assign(state, {error: false, mail: action.mail, code: action.code, recoveryStep: 3});
        case failed (actions.VALIDATE_RECOVERY_CODE):
            return _.assign(state, {error: true});
            
        case completed(actions.RESET_PASSWORD):
            return _.assign(state, {error: false, recoveryStep: 4});
        case failed(actions.RESET_PASSWORD):
            return _.assign(state, {error: true});
    }

});