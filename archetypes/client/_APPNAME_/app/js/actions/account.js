"use strict"

import * as aj from "../aj/index";
import {createAsyncAction} from "../utils/ajex";
import * as SessionApi from "../api/session";
import * as AccountApi from "../api/account";
import * as responses from "../api/responses";
import {alert, hideLoader, showLoader, toast} from "../plugins";
import {format} from "../utils/lang";
import M from "../strings";
import * as _ from "../libs/underscore";
import {CONFIRM_ACCOUNT, RECOVER_ACCOUNT, REGISTER, SET_ACTIVATION_CODE} from "./types";

export const register = createAsyncAction(REGISTER, data => {
    if (_.isEmpty(data.name) || _.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(M("problemOccoured"), M("nameMailAndPasswordRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: REGISTER
    })

    showLoader(M("registering"))
    AccountApi.register(data.name, data.mail, data.password)
        .then(() => {
            hideLoader()

            let message = format(M("welcomeMessage"), data.name, data.mail)
            register.complete({name: data.name, mail: data.mail, message})
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            register.fail()
        })
});

export const recoverAccount = createAsyncAction(RECOVER_ACCOUNT, data => {
    if (_.isEmpty(data.mail)) {
        alert(M("problemOccoured"), M("mailRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: RECOVER_ACCOUNT,
    })

    showLoader()
    AccountApi.recover(data.mail)
        .then(() => {
            hideLoader()
            alert(M("congratulations"), format(M("accountRecovered"), data.mail))

            recoverAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            recoverAccount.fail()
        })
})

export const setActivationCode = aj.createAction(SET_ACTIVATION_CODE, data => {
    aj.dispatch({
        type: SET_ACTIVATION_CODE,
        activationCode: data.activationCode
    })
})

export const confirmAccount = createAsyncAction(CONFIRM_ACCOUNT, data => {
    if (_.isEmpty(data.activationCode)) {
        alert(M("problemOccoured"), M("activationCodeRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: CONFIRM_ACCOUNT,
    })

    showLoader()
    AccountApi.confirm(data.activationCode)
        .then(() => {
            hideLoader()
            alert(M("congratulations"), M("accountConfirmed"))

            confirmAccount.complete()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            confirmAccount.fail()
        })
})



export const changePassword = createAsyncAction(CHANGE_PASSWORD, data => {

    aj.dispatch({
        type: CHANGE_PASSWORD
    });

    showLoader();
    AccountApi.changePassword(data.password, data.passwordConfirm)
        .then(response => {
            hideLoader();
            SessionApi.updateUserPassword(data.password)
            SessionApi.updateLoggedUser(response.value.user);
            SessionApi.updateSessionToken(response.value.token);
            toast(M("passwordSuccessfulChanged"));
            changePassword.complete({firstLogin: false, user: response.value.user})
        })
        .catch(e => {
            hideLoader()
            alert("Attenzione!", responses.msg(e));
            changePassword.fail({firstLogin: null})
        })
});
