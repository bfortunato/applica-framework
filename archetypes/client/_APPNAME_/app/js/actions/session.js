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

export const LOGIN = "LOGIN";
export const login = createAsyncAction(LOGIN, data => {
    if (_.isEmpty(data.mail) || _.isEmpty(data.password)) {
        alert(M("problemOccoured"), M("mailAndPasswordRequired"), "warning")
        return;
    }

    aj.dispatch({
        type: LOGIN
    })

    showLoader()
    SessionApi.start(data.mail, data.password)
        .then(user => {
            hideLoader()
            toast(M("welcome") + " " + user.name);

            login.complete({user})

            getUserProfileImage()
            getUserCoverImage()
        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), M("badLogin"), "error")

            login.fail()
        })
});

export const RESUME_SESSION = "RESUME_SESSION"
export const resumeSession = createAsyncAction(RESUME_SESSION, data => {
    aj.dispatch({
        type: RESUME_SESSION
    })

    SessionApi.resume()
        .then(user => {
            hideLoader()
            toast(M("welcome") + " " + user.name);

            resumeSession.complete({user})
            getUserProfileImage()
            getUserCoverImage()
        })
        .catch(e => {
            hideLoader()

            resumeSession.fail()
        })
});

export const LOGOUT = "LOGOUT";
export const logout = aj.createAction(LOGOUT, data => {
    SessionApi.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});