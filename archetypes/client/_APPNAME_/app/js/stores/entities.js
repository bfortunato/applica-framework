import * as aj from "../aj/index";
import {completed, discriminate, failed} from "../utils/ajex";
import * as actions from "../actions/types";
import * as _ from "../libs/underscore";
import {ENTITIES, GRIDS, LOOKUP, SELECT} from "./types";


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
            return discriminate(state, action.discriminator, {error: false, data: {}, saved: false})

        case actions.GET_ENTITY:
            return discriminate(state, action.discriminator, {error: false, data: null, saved: false})

        case completed(actions.GET_ENTITY):
            return discriminate(state, action.discriminator, {error: false, data: action.data})

        case failed(actions.GET_ENTITY):
            return discriminate(state, action.discriminator, {
                error: true,
                data: null,
                validationError: false,
                validationResult: null
            })

        case actions.FREE_ENTITIES:
            return _.omit(state, action.discriminator)

        case actions.SAVE_ENTITY:
            return discriminate(state, action.discriminator, {
                error: false,
                getCompleted: false,
                validationError: false,
                validationResult: null,
                saved: false})

        case completed(actions.SAVE_ENTITY):
            return discriminate(state, action.discriminator, {
                error: false,
                data: action.data,
                saved: true,
                validationError: false,
                validationResult: null
            })

        case failed(actions.SAVE_ENTITY):
            return discriminate(state, action.discriminator, {
                error: true,
                data: action.data,
                saved: false,
                validationError: action.validationError,
                validationResult: action.validationResult
            })

    }

})

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

export const SelectStore = aj.createStore(SELECT, (state = {}, action) => {

    switch (action.type) {

        case actions.GET_SELECT_VALUES:
            return discriminate(state, action.discriminator, { error: false, loading: true })

        case completed(actions.GET_SELECT_VALUES):
            return discriminate(state, action.discriminator, { error: false, loading: false, values: action.values })

        case failed(actions.GET_SELECT_VALUES):
            return discriminate(state, action.discriminator, { error: true, loading: false, values: null })

        case actions.GET_SELECT_ENTITIES:
            return discriminate(state, action.discriminator, { error: false, loading: true })

        case completed(actions.GET_SELECT_ENTITIES):
            return discriminate(state, action.discriminator, { error: false, loading: false, values: action.entities })

        case failed(actions.GET_SELECT_ENTITIES):
            return discriminate(state, action.discriminator, { error: true, loading: false, values: null })

        case actions.FREE_SELECT:
            return _.omit(state, action.discriminator)

    }
})

