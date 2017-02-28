import * as aj from "./aj"
import { createAsyncAction, completed, failed } from "./utils/ajex"
import * as actions from "./actions"
import * as _ from "./libs/underscore"
import M from "./strings"
import {discriminate} from "./utils/ajex"
import {walk} from "./utils/lang"


export const UI = "UI";
export const UIStore = aj.createStore(UI, (state = {}, action) => {

    switch (action.type) {
        case actions.GET_USER_COVER_IMAGE:
            return _.assign(state, {error: false});

        case completed(actions.GET_USER_COVER_IMAGE):
            return _.assign(state, {error: false, cover: action.data});

        case failed(actions.GET_USER_COVER_IMAGE):
            return _.assign(state, {error: true});

        case actions.GET_USER_PROFILE_IMAGE:
            return _.assign(state, {error: false});

        case completed(actions.GET_USER_PROFILE_IMAGE):
            return _.assign(state, {error: false, profileImage: action.data});

        case failed(actions.GET_USER_PROFILE_IMAGE):
            return _.assign(state, {error: true});
    }

});



export const SESSION = "SESSION";
export const SessionStore = aj.createStore(SESSION, (state = {}, action) => {

    switch (action.type) {
        case actions.LOGIN:
            return _.assign(state, { isLoggedIn: false });

        case completed(actions.LOGIN):
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false });

        case failed(actions.LOGIN):
            return _.assign(state, { isLoggedIn: false, error: true });

        case actions.RESUME_SESSION:
            return _.assign(state, { isLoggedIn: false, resumeComplete: false });

        case completed(actions.RESUME_SESSION):
            return _.assign(state, { isLoggedIn: true, user: action.user, error: false, resumeComplete: true });

        case failed(actions.RESUME_SESSION):
            return _.assign(state, { isLoggedIn: false, error: true, resumeComplete: true });
    }

});

export const ACCOUNT = "ACCOUNT";
export const AccountStore = aj.createStore(ACCOUNT, (state = {activationCode: ""}, action) => {

    switch (action.type) {
        case actions.REGISTER:
            return _.assign(state, { registered: false, error: false });

        case completed(actions.REGISTER):
            return _.assign(state, { registered: true, error: false, name: action.name, mail: action.mail, message: action.message });

        case failed(actions.REGISTER):
            return _.assign(state, { registered: false, error: true, message: action.message });

        case actions.SET_ACTIVATION_CODE:
            return _.assign(state, { activationCode: action.activationCode });

        case actions.CONFIRM_ACCOUNT:
            return _.assign(state, { confirmed: false, error: false });

        case completed(actions.CONFIRM_ACCOUNT):
            return _.assign(state, { confirmed: true, error: false });

        case failed(actions.CONFIRM_ACCOUNT):
            return _.assign(state, { confirmed: false, error: true, message: action.message });

        case actions.RECOVER_ACCOUNT:
            return _.assign(state, { recovered: false, error: false });

        case completed(actions.RECOVER_ACCOUNT):
            return _.assign(state, { recovered: true, error: false });

        case failed(actions.RECOVER_ACCOUNT):
            return _.assign(state, { recovered: false, error: true });
    }

});


export const GRIDS = "GRIDS"
export const GridsStore = aj.createStore(GRIDS, (state = {grid: null}, action) => {

    switch (action.type) {
        case actions.GET_GRID:
            return _.assign(state, { error: false, grid: null })

        case completed(actions.GET_GRID):
            return _.assign(state, { error: false, grid: action.grid })

        case failed(actions.GET_GRID):
            return _.assign(state, { error: true, grid: null })
    }

})

export const ENTITIES = "ENTITIES"
export const EntitiesStore = aj.createStore(ENTITIES, (state = {}, action) => {

    switch (action.type) {
        case completed(actions.LOAD_ENTITIES):
            return discriminate(state, action.discriminator, {error: false, result: action.result})

        case failed(actions.LOAD_ENTITIES):
            return discriminate(state, action.discriminator, {error: true, result: null})

        case completed(actions.DELETE_ENTITIES):
            return discriminate(state, action.discriminator, {error: false, result: action.result})

        case failed(actions.DELETE_ENTITIES):
            return discriminate(state, action.discriminator, {error: true, result: null})

        case actions.NEW_ENTITY:
            return discriminate(state, action.discriminator, {error: false, data: null, saved: false})

        case actions.GET_ENTITY:
            return discriminate(state, action.discriminator, {error: false, data: null, saved: false})

        case completed(actions.GET_ENTITY):
            return discriminate(state, action.discriminator, {error: false, data: action.data})

        case failed(actions.GET_ENTITY): 
            return discriminate(state, action.discriminator, {error: true, data: null})

        case actions.FREE_ENTITIES:
            return _.omit(state, action.discriminator)

        case actions.SAVE_ENTITY:
            return discriminate(state, action.discriminator, {error: false, saved: false})

        case completed(actions.SAVE_ENTITY):
            return discriminate(state, action.discriminator, {error: false, saved: true})

        case failed(actions.SAVE_ENTITY):
            return discriminate(state, action.discriminator, {error: true, saved: false})

    }

})

export const LOOKUP = "LOOKUP"
export const LookupStore = aj.createStore(LOOKUP, (state = {}, action) => {

    switch (action.type) {
        case completed(actions.GET_LOOKUP_RESULT):
            return discriminate(state, action.discriminator, { error: false, result: action.result })

        case failed(actions.GET_LOOKUP_RESULT):
            return discriminate(state, action.discriminator, { error: true, result: null })

        case completed(actions.GET_LOOKUP_VALUES):
            return discriminate(state, action.discriminator, { error: false, values: action.values })

        case failed(actions.GET_LOOKUP_VALUES):
            return discriminate(state, action.discriminator, { error: true, values: null })

        case actions.FREE_LOOKUP:
            return _.omit(state, action.discriminator)

    }
})

export const MENU = "MENU"
export const MenuStore = aj.createStore(MENU, (state = {}, action) => {

    switch (action.type) {
        case actions.SETUP_MENU:
            return _.assign(state, {menu: action.menu})

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


export const SELECT = "SELECT"
export const SelectStore = aj.createStore(SELECT, (state = {}, action) => {

    switch (action.type) {

        case actions.GET_SELECT_VALUES:
            return discriminate(state, action.discriminator, { error: false, loading: true })

        case completed(actions.GET_SELECT_VALUES):
            return discriminate(state, action.discriminator, { error: false, loading: false, values: action.values })

        case failed(actions.GET_SELECT_VALUES):
            return discriminate(state, action.discriminator, { error: true, loading: false, values: null })

        case actions.FREE_SELECT:
            return _.omit(state, action.discriminator)

    }
})

