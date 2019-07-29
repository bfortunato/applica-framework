"use strict"

import * as actions from "./types";
import * as aj from "../aj";

export const setSelectedTab = aj.createAction(actions.SET_SELECTED_TAB, data => {
    aj.dispatch({
        type: actions.SET_SELECTED_TAB,
        discriminator: data.discriminator,
        selectedTab: data.selectedTab
    })
});

export const clearTabState = aj.createAction(actions.CLEAR_TAB_STATE, data => {
    aj.dispatch({
        type: actions.CLEAR_TAB_STATE,
        discriminator: data.discriminator,
    })
});