"use strict"

import * as datasource from "../../utils/datasource";
import {LookupStore, MultiValueSettingsStore, SelectStore} from "../../stores/entities";
import {
    freeLookup,
    freeSelect,
    getLookupResult,
    getLookupValues,
    getSelectEntities,
    getSelectValues,
    setMultivalueSettings,
    updateMultivalueSettings
} from "../../actions/entities";
import {discriminated} from "../../utils/ajex";
import * as query from "../../api/query";
import {Control, Lookup, MultiCheckbox, Select} from "./forms";
import {optional} from "../../utils/lang";

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
    return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class MultiCheckboxByValue extends Control {
    constructor(props) {
        super(props)
        this.state = {}
        this.discriminator = props.field.property;
    }

    componentDidMount() {

        let model = this.props.model
        let field = this.props.field

        model.once("load", () => {
            let items = optional(model.get(field.property), [])
            setMultivalueSettings({discriminator: this.discriminator, items})
        })

        MultiValueSettingsStore.subscribe(this,  state => {
            this.state.items = discriminated(state, this.discriminator).items
            this.forceUpdate()
        })

    }

    componentWillUnmount() {

        MultiValueSettingsStore.unsubscribe(this);


        freeSettingValues({discriminator: this.discriminator});

    }

    onValueChange(elem, e) {
        updateMultivalueSettings({
            discriminator: this.discriminator,
            itemType: elem.itemType,
            enabled: e.target.checked
        })
    }


    render() {


        let model = this.props.model;
        let field = this.props.field;

        let items = optional(this.state.items, [])

        model.set(field.property, items)

        let checks = _.map(items, (elem, i) => {
            let type = elem.itemType;
            let description = _.isFunction(this.props.formatter) ? this.props.formatter(elem) : M(type);

            let key = i + "_" + type;
            let enabled = elem.enabled;

            return (
                <div key={key} className="col-xs-12 zero-padding">
                    <div className="row">
                        <div className="col-xs-10 zero-padding">
                            <p className="margin-top-20 text-evaluation-description">{description}</p>
                        </div>
                        <div className="col-xs-2 zero-padding">
                            <div className="toggle-switch yesno">

                                <input
                                    type="checkbox"
                                    hidden="hidden"
                                    onChange={this.onValueChange.bind(this, elem)}
                                    name={key}
                                    id={key}
                                    data-property={key}
                                    checked={optional(enabled, false)}/>

                                <label htmlFor={key} className="ts-helper"></label>
                                <label htmlFor={key} className="ts-label">{field.placeholder}</label>

                            </div>
                        </div>
                    </div>

                </div>
            )
        });

        return (
            <div className={"col-xs-12 zero-padding"}>

                {checks}

            </div>
        );

    }

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

export class ValuesLookupContainer extends Control {

    constructor(props) {

        super(props)

        this.discriminator = props.id

        if (_.isEmpty(this.discriminator)) {
            throw new Error("Please specify an id for lookup")
        }

        let collection = this.getCollection()
        if (_.isEmpty(collection)) {
            throw new Error("Please specify a collection for lookup")
        }

        this.__queryOnChange = () => {
            collection = this.getCollection()
            getLookupValues(
                {
                    discriminator: this.discriminator,
                    collection: collection,
                    keyword: this.query.keyword,
                    page: this.query.page,
                    rowsPerPage: this.query.rowsPerPage,
                })
        }

        this.query = query.create()
        this.query.setPage(1)
        this.query.setRowsPerPage(15)
        this.datasource = datasource.create()

        this.state = {values: {}}
    }

    getCollection() {
        let collection = this.props.collection
        if (_.isFunction(this.props.getCollection)) {
            collection = this.props.getCollection(this.props.model)
        }
        return collection;
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

export class EntitiesMultiCheckContainer extends Control {

    constructor(props) {

        super(props);

        this.discriminator = props.id;
        if (_.isEmpty(this.discriminator)) {
            throw new Error("Please specify an id of this lookup")
        }

        this.query = query.create();

        this.datasource = datasource.create();

        this.state = {result: {}};

    }

    componentDidMount() {

        LookupStore.subscribe(this, state => {
            this.datasource.setData(discriminated(state, this.discriminator).result);
        });

        getLookupResult({discriminator: this.discriminator, entity: this.props.entity, query: this.query});

    }

    componentWillUnmount() {

        LookupStore.unsubscribe(this);

        this.query.off("change", this.__queryOnChange);

        freeLookup({discriminator: this.discriminator});

    }

    render() {
        let entityDescriptor = optional(this.props.entityDescriptor, {});
        return React.createElement(MultiCheckbox, _.assign({}, this.props, {query: this.query, datasource: this.datasource, entityDescriptor: entityDescriptor, activeColor: this.props.activeColor}));
    }

}