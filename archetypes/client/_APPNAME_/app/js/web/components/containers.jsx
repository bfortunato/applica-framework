"use strict"

import * as datasource from "../../utils/datasource"
import {LookupStore, SelectStore} from "../../stores"
import {
    freeLookup,
    freeSelect,
    getLookupResult,
    getLookupValues,
    getSelectEntities,
    getSelectValues
} from "../../actions"
import {discriminated} from "../../../utils/ajex"
import * as query from "../../api/query"
import {Control, Lookup, Select} from "./forms"
import {optional} from "../../utils/lang"

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
    return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class EntitiesLookupContainer extends Control  {
    constructor(props) {
        super(props)

        this.discriminator = props.id
        if (_.isEmpty(this.discriminator)) {
            throw new Error("Please specify an id of this lookup")
        }

        this.query = query.create()
        this.query.setPage(1)
        this.query.setRowsPerPage(20)
        this.__queryOnChange = () => {
            getLookupResult({discriminator: this.discriminator, entity: this.props.entity, query: this.query})
        }

        this.datasource = datasource.create()

        this.state = {result: {}}
    }

    componentDidMount() {
        LookupStore.subscribe(this, state => {
        	this.datasource.setData(discriminated(state, this.discriminator).result)
        })

        this.query.on("change", this.__queryOnChange)
    }

    componentWillUnmount() {
    	LookupStore.unsubscribe(this)

        this.query.off("change", this.__queryOnChange)

        freeLookup({discriminator: this.discriminator})
    }

    render() {
        return React.createElement(Lookup, _.assign({}, this.props, {query: this.query, datasource: this.datasource}))
    }
}

export class ValuesLookupContainer extends Control  {
    constructor(props) {
        super(props)

        this.discriminator = props.id
        if (_.isEmpty(this.discriminator)) {
            throw new Error("Please specify an id for lookup")
        }

        if (_.isEmpty(this.props.collection)) {
            throw new Error("Please specify a collection for lookup")
        }

        this.__queryOnChange = () => {
            getLookupValues({discriminator: this.discriminator, collection: this.props.collection, keyword: this.query.keyword})
        }

        this.query = query.create()
        this.datasource = datasource.create()

        this.state = {values: {}}
    }

    componentDidMount() {
        LookupStore.subscribe(this, state => {
            this.datasource.setData(discriminated(state, this.discriminator).values)
        })

        this.query.on("change", this.__queryOnChange)
    }

    componentWillUnmount() {
        LookupStore.unsubscribe(this)

        this.query.off("change", this.__queryOnChange)

        freeLookup({discriminator: this.discriminator})
    }

    render() {
        return React.createElement(Lookup, _.assign({}, this.props, {query: this.query, datasource: this.datasource}))
    }
}


export class ValuesSelectContainer extends Control {

    constructor(props) {
        super(props)

        this.discriminator = props.id

        if (_.isEmpty(this.discriminator)) {
            throw new Error("Please specify an id for select")
        }

        if (_.isEmpty(this.props.collection)) {
            throw new Error("Please specify a collection for select")
        }

        this.datasource = datasource.create()
    }

    reload() {
        getSelectValues({discriminator: this.discriminator, collection: this.props.collection, params: this.getParams()})
    }

    componentDidMount() {
        SelectStore.subscribe(this,  state => {
            this.datasource.setData(discriminated(state, this.discriminator).values)
        })

        this.reload()
    }

    getParams() {
        return optional(this.props.params, {})
    }

    componentWillUnmount() {
        SelectStore.unsubscribe(this)

        freeSelect({discriminator: this.discriminator})
    }

    render() {
        return React.createElement(Select, _.assign({}, this.props, {datasource: this.datasource}))
    }

}

export class EntitiesSelectContainer extends Control {

    constructor(props) {
        super(props)

        if (_.isEmpty(this.props.entity)) {
            throw new Error("Please specify an entity for select")
        }

        this.discriminator = `entity_select_${this.props.entity}`
        this.datasource = datasource.create()
        this.query = null
    }

    componentDidMount() {
        SelectStore.subscribe(this,  state => {
            this.datasource.setData(discriminated(state, this.discriminator).values)
        })

        let model = this.props.model

        this.query = null
        if (this.props.query) {
            if (_.isFunction(this.props.query)) {
                this.query = this.props.query(model)
            } else {
                this.query = this.props.query
            }
        }

        if (!_.isEmpty(this.query)) {
            this.__onQueryChange = () => {
                getSelectEntities({discriminator: this.discriminator, entity: this.props.entity, query: this.query})
            }

            this.query.on("change", this.__onQueryChange)
        }

        getSelectEntities({discriminator: this.discriminator, entity: this.props.entity, query: this.query})
    }

    componentWillUnmount() {
        SelectStore.unsubscribe(this)
        if (this.query) {
            this.query.off("change", this.__onQueryChange)
        }
        freeSelect({discriminator: this.discriminator})
    }

    render() {
        return React.createElement(Select, _.assign({}, this.props, {datasource: this.datasource}))
    }

}