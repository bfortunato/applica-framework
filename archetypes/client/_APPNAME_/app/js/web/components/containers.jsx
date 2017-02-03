"use strict"

import * as datasource from "../../utils/datasource"
import {LookupStore} from "../../stores"
import {getLookupResult, getLookupValues, freeLookup} from "../../actions"
import {discriminated} from "../../../utils/ajex"
import * as query from "../../api/query"
import {Lookup, Control} from "./forms"

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
            console.log(this.query)
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