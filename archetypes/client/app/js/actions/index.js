import * as aj from "../aj"
import * as session from "../api/session"
import * as account from "../api/account"
import * as responses from "../api/responses"
import { alert, confirm, showLoader, hideLoader, toast } from "../plugins"
import { format } from "../utils/lang"
import strings from "../strings"


export const LOGIN = "LOGIN";
export const login = aj.createAction(LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(strings.cannotLogin, strings.mailAndPasswordRequired, "warning")
        return;
    }

    aj.dispatch({
        type: LOGIN
    })

    showLoader()
    session.start(data.mail, data.password)
        .then(user => {
            hideLoader()
            toast(strings.welcome + " " + user.name);

            loginComplete({user})
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, strings.badLogin, "error")

            loginError()
        })
});

export const LOGIN_COMPLETE = "LOGIN_COMPLETE"
export const loginComplete = aj.createAction(LOGIN_COMPLETE, data => {
    aj.dispatch({
        type: LOGIN_COMPLETE,
        user: data.user
    })
})

export const LOGIN_ERROR = "LOGIN_ERROR"
export const loginError = aj.createAction(LOGIN_ERROR, data => {
    aj.dispatch({
        type: LOGIN_ERROR
    })
})

export const RESUME_SESSION = "RESUME_SESSION"
export const resumeSession = aj.createAction(RESUME_SESSION, data => {
    aj.dispatch({
        type: RESUME_SESSION
    })

    session.resume()
        .then(user => {
            hideLoader()
            toast(strings.welcome + " " + user.name);

            resumeSessionComplete({user})
        })
        .catch(e => {
            hideLoader()

            resumeSessionError()
        })
});

export const RESUME_SESSION_COMPLETE = "RESUME_SESSION_COMPLETE"
export const resumeSessionComplete = aj.createAction(RESUME_SESSION_COMPLETE, data => {
    aj.dispatch({
        type: RESUME_SESSION_COMPLETE,
        user: data.user
    })
})

export const RESUME_SESSION_ERROR = "RESUME_SESSION_ERROR"
export const resumeSessionError = aj.createAction(RESUME_SESSION_ERROR, data => {
    aj.dispatch({
        type: RESUME_SESSION_ERROR
    })
})

export const LOGOUT = "LOGOUT";
export const logout = aj.createAction(LOGOUT, data => {
    session.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});

export const REGISTER = "REGISTER";
export const register = aj.createAction(REGISTER, data => {
    if (_.isEmpty(data.name) || _.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(strings.cannotRegister, strings.nameMailAndPasswordRequired, "warning")
        return;
    }

    aj.dispatch({
        type: REGISTER
    })

    showLoader(strings.registering)
    account.register(data.name, data.mail, data.password)
        .then(() => {
            hideLoader()

            let message = format(strings.welcomeMessage, data.name, data.mail)
            registrationComplete({name: data.name, mail: data.mail, message})
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, responses.msg(e), "error")

            registrationError()
        })
});

export const REGISTRATION_COMPLETE = "REGISTRATION_COMPLETE"
export const registrationComplete = aj.createAction(REGISTRATION_COMPLETE, data => {
    aj.dispatch({
        type: REGISTRATION_COMPLETE,
        mail: data.mail,
        name: data.name
    })
})

export const REGISTRATION_ERROR = "REGISTRATION_ERROR"
export const registrationError = aj.createAction(REGISTRATION_ERROR, data => {
    aj.dispatch({
        type: REGISTRATION_ERROR
    })
})

export const RECOVER_ACCOUNT = "RECOVER_ACCOUNT"
export const recoverAccount = aj.createAction(RECOVER_ACCOUNT, data => {
    aj.dispatch({
        type: RECOVER_ACCOUNT
    })
})

export const RECOVER_ACCOUNT_COMPLETE = "RECOVER_ACCOUNT_COMPLETE"
export const recoverAccountComplete = aj.createAction(RECOVER_ACCOUNT_COMPLETE, data => {
    aj.dispatch({
        type: RECOVER_ACCOUNT_COMPLETE
    })
})

export const RECOVER_ACCOUNT_ERROR = "RECOVER_ACCOUNT_ERROR"
export const recoverAccountError = aj.createAction(RECOVER_ACCOUNT_ERROR, data => {
    aj.dispatch({
        type: RECOVER_ACCOUNT_ERROR
    })
})

export const SET_ACTIVATION_CODE = "SET_ACTIVATION_CODE"
export const setActivationCode = aj.createAction(SET_ACTIVATION_CODE, data => {
    aj.dispatch({
        type: SET_ACTIVATION_CODE,
        activationCode: data.activationCode
    })
})

export const CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT"
export const confirmAccount = aj.createAction(CONFIRM_ACCOUNT, data => {
    if (_.isEmpty(data.activationCode)) {
        alert(strings.cannotConfirmAccount, strings.activationCodeRequired, "warning")
        return;
    }

    aj.dispatch({
        type: CONFIRM_ACCOUNT,
    })

    showLoader()
    account.confirm(data.activationCode)
        .then(() => {
            hideLoader()
            alert(strings.congratulations, strings.accountConfirmed)

            confirmAccountComplete()
        })
        .catch(e => {
            hideLoader()
            alert(strings.ooops, responses.msg(e), "error")

            confirmAccountError()
        })
})

export const CONFIRM_ACCOUNT_COMPLETE = "CONFIRM_ACCOUNT_COMPLETE"
export const confirmAccountComplete = aj.createAction(CONFIRM_ACCOUNT_COMPLETE, data => {
    aj.dispatch({
        type: CONFIRM_ACCOUNT_COMPLETE
    })
})

export const CONFIRM_ACCOUNT_ERROR = "CONFIRM_ACCOUNT_ERROR"
export const confirmAccountError = aj.createAction(CONFIRM_ACCOUNT_ERROR, data => {
    aj.dispatch({
        type: CONFIRM_ACCOUNT_ERROR
    })
})