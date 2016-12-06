"use strict"

import * as _ from "../libs/underscore"

export const LIKE = "like"
export const GT = "gt"
export const NE = "ne"
export const GTE = "gte"
export const LT = "lt"
export const LTE = "lte"
export const EQ = "eq"
export const IN = "in"
export const NIN = "nin"
export const ID = "id"
export const OR = "or"
export const AND = "and"
export const RANGE = "range"

export class Query {
    constructor(init) {
        this.page = 0
        this.rowsPerPage = 0
        this.sorts = []
        this.filters = []

        _.assign(this, init)
    }

    filter(type, property, value) {
        this.filters.push({type, property, value})
    }

    like(prop, value) {
        this.filter(LIKE, prop, value)
    }

    gt(prop, value) {
        this.filter(GT, prop, value)
    }

    ne(prop, value) {
        this.filter(NE, prop, value)
    }

    gte(prop, value) {
        this.filter(GTE, prop, value)
    }

    lt(prop, value) {
        this.filter(LT, prop, value)
    }

    lte(prop, value) {
        this.filter(LTE, prop, value)
    }

    eq(prop, value) {
        this.filter(EQ, prop, value)
    }

    in(prop, value) {
        this.filter(IN, prop, value)
    }

    nin(prop, value) {
        this.filter(NE, prop, value)
    }

    id(prop, value) {
        this.filter(ID, prop, value)
    }

    or(prop, value) {
        this.filter(OR, prop, value)
    }

    and(prop, value) {
        this.filter(AND, prop, value)
    }

    range(prop, value) {
        this.filter(RANGE, prop, value)
    }

    gt(prop, value) {
        this.filter(GT, prop, value)
    }

    ne(prop, value) {
        this.filter(NE, prop, value)
    }

    sort(prop, descending) {
        let current = _.find(s => s.property == prop)
        if (current) {
            current.descending = descending
        } else {
            this.sorts.push({property: prop, descending})
        }

    }

    unsort(prop) {
        this.sorts = _.filter(this.sorts, s => s.property != prop)
    }
}

export function create(init) {
    let query = new Query(init)
    return query
}