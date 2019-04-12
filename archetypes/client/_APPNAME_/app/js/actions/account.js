"use strict"

import * as aj from "../aj/index";
import {createAsyncAction} from "../utils/ajex";
import * as SessionApi from "../api/session";
import * as AccountApi from "../api/account";
import * as responses from "../api/responses";
import {alert, hideLoader, showLoader, toast} from "../plugins";
import {format} from "../utils/lang";
import M from "../strings";
import _ from "underscore";
import {
    CHANGE_PASSWORD,
    CONFIRM_ACCOUNT,
    RECOVER_ACCOUNT,
    REGISTER,
    REQUEST_RECOVERY_CODE,
    RESET_PASSWORD,
    RESET_USER_PASSWORD,
    SET_ACTIVATION_CODE,
    VALIDATE_RECOVERY_CODE
} from "./types";

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


export const requestRecoveryCode = createAsyncAction(REQUEST_RECOVERY_CODE, data => {
    if (_.isEmpty(data.mail)) {
        alert(M("problemOccoured"), M("mailRequired"), "warning")
        return;
    }
    showLoader()
    AccountApi.requestRecoveryCode(data.mail)
        .then(resp => {
            hideLoader()
            alert(M("congratulations"), format(M("recoveryCodeSent"), data.mail))

            requestRecoveryCode.complete({
                mail: data.mail
            })
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), responses.msg(e), "error")

            requestRecoveryCode.fail()
        })
})

export const validateRecoveryCode = createAsyncAction(VALIDATE_RECOVERY_CODE, data => {
    if (_.isEmpty(data.mail)) {
        alert(M("problemOccoured"), M("mailRequired"), "warning")
        return;
    }
    if (_.isNull(data.code) || _.isUndefined(data.code) || data.code.length === 0) {
        alert(M("problemOccoured"), M("validationCodeRequired"), "warning");
        return;
    }
    let codeSize = 5;
    if (data.code.length !== codeSize) {
        alert(M("problemOccoured"), format(M("validationCodeLengthMismatch"),codeSize), "warning");
        return;
    }
    showLoader();
    AccountApi.validateRecoveryCode(data.mail,data.code)
        .then(resp => {
            hideLoader();
            validateRecoveryCode.complete({
                mail: data.mail,
                code: data.code,
            });
        })
        .catch(e => {
            hideLoader();
            alert(M("ooops"), responses.msg(e), "error");

            validateRecoveryCode.fail();
        });
})

export const resetPassword = createAsyncAction(RESET_PASSWORD, data => {
    if (_.isEmpty(data.mail)) {
        alert(M("problemOccoured"), M("mailRequired"), "warning")
        return;
    }
    if (_.isNull(data.code) || _.isUndefined(data.code) || data.code.length === 0) {
        alert(M("problemOccoured"), M("validationCodeRequired"), "warning");
        return;
    }
    let codeSize = 5;
    if (data.code.length !== codeSize) {
        alert(M("problemOccoured"), format(M("validationCodeLengthMismatch"),codeSize), "warning");
        return;
    }
    if (_.isEmpty(data.password) | _.isUndefined(data.password) | _.isNull(data.password)) {
        alert(M("problemOccoured"), M("passwordRequired"), "warning")
        return;
    }
    if (_.isEmpty(data.passwordConfirm) | _.isUndefined(data.passwordConfirm) | _.isNull(data.passwordConfirm)) {
        alert(M("problemOccoured"), M("passwordConfirmRequired"), "warning")
        return;
    }
    if (data.password !== data.passwordConfirm) {
        alert(M("problemOccoured"), M("passwordConfirmMismatch"), "warning")
        return;
    }
    showLoader();
    AccountApi.resetPassword(data.mail, data.code, data.password, data.passwordConfirm)
        .then(resp => {
            hideLoader();
            resetPassword.complete();
        })
        .catch(e => {
            hideLoader();
            alert("Attenzione!", responses.msg(e));
            resetPassword.fail();
        });
})



export const resetUserPassword = createAsyncAction(RESET_USER_PASSWORD, data => {

    aj.dispatch({
        type: RESET_USER_PASSWORD
    });

    showLoader();
    AccountApi.resetUserPassword(data.id)
        .then(response => {
            hideLoader();
            toast(M("passwordSuccessfulChanged"));
            resetUserPassword.complete()
        })
        .catch(e => {
            hideLoader();
            alert("Attenzione!", responses.msg(e));
            resetUserPassword.fail()
        })
});

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
