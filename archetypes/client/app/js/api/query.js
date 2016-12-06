"use strict"

export const LIKE = "like"
export const GT = "gt"
export const NE = "ne"
export const GTE = "gte"
export const LT = "lt"
export const LTE = "lte"
export const EQ = "eq"
export const IN = "in"
export const LIN = "lin"
export const NIN = "nin"
export const LNIN = "lnin"
export const ID = "id"
export const OR = "or"
export const AND = "and"
export const CUSTOM = "custom"
export const RANGE = "range"

export class Query {
    constructor() {
        this.page = 0
        this.rowsPerPage = 0
        this.sorts = []
        this.filters = []
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
}

export function query(init) {

}