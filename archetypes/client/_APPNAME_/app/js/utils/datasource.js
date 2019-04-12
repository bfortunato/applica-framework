"use strict"

import {Observable} from "../aj/events";
import _ from "underscore";

function normalizeData(data) {
	let result = null
	if (data) {
		if (_.isArray(data)) {
			result = {rows: data, totalRows: data.length}
		} else if (_.isObject(data)) {
			result = data
		}
	}
	return result
}

export class DataSource extends Observable {
	
	constructor(initialData) {
		super()

		this.data = normalizeData(initialData)		
	}

	notifyChanged() {
		this.invoke("change", this.data)
	}

	setData(data) {
		this.data = normalizeData(data)
		this.notifyChanged()
	}

}

export function fixed(data) {
	return new DataSource(data)
}

export function promised(promiseFn) {
	let dataSource = new DataSource()

	new Promise(promiseFn)
		.then(data => {
			dataSource.setData(data)
		})
		.catch(r => { logger.e(r) })

	return dataSource
}

export function create() {
	return new DataSource()
}

export function fromEnum(Enum) {
    return new DataSource(_.map(_.keys(Enum), k => { return {label: M(k), value: Enum[k]}}))
}