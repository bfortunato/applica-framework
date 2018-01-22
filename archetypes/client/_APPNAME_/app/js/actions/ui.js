"use strict"

import * as aj from "../aj/index";
import {createAsyncAction} from "../utils/ajex";
import * as SessionApi from "../api/session";
import * as AccountApi from "../api/account";
import {GET_USER_COVER_IMAGE, GET_USER_PROFILE_IMAGE} from "./types";


export const getUserCoverImage = createAsyncAction(GET_USER_COVER_IMAGE, data => {
    let user = SessionApi.getLoggedUser()
    if (user == null) {
        return
    }

    aj.dispatch({
        type: GET_USER_COVER_IMAGE
    })

    AccountApi.getCoverImage(user.id)
        .then(data => {
            getUserCoverImage.complete({data: data.value})
        })
        .catch(e => {
            getUserCoverImage.fail({e})
        })

})

export const getUserProfileImage = createAsyncAction(GET_USER_PROFILE_IMAGE, data => {
    let user = SessionApi.getLoggedUser()
    if (user == null) {
        return
    }

    aj.dispatch({
        type: GET_USER_PROFILE_IMAGE
    })

    AccountApi.getProfileImage(user.id)
        .then(data => {
            getUserProfileImage.complete({data: data.value})
        })
        .catch(e => {
            getUserProfileImage.fail({e})
        })
})