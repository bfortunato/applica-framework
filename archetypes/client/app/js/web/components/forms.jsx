"use strict"

import strings from "../../strings"
import {Card} from "./common"
import {format, optional} from "../../utils/lang"
import {Observable} from "../../aj/events"
import {Grid, ActionsCell, resultToGridData} from "./grids"
import {connectDiscriminated} from "../utils/aj"
import {LookupStore} from "../../stores"
import {getLookupResult, freeLookupResult} from "../../actions"
import {discriminated} from "../../../utils/ajex"
import * as query from "../../api/query"

const VALIDATION_ERROR = {}

export class Model extends Observable {
    constructor() {
        super()

        this.descriptor = null
        this.data = {}
        this.validationResult = {}
    }

    findField(property) {
        if (this.descriptor == null) {
            throw new Error("Please specify a descriptor")
        }

        const Break = {}
        let field = null
        try {
            if (!_.isEmpty(this.descriptor.areas)) {
                this.descriptor.areas.forEach(a => {
                    if (!_.isEmpty(a.tabs)) {
                        a.tabs.forEach(t => {
                            if (!_.isEmpty(t.fields)) {
                                t.fields.forEach(f => {
                                    if (f.property == property) {
                                        field = f
                                        throw Break
                                    }
                                })
                            }
                            if (field != null) {
                                throw Break
                            }
                        })
                    }
                    if (field != null) {
                        return
                    }
                    if (!_.isEmpty(a.fields)) {
                        a.fields.forEach(f => {
                            if (f.property == property) {
                                field = f
                                throw Break
                            }
                        })
                    }
                    if (field != null) {
                        throw Break
                    }
                })
            }

            if (field == null) {
                if (!_.isEmpty(this.descriptor.tabs)) {
                    this.descriptor.tabs.forEach(t => {
                        if (!_.isEmpty(t.fields)) {
                            t.fields.forEach(f => {
                                if (f.property == property) {
                                    field = f
                                    throw Break
                                }
                            })
                        }
                        if (field != null) {
                            throw Break
                        }
                    })
                }
            }

            if (field == null) {
                if (!_.isEmpty(this.descriptor.fields)) {
                    this.descriptor.fields.forEach(f => {
                        if (f.property == property) {
                            field = f
                            throw Break
                        }
                    })
                }
            }
        } catch (e) {
            if (e !== Break) {
                throw e
            }
        }

        return field
    }

    set(property, value) {
        let field = this.findField(property)
        if (field != null) {
            let v = _.isFunction(field.sanitizer) ? field.sanitizer(value) : value
            this.data[property] = v
        } else {
            this.data[property] = v
        }
    }

    get(property) {
        if (_.has(this.data, property)) {
            return this.data[property]
        } else {
            return ""
        }
    }

    validateField(validationResult, field) {
        let value = this.data[field.property]
        try {
            if (_.isFunction(field.validator)) {
                field.validator(value)
            }

            validationResult[field.property] = {
                valid: true,
                message: null
            }
        } catch (e) {
            validationResult[field.property] = {
                valid: false,
                message: e.message
            }
        }
    }

    validate() {
        this.validationResult = {}
        if (!_.isEmpty(this.descriptor.areas)) {
            this.descriptor.areas.forEach(a => {
                if (!_.isEmpty(a.tabs)) {
                    a.tabs.forEach(t => {
                        if (!_.isEmpty(t.fields)) {
                            t.fields.forEach(f => {
                                this.validateField(this.validationResult, f)
                            })
                        }
                    })
                }
                if (!_.isEmpty(a.fields)) {
                    a.fields.forEach(f => {
                        this.validateField(this.validationResult, f)
                    })
                }
            })
        }

        if (!_.isEmpty(this.descriptor.tabs)) {
            this.descriptor.tabs.forEach(t => {
                if (!_.isEmpty(t.fields)) {
                    t.fields.forEach(f => {
                        this.validateField(this.validationResult, f)
                    })
                }
            })
        }

        if (!_.isEmpty(this.descriptor.fields)) {
            this.descriptor.fields.forEach(f => {
                this.validateField(this.validationResult, f)
            })
        }

        let invalid = _.any(this.validationResult, v => !v.valid)
        if (invalid) {
            throw VALIDATION_ERROR
        }
    }
}

export class Label extends React.Component {
    render() {
        let field = this.props.field

        return (
            !_.isEmpty(field.label) && <label style={{width: "100%"}} htmlFor={field.property} className="control-label">{field.label}</label>
        )
    }
}

export class Area extends React.Component {
    render() {
        let area = this.props.area
        let tabs = !_.isEmpty(area.tabs) && <Tabs tabs={area.tabs} model={this.props.model} />
        let fields = !_.isEmpty(area.fields) && area.fields.map(f => <Field key={f.property} model={this.props.model} field={f} />)

        return (
            <Card padding="true" title={area.title} subtitle={area.subtitle}>
                {tabs}
                {fields}
            </Card>
        )
    }
}


export class Tabs extends React.Component {

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        logger.i(me)
        $(me).find(".tab-button").click((e) => {
            logger.i("ciao")
            e.preventDefault()
            $(this).tab("show")
        })
    }

    render() {
        let first = true
        let tabs = this.props.tabs
        let nav = tabs.map(n => {
            let el = (
                <li key={"nav_" + n.key} className={first ? "active" : ""}><a className="tab-button" role="tab" data-toggle="tab" href={`#${n.key}`}>{n.title}</a></li>
            )
            first = false
            return el
        })
        first = true
        let panes = tabs.map(c => {
            let fields = _.isEmpty(c.fields) && c.fields.map(f => <Field key={f.property} model={this.props.model} field={f} />)
            let el = (
                <div key={"pane_" + c.key} role="tabpanel" className={"tab-pane" + (first ? " active" : "")} id={`${c.key}`} >
                    {fields}
                    <div className="clearfix"></div>
                </div>
            )
            first = false
            return el
        })



        return (
            <div>
                <ul className="tab-nav" role="tablist">
                    {nav}
                </ul>

                <div className="tab-content">
                    {panes}
                </div>
            </div>
        )
    }
}

let AREA_KEY = 1
let TAB_KEY = 1

function generateKeys(descriptor) {
    descriptor.areas.forEach(a => {
        if (_.isEmpty(a.key)) {
            a.key = "area" + AREA_KEY++
        }

        if (!_.isEmpty(a.tabs)) {
            a.tabs.forEach(t => {
                if (_.isEmpty(t.key)) {
                    t.key = "tab" + TAB_KEY++
                }
            })
        }
    })

    if (!_.isEmpty(descriptor.tabs)) {
        descriptor.tabs.forEach(t => {
            if (_.isEmpty(t.key)) {
                t.key = "tab" + TAB_KEY++
            }
        })
    }
}

export class Form extends React.Component {
    constructor(props) {
        super(props)

        this.model = new Model()
    }

    submit(e) {
        e.preventDefault()

        try {
            this.model.validate()
            if (_.isFunction(this.props.onSubmit)) {
                this.props.onSubmit(this.model.data)
            }
        } catch (e) {
            if (e === VALIDATION_ERROR) {
                this.forceUpdate()
            } else {
                throw e
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.model.descriptor = nextProps.descriptor
        this.model.data = nextProps.data ? nextProps.data : {}
    }

    render() {
        let descriptor = this.props.descriptor
        let model = this.model

        generateKeys(descriptor)

        let areas = !_.isEmpty(descriptor.areas) && descriptor.areas.map(a => <Area key={a.key} model={model} area={a} />)
        let tabs = !_.isEmpty(descriptor.tabs) && <Tabs tabs={descriptor.tabs} model={model} />
        let fields = !_.isEmpty(descriptor.fields) && descriptor.fields.map(f => <Field key={f.property} model={model} field={f} />)

        return (
            <div className="form">
                <form className="form-horizontal" role="form" onSubmit={this.submit.bind(this)}>
                    {areas}
                    {(tabs.length > 0 || fields.length > 0) &&
                        <Card padding="true">
                            {tabs}
                            {fields}
                            <div className="clearfix"></div>
                        </Card>
                    }

                    <div className="form-group">
                        <div className="text-right col-sm-12">
                            <button type="submit" className="btn btn-default waves-effect m-r-10"><i className="zmdi zmdi-arrow-back" /> {descriptor.cancelText || strings.cancel}</button>
                            <button type="submit" className="btn btn-primary waves-effect"><i className="zmdi zmdi-save" /> {descriptor.submitText || strings.submit}</button>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>
        )
    }
}


/************************
    Controls and Fields
 ************************/

export class Field extends React.Component {
    render() {
        let model = this.props.model
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "")
        let control = React.createElement(this.props.field.control, _.assign({field: this.props.field, model: this.props.model}, this.props.field.options))
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let controlSize = hasLabel ? "col-sm-10" : "col-sm-12"
        let validationResult = model.validationResult[this.props.field.property] ? model.validationResult[this.props.field.property] : {valid: true}
        if (!validationResult.valid) {
            className += " has-error"
        }
        return (
            <div className={className}>
                {hasLabel &&
                <div className="col-sm-2">
                    <Label field={this.props.field}/>
                </div>
                }
                <div className={controlSize}>
                    {control}
                </div>
            </div>
        )
    }
}

export class Control extends React.Component {
    constructor(props) {
        super(props)
    }

    onValueChange(e) {
        let value = e.target.value
        let model = this.props.model
        let field = this.props.field
        model.set(field.property, value)
        this.forceUpdate()
    }
}

export class Text extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input type="text" className="form-control input-sm" id={field.property} data-property={field.property} placeholder={field.placeholder} value={this.props.model.get(field.property)} onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class Mail extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input type="email" className="form-control input-sm" id={field.property} data-property={field.property} placeholder={field.placeholder} value={this.props.model.get(field.property)} onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class Check extends Control {
    onValueChange(e) {
        let value = e.target.checked
        let model = this.props.model
        let field = this.props.field
        model.set(field.property, value)
        this.forceUpdate()
    }

    render() {
        let field = this.props.field

        return (
            <div className="toggle-switch" data-ts-color="blue">
                <input type="checkbox" hidden="hidden" name={field.property} id={field.property} data-property={field.property} checked={this.props.model.get(field.property)} onChange={this.onValueChange.bind(this)} />
                <label htmlFor={field.property} className="ts-helper"></label>
                <label htmlFor={field.property} className="ts-label">{field.placeholder}</label>
            </div>
        )
    }
}

export class Number extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input type="number" className="form-control input-sm" id={field.property} data-property={field.property} placeholder={field.placeholder} value={this.props.model.get(field.property)} onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }0
}

export class Select extends Control {

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        
        $(me).find(".select2-search__field")
            .focus(() => {
                $(me).find(".fg-line").addClass("fg-toggled")
            })
            .blur(() => {
                $(me).find(".fg-line").removeClass("fg-toggled")
            })
    }

    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <div className="select">
                    <select
                        id={field.property}
                        className="form-control"
                        data-property={field.property}
                        placeholder={field.placeholder}
                        value={this.props.model.get(field.property) || []}
                        onChange={this.onValueChange.bind(this)}
                        multiple={this.props.multiple}
                    />
                </div>
            </div>
        )
    }
}

let LOOKUP_DISCRIMINATOR = 1
function nextLookupDiscriminator() {
    return "lookup_" + LOOKUP_DISCRIMINATOR++
}

export class LookupContainer extends Control  {
    constructor(props) {
        super(props)

        this.discriminator = nextLookupDiscriminator()

        this.query = query.create()
        this.query.setPage(1)
        this.query.setRowsPerPage(20)
        this.__queryOnChange = () => {
            getLookupResult({discriminator: this.discriminator, entity: this.props.field.entity, query: this.query})
        }

        connectDiscriminated(this.discriminator, this, LookupStore)

        this.state = {result: {}}
    }

    componentDidMount() {
        this.query.on("change", this.__queryOnChange)

        //getLookupResult({discriminator: this.discriminator, entity: this.props.field.entity, query: this.query})
    }

    componentWillUnmount() {
        this.query.off("change", this.__queryOnChange)

        //freeLookupResult({discriminator: this.discriminator, entity: this.props.field.entity})
    }

    render() {
        return React.createElement(Lookup, _.assign({}, this.props, {query: this.query, result: this.state.result}))
    }
}


export class Lookup extends Control {
    constructor(props) {
        super(props)

        this.state = {
            data: {rows: [], totalRows: 0}
        }
    }

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find(".selection-row")
            .mouseenter(function() {
                $(this).find(".action").stop().fadeIn(250)
            })
            .mouseleave(function() {
                $(this).find(".action").stop().fadeOut(250)
            })
            .find(".action").hide()

        $(me)
            .focus(() => {
                $(me).addClass("fg-toggled")
            })
            .blur(() => {
                $(me).removeClass("fg-toggled")
            })

        $(me).find(".lookup-grid").modal({show: false})
    }

    showEntities() {
        if (!this.dialogAlreadyOpened) {
            if (this.props.query) {
                this.props.query.invokeChange()
            }
        }
        this.dialogAlreadyOpened = true

        let me = ReactDOM.findDOMNode(this)
        $(me).find(".lookup-grid").modal("show")
    }

    select() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find(".lookup-grid").modal("hide")

        let model = this.props.model
        let field = this.props.field
        let grid = this.refs.searchGrid
        let selection = optional(grid.getSelection(), [])
        let mode = this.checkedMode()
        let result = null
        if (mode == "single") {
            if (selection.length == 0) {
                return
            }

            result = selection[0]
        } else if (mode == "multiple") {
            result = _.union(current, [])
            selection.forEach(s => {
                let comparer = r => {
                    if (_.has(s, "id")) {
                        return s.id == r.id
                    } else {
                        return _.isEqual(s, r)
                    }
                }
                if (!_.any(result, comparer)) {
                    result.push(s)
                }
            })
        }
        let current = optional(model.get(field.property), [])

        model.set(field.property, result)

        this.forceUpdate()
    }

    remove() {
        let mode = this.checkedMode()
        if (mode == "single") {
            this.removeAll()
        } else if (mode == "multiple") {
            this.removeSelection()
        }
    }

    removeRow(row) {
        let model = this.props.model
        let field = this.props.field
        let current = optional(model.get(field.property), [])
        let result = _.filter(current, r => {
            if (_.has(row, "id")) {
                return row.id != r.id
            } else {
                return !_.isEqual(row, r)
            }
        })
        model.set(field.property, result)

        this.forceUpdate()
    }

    removeSelection() {
        let model = this.props.model
        let field = this.props.field
        let grid = this.refs.selectionGrid
        let selection = grid.getSelection()
        let current = optional(model.get(field.property), [])
        let result = _.filter(current, (c) => {
            return !_.any(selection, r => {
                if (_.has(c, "id")) {
                    return c.id == r.id
                } else {
                    return _.isEqual(c, r)
                }
            })
        })
        model.set(field.property, result)

        this.forceUpdate()
    }

    removeAll() {
        let mode = this.checkedMode()
        let model = this.props.model
        let field = this.props.field
        let v = null
        if (mode == "single") {
            v = null
        } else if (mode == "multiple") {
            v = []
        }
        model.set(field.property, v)

        this.forceUpdate()
    }

    checkedMode() {
        let mode = this.props.field.mode
        if ("multiple" != mode && "single" != mode) {
            throw new Error("Please specify a mode for lookup: [single|multiple]")
        }
        return mode
    }

    getCurrentValueDescription() {
        let model = this.props.model
        let field = this.props.field
        let mode = this.checkedMode()

        if (mode == "multiple") {
            let rows = model.get(field.property)
            return rows.length == 1 ? strings.oneElementSelected : format(strings.nElementsSelected, rows.length)
        } else if (mode == "single") {
            let row = model.get(field.property)
            if (row == null) {
                return ""
            }

            let formatter = _.isFunction(field.formatter) ? field.formatter : (row) => {
                if (_.has(row, "name")) {
                    return row["name"]
                } else if (_.has(row, "description")) {
                    return row["description"]
                } else {
                    return JSON.stringify(row)
                }
            }

            return formatter(row)
        }

    }

    render() {
        let mode = this.checkedMode()
        let model = this.props.model
        let field = this.props.field
        let rows = model.get(field.property)
        let selectionGrid = mode == "multiple" ? _.assign({}, field.selectionGrid, {columns: _.union(field.selectionGrid.columns, [{
            cell: ActionsCell,
            tdClassName: "grid-actions",
            actions: [
                {icon: "zmdi zmdi-delete", action: (row) => this.removeRow(row)}
            ]
        }])}) : null

        return (
            <div className="fg-line" tabIndex="0">
                <div className="lookup">
                    <div className="lookup-header">
                        <div className="actions pull-right">
                            <a href="javascript:;" title={strings.remove} onClick={this.remove.bind(this)}><i className="zmdi zmdi-close" /></a>
                            <a href="javascript:;" title={strings.add} onClick={this.showEntities.bind(this)}><i className="zmdi zmdi-plus" /></a>
                        </div>
                        <span className="lookup-current-value">{this.getCurrentValueDescription()}</span>
                        <div className="clearfix"></div>
                    </div>

                    {mode == "multiple" &&
                        <Grid
                            ref="selectionGrid"
                            descriptor={selectionGrid}
                            data={resultToGridData({rows: rows, totalRows: rows.length})}
                            showInCard="false"
                            quickSearchEnabled="false"
                            headerVisible="false"
                            footerVisible="false"
                            summaryVisible="false"
                            noResultsVisible="false"
                            paginationEnabled="false"
                            tableClassName="table table-condensed table-hover"
                        />
                    }
                </div>

                <div className="lookup-grid modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">Select roles</h4>
                            </div>
                            <div className="modal-body">
                                <Grid 
                                    ref="searchGrid" 
                                    descriptor={this.props.field.popupGrid}
                                    data={resultToGridData(this.props.result)}
                                    query={this.props.query}
                                    showInCard="false" 
                                    quickSearchEnabled="true"
                                    footerVisible="false"
                                    summaryVisible="false"
                                    paginationEnabled="false"
                                    tableClassName="table table-condensed table-striped table-hover"
                                    onRowDoubleClick={this.select.bind(this)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-link" onClick={this.select.bind(this)}>{strings.ok}</button>
                                <button type="button" className="btn btn-link" data-dismiss="modal">{strings.cancel}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class Image extends Control {
    constructor(props) {
        super(props)

        this.state = { imageData: null}
    }

    onFileSelected(e) {
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.onload = (e) => {
            this.setState({imageData: e.target.result})
        }
        reader.readAsDataURL(file)
        console.log("ciao")
    }

    render() {
        return (
            <div className="form-control">
                <input type="file" onChange={this.onFileSelected.bind(this)} />
                 {!_.isEmpty(this.state.imageData) &&
                    <img src={this.state.imageData} style={{width: 200}} />
                 }
            </div>
        )
    }
}
