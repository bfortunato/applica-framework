"use strict"

import {Observable} from "../aj/events"

function normalizeData(data) {
	let result = null
	if (data) {
		if (_.isArray(initialData)) {
			result = {rows: initialData, totalRows: initialData.length}
		} else if (_.isObject(initialData)) {
			result = initialData
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

	load(keyword) {

	}

}

export class LoaderDataSource extends DataSource {
	
	constructor(loader) {
		super()

		this.loader = loader
	}

	load(keyword) {
		if (_.isFunction(this.loader)) {
			this.loader.bind(this, keyword)
		}
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

export function loadable(loader) {
	let ds = new LoaderDataSource(loader)
	ds.load(null)
	return ds
}

export function create() {
	return new DataSource()
}