import * as aj from "../aj/index";
import {EXPAND_MENU_ITEM, SET_ACTIVE_MENU_ITEM} from "./types";
import menu from "../model/menu";


export const SETUP_MENU = "SETUP_MENU"
export const setupMenu = aj.createAction(SETUP_MENU, data => {
    aj.dispatch({
        type: SETUP_MENU,
        user: data.user,
        menu: menu
    })
})


export const setActiveMenuItem = aj.createAction(SET_ACTIVE_MENU_ITEM, data => {
    aj.dispatch({
        type: SET_ACTIVE_MENU_ITEM,
        item: data.item
    })
})

export const expandMenuItem = aj.createAction(EXPAND_MENU_ITEM, data => {
    aj.dispatch({
        type: EXPAND_MENU_ITEM,
        item: data.item
    })
})
