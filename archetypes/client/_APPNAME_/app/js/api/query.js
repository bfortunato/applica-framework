"use strict"

import _ from "underscore";
import {Observable} from "../aj/events";

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

export class Query extends Observable {
    constructor(init) {
        super()

        this.page = 0
        this.rowsPerPage = 0
        this.sorts = []
        this.filters = []
        this.keyword = null

        this.invokationEnabled = true

        _.assign(this, init)
    }

    live() {
        this.invokationEnabled = true
    }

    die() {
        this.invokationEnabled = false
    }

    filter(type, property, value) {

        if ((value === null || value === undefined) && _.any(this.filters, f => f.property === property)) {
            this.unfilter(property)
            return this
        }

        let current = _.find(this.filters, s => s.property == property)
        if (current) {
            current.value = value
            current.type = type
        } else {
            this.filters.push({property, type, value})
        }

        this.invokeChange()

        return this
    }

    unfilter(property) {
        this.filters = _.filter(this.filters, f => f.property != property)

        this.invokeChange()
        return this
    }

    like(prop, value) {
        this.filter(LIKE, prop, value)
        return this
    }

    gt(prop, value) {
        this.filter(GT, prop, value)
        return this
    }

    ne(prop, value) {
        this.filter(NE, prop, value)
        return this
    }

    gte(prop, value) {
        this.filter(GTE, prop, value)
        return this
    }

    lt(prop, value) {
        this.filter(LT, prop, value)
        return this
    }

    lte(prop, value) {
        this.filter(LTE, prop, value)
        return this
    }

    eq(prop, value) {
        this.filter(EQ, prop, value)
        return this
    }

    in(prop, value) {
        this.filter(IN, prop, value)
        return this
    }

    nin(prop, value) {
        this.filter(NE, prop, value)
        return this
    }

    id(prop, value) {
        this.filter(ID, prop, value)
        return this
    }

    or(prop, value) {
        this.filter(OR, prop, value)
        return this
    }

    and(prop, value) {
        this.filter(AND, prop, value)
        return this
    }

    range(prop, value) {
        this.filter(RANGE, prop, value)
        return this
    }

    gt(prop, value) {
        this.filter(GT, prop, value)
        return this
    }

    ne(prop, value) {
        this.filter(NE, prop, value)
        return this
    }

    sort(prop, descending) {
        let current = _.find(this.sorts, s => s.property == prop)
        if (current) {
            current.descending = descending
        } else {
            this.sorts.push({property: prop, descending})
        }

        this.invokeChange()
        return this
    }

    unsort(prop) {
        this.sorts = _.filter(this.sorts, s => s.property != prop)

        this.invokeChange()
        return this
    }

    clearFilters() {
        this.filters = []
        this.invokeChange()
        return this
    }

    setPage(page) {
        this.page = page
        this.invokeChange()
        return this
    }

    setRowsPerPage(rowsPerPage) {
        this.rowsPerPage = rowsPerPage
        this.invokeChange()
        return this
    }

    setKeyword(newValue) {
        this.keyword = newValue
        this.invokeChange()
        return this
    }

    invokeChange() {
        if (this.invokationEnabled) {
            this.invoke("change")
        }
    }

    cleaned() {
        return {
            page: this.page,
            rowsPerPage: this.rowsPerPage,
            sorts: this.sorts,
            filters: this.filters,
            keyword: this.keyword
        }
    }
}

export function create(init) {
    let query = new Query(init)
    return query
}