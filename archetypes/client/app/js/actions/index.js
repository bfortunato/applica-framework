import * as types from "./types"
import * as aj from "../aj"
import * as auth from "../framework/auth"
import { alert, confirm, showLoader, hideLoader } from "../plugins"

export const getMessage = aj.createAction(types.GET_MESSAGE, data => {
    aj.dispatch({
        type: types.GET_MESSAGE,
        message: "Hello World"
    })
});


export const showLoading = aj.createAction(types.SHOW_LOADING, data => {
    aj.dispatch({
        type: types.SHOW_LOADING,
        loading: true
    })
});


export const login = aj.createAction(types.LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        return;
    }

    showLoader()
    auth.start(data.mail, data.password)
        .then(user => {
            hideLoader()

            aj.dispatch({
                type: types.LOGIN,
                user: user,
                loggedIn: true
            })
        })
        .catch(e => {
            hideLoader()
            logger.e(e);

            alert("Oooops...", "Cannot login! Please check your email address or password!")

            aj.dispatch({
                type: types.LOGIN,
                user: null,
                loggedIn: false
            })
        })
});


export const resumeSession = aj.createAction(types.RESUME_SESSION, data => {
    auth.resume()
        .then(user => {
            aj.dispatch({
                type: types.RESUME_SESSION,
                user: user,
                error: false,
                message: null
            })
        })
        .catch(e => {
            aj.dispatch({
                type: types.RESUME_SESSION,
                user: null,
                error: true,
                message: null
            })
        })

});




export const register = aj.createAction(types.REGISTER, data => {
    aj.dispatch({
        type: types.REGISTER,
        loading: true
    })
});


export const recover = aj.createAction(types.RECOVER, data => {
    aj.dispatch({
        type: types.RECOVER,
        loading: true
    })
});


export const hideLoading = aj.createAction(types.HIDE_LOADING, data => {
    aj.dispatch({
        type: types.HIDE_LOADING,
        loading: false
    })
});