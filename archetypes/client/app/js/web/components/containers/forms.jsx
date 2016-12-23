"use strict" 

import {Form, Text, Mail, Check, Select, Lookup, Image, Control} from "/forms"
import {connectDiscriminated} from "../../utils/aj"
import {entities as EntitiesStore} from "../../../stores"
import {discriminated} from "../../../../utils/ajex"
import {resultToGridData} from "./grids"

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
	return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class LookupContainer extends Control  {
	constructor(props) {
		super(props)

		this.discriminator = nextLookupDiscriminator()

		connectDiscriminated(this.discriminator, this, EntitiesStore, { descriptor: null, result: []] })
	}

	getDataSource() {
		return query => new Promise((resolve, reject) => {
                resolve(discriminated(EntitiesStore.state, this.discriminator).result)
            }
		}

	render() {
		return React.createElement(Lookup, _.assign({}, this.props, {dataSource: this.getDataSource()})
	}
}