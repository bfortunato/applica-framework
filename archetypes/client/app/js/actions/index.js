import * as aj from "../aj"
import * as session from "../api/session"
import * as responses from "../api/responses"
import { alert, confirm, showLoader, hideLoader, toast } from "../plugins"

export const LOGIN = "LOGIN";
export const RESUME_SESSION = "RESUME_SESSION";
export const LOGOUT = "LOGOUT";
export const REGISTER = "REGISTER";
export const RECOVER = "RECOVER";

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

            toast("Welcome " + user.mail);
        })
        .catch(e => {
            hideLoader()

            aj.dispatch({
                type: LOGIN,
                user: null,
                isLoggedIn: false
            })

            alert("Oooops...", "Cannot login! Please check your email address or password!", "error")
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

            toast("Welcome " + user.mail);
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
        type: REGISTER,
        loading: true
    })
});


export const recover = aj.createAction(RECOVER, data => {
    aj.dispatch({
        type: RECOVER,
        loading: true
    })
});


