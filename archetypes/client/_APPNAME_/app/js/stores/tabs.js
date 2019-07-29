"use strict"
import {TABS} from "./types";
import * as aj from "../aj/index";
import * as actions from "../actions/types";
import {discriminate} from "../utils/ajex";

export function tabsDefaultState() {
    return {
        selectedTab: null
    }
}

export const TabsStore = aj.createStore(TABS, (state = tabsDefaultState(), action) => {

    switch (action.type) {
        case actions.SET_SELECTED_TAB:
            return discriminate(state, action.discriminator, {selectedTab: action.selectedTab})
        case actions.CLEAR_TAB_STATE:
            return discriminate(state, action.discriminator, tabsDefaultState())

    }

});