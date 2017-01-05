"use strict"

import * as datasource from "../../utils/datasource"
import {LookupStore} from "../../stores"
import {getLookupResult, freeLookupResult} from "../../actions"
import {discriminated} from "../../../utils/ajex"
import * as query from "../../api/query"
import {Control} from "./forms"

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
    return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class EntitiesLookupContainer extends Control  {
    constructor(props) {
        super(props)

        this.discriminator = nextLookupDiscriminator()

        this.query = query.create()
        this.query.setPage(1)
        this.query.setRowsPerPage(20)
        this.__queryOnChange = () => {
            getLookupResult({discriminator: this.discriminator, entity: this.props.field.entity, query: this.query})
        }

        this.datasource = datasource.create()

        this.state = {result: {}}
    }

    componentDidMount() {
        LookupStore.subscribe(this, state => {
        	this.datasource.setData(discriminated(this.discriminator))
        })

        this.query.on("change", this.__queryOnChange)

        //getLookupResult({discriminator: this.discriminator, entity: this.props.field.entity, query: this.query})
    }

    componentWillUnmount() {
    	LookupStore.unsubscribe(this)

        this.query.off("change", this.__queryOnChange)

        freeLookupResult({discriminator: this.discriminator, entity: this.props.field.entity})
    }

    render() {
        return React.createElement(Lookup, _.assign({}, this.props, {query: this.query, datasource: this.datasource}))
    }
}