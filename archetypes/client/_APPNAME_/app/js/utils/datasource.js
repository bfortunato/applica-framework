"use strict"

import {Observable} from "../aj/events"

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

export function promised(promise) {
	let dataSource = new DataSource()

	promise
		.then(data => {
			dataSource.notifyChanged()
		})
		.catch(r => { logger.e(r) })

	return dataSource
}

export function create() {
	return new DataSource()
}