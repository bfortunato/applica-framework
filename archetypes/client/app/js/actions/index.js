import * as aj from "../aj"
import * as session from "../api/session"
import * as account from "../api/account"
import * as responses from "../api/responses"
import { alert, confirm, showLoader, hideLoader, toast } from "../plugins"
import strings from "../strings"

export const LOGIN = "LOGIN";
export const RESUME_SESSION = "RESUME_SESSION";
export const LOGOUT = "LOGOUT";
export const RECOVER = "RECOVER";
export const REGISTER = "REGISTER";
export const REGISTRATION_COMPLETE = "REGISTRATION_COMPLETE"
export const REGISTRATION_ERROR = "REGISTRATION_ERROR"


export const login = aj.createAction(LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert("Cannot login", "Email and password are required", "warning");
        return;
    }

    showLoader()
    session.start(data.mail, data.password)
        .then(user => {
            hideLoader()

            aj.dispatch({
                type: LOGIN,
                user: user,
                isLoggedIn: true
            })

            toast(strings.welcome + " " + user.name);
        })
        .catch(e => {
            hideLoader()

            aj.dispatch({
                type: LOGIN,
                user: null,
                isLoggedIn: false
            })

            alert(strings.ooops, strings.badLogin, "error")
        })
});


export const resumeSession = aj.createAction(RESUME_SESSION, data => {
    session.resume()
        .then(user => {
            hideLoader()

            aj.dispatch({
                type: RESUME_SESSION,
                user: user,
                isLoggedIn: true
            })

            toast(strings.welcome + " " + user.name);
        })
        .catch(e => {
            hideLoader()

            aj.dispatch({
                type: RESUME_SESSION,
                user: null,
                isLoggedIn: false
            })
        })

});


export const logout = aj.createAction(LOGOUT, data => {
    session.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});


export const register = aj.createAction(REGISTER, data => {
    aj.dispatch({
        type: REGISTER
    })

    showLoader(strings.registering)
    account.register(data.name, data.mail, data.password)
        .then(() => {
            let message = "Hi {this.state.name}. Your registration is complete. A confirmation link was sent to {this.state.mail}. Please confirm before login"
            registrationComplete({name: data.name, mail: data.mail})
        })
        .catch(e => {
            alert(strings.ooops, responses.msg(e), "error")

            registrationError({errorCode: e})
        })
});


export const registrationComplete = aj.createAction(REGISTRATION_COMPLETE, data => {
    aj.dispatch({
        type: REGISTRATION_COMPLETE,
        mail: data.mail,
        name: data.name
    })
})

export const registrationError = aj.createAction(REGISTRATION_ERROR, data => {
    aj.dispatch({
        type: REGISTRATION_ERROR,
        error: data.errorCode
    })
})

export const recover = aj.createAction(RECOVER, data => {
    aj.dispatch({
        type: RECOVER,
        loading: true
    })
});


