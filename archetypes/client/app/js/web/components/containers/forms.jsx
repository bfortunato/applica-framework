"use strict" 

import {Form, Text, Mail, Check, Select, Lookup, Image, Control} from "/forms"
import {connectDiscriminated} from "../../utils/aj"
import {lookup as LookupStore} from "../../../stores"
import {loadLookupResultByKeyword} from "../../../action"
import {discriminated} from "../../../../utils/ajex"
import {resultToGridData} from "./grids"
import * as query from "../../../api/query"

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
	return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class LookupContainer extends Control  {
	constructor(props) {
		super(props)

		this.discriminator = nextLookupDiscriminator()
		this.query = query.create()

		connectDiscriminated(this.discriminator, this, LookupStore, {})
	}

	onKeywordChange(keyword) {
		loadLookupResultByKeyword({discriminator: this.discriminator, keyword})
	}

	render() {
		return React.createElement(Lookup, _.assign({}, this.props, {ref: "lookup", onKeyworkChange: this.onKeyworkChange.bind(this), result: this.state.result}))
	}
}