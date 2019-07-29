"use strict"

import * as aj from "../aj/index";
import {createAsyncAction} from "../utils/ajex";
import * as SessionApi from "../api/session";
import {alert, hideLoader, showLoader, toast} from "../plugins";
import M from "../strings";
import _ from "underscore";
import {LOGIN, LOGOUT, RESUME_SESSION} from "./types";
import {getUserProfileImage} from "./ui";
import {setupMenu} from "./menu";

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
            toast(M("welcome") + " " +  jQuery(user.name).text());

            login.complete({user})
            performLoginUserAction(user)

        })
        .catch(e => {
            hideLoader()
            alert(M("ooops"), M("badLogin"), "error")

            login.fail()
        })
});

function performLoginUserAction (user) {
    if (user) {
        setupMenu({user})
    }

    getUserProfileImage();
}

export const resumeSession = createAsyncAction(RESUME_SESSION, data => {
    aj.dispatch({
        type: RESUME_SESSION
    })

    SessionApi.resume()
        .then(user => {
            hideLoader()
            toast(M("welcome") + " " + jQuery(user.name).text());

            resumeSession.complete({user})
            performLoginUserAction(user)
        })
        .catch(e => {
            hideLoader()

            resumeSession.fail()
        })
});

export const logout = aj.createAction(LOGOUT, data => {
    SessionApi.destroy()
        .then(() => {
            aj.dispatch({
                type: LOGOUT
            })
        })
});

