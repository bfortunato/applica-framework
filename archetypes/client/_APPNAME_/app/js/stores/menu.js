"use strict"

import * as aj from "../aj/index";
import * as actions from "../actions/types";
import _ from "underscore";
import {walk} from "../utils/lang";
import {MENU} from "./types";
import {hasPermission} from "../api/session";

export const MenuStore = aj.createStore(MENU, (state = {}, action) => {

    switch(action.type)
{
case
    actions.SETUP_MENU:
        let menu = JSON.parse(JSON.stringify(action.menu))

    //Clear childrens menu if user hasn't permission
    _.each(menu, m => {
        m.children = _.filter(m.children, c => _.isEmpty(c.permissions) || hasPermission(c.permissions)
)
})

    //Clear item menu if are empty
    return _.assign(state, {
        menu: _.filter(menu, m => (!_.isEmpty(m.children) && m.href === undefined) || (_.isEmpty(m.children) && m.href !== undefined && hasPermission(m.permissions)))
})


case
    actions.SET_ACTIVE_MENU_ITEM
:
    return _.assign(state, {menu: walk(state.menu, "children", i => {i.active = (i == action.item)})
})

case
    actions.EXPAND_MENU_ITEM
:
    return _.assign(state, {
        menu: walk(state.menu, "children", i => {
            if(i == action.item)
    {
        i.expanded = !(action.item.expanded || false)
    }
})
})
}

})

