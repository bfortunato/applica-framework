"use strict"

import * as aj from "../aj/index";
import * as actions from "../actions/types";
import * as _ from "../libs/underscore";
import {walk} from "../utils/lang";
import {MENU} from "./types";

export const MenuStore = aj.createStore(MENU, (state = {}, action) => {

    switch (action.type) {
        case actions.SETUP_MENU:
            return _.assign(state, {
                menu: _.filter(action.menu, m => !_.has(m, "roles") || (action.user.roles != null && _.any(m.roles, r => _.any(action.user.roles, ur => r === ur.role))))
            })

        case actions.SET_ACTIVE_MENU_ITEM:
            return _.assign(state, {menu: walk(state.menu, "children", i => { i.active = (i == action.item)})})

        case actions.EXPAND_MENU_ITEM:
            return _.assign(state, {menu: walk(state.menu, "children", i => {
                if (i == action.item) {
                    i.expanded = !(action.item.expanded || false)
                }
            })})
    }

})

