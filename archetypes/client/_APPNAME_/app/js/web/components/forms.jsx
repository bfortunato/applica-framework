"use strict"

import M from "../../strings"
import {Card, Actions} from "./common"
import {format, optional} from "../../../utils/lang"
import {Observable} from "../../../aj/events"
import {Grid, ActionsCell, resultToGridData} from "./grids"
import * as query from "../../api/query"
import {isCancel} from "../utils/keyboard"
import * as inputfile from "../utils/inputfile"
import * as datasource from "../../utils/datasource"
import {parseBoolean} from "../../utils/lang"

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
        this.data[property] = value

        this.invoke("property:change", property, value)
    }

    get(property) {
        if (_.has(this.data, property)) {
            return this.data[property]
        } else {
            return null
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

    sanitized() {
        let sanitized = {}

        _.each(_.keys(this.data), property => {
            let value = this.data[property]
            let field = this.findField(property)
            if (field) {
                if (_.isFunction(field.sanitizer)) {
                    value = field.sanitizer(value)
                }
            }
            sanitized[property] = value
        })

        return sanitized
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
        let className = optional(this.props.className, "")

        return (
            !_.isEmpty(field.label) && <label style={{width: "100%"}} htmlFor={field.property} className={className}>{field.label}</label>
        )
    }
}

export class Area extends React.Component {
    render() {
        let descriptor = this.props.descriptor
        let area = this.props.area
        let inline = optional(descriptor.inline, false)
        inline = optional(area.inline, inline)
        let defaultFieldCass = inline ? InlineField : Field
        let tabs = !_.isEmpty(area.tabs) && <Tabs tabs={area.tabs} model={this.props.model} descriptor={descriptor} />
        let fields = !_.isEmpty(area.fields) && area.fields.map(f => React.createElement(optional(() => f.component, () => defaultFieldCass), {key: f.property, model: this.props.model, field: f}))

        return (
            <Card padding="true" title={area.title} subtitle={area.subtitle} actions={area.actions}>
                {tabs}
                <div className="row">{fields}</div>
                <div className="clearfix"></div>
            </Card>
        )
    }
}

export class AreaNoCard extends React.Component {
    render() {
        let area = this.props.area
        let tabs = !_.isEmpty(area.tabs) && <Tabs tabs={area.tabs} model={this.props.model} />
        let fields = !_.isEmpty(area.fields) && area.fields.map(f => React.createElement(optional(() => f.component, () => Field), {key: f.property, model: this.props.model, field: f}))
        let actionKey = 1

        return (
            <div className="area-no-card">
                <div className="area-no-card-header">
                    {area.title &&
                    <h2>{area.title} {area.subtitle && <small>{area.subtitle}</small>}</h2>
                    }

                    <Actions actions={area.actions} />
                </div>
                <div className="area-no-card-body">
                    {tabs}
                    <div className="row">{fields}</div>
                </div>
            </div>
        )
    }
}


export class Tabs extends React.Component {

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find(".tab-button").click((e) => {
            e.preventDefault()
            $(this).tab("show")
        })
    }

    render() {
        let descriptor = this.props.descriptor
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
            let inline = optional(descriptor.inline, false)
            inline = optional(c.inline, inline)
            let defaultFieldClass = inline ? InlineField : Field
            let fields = _.isEmpty(c.fields) && c.fields.map(f => React.createElement(optional(() => f.component, () => defaultFieldClass), {key: f.property, model: this.props.model, field: f}))
            let el = (
                <div key={"pane_" + c.key} role="tabpanel" className={"tab-pane" + (first ? " active" : "")} id={`${c.key}`} >
                    <div className="row">{fields}</div>
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
    if (!_.isEmpty(descriptor.areas)) {
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
    }

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

    submit() {
        this.onSubmit()
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        try {
            this.model.validate()
            if (_.isFunction(this.props.onSubmit)) {
                this.props.onSubmit(this.model.sanitized())
            }
        } catch (e) {
            if (e === VALIDATION_ERROR) {
                this.forceUpdate()
            } else {
                throw e
            }
        }
    }

    onCancel(e) {
        if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel()
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

        let inline = optional(descriptor.inline, false)
        let defaultFieldCass = inline ? InlineField : Field
        let areas = !_.isEmpty(descriptor.areas) && descriptor.areas.map(a => React.createElement(optional(() => a.component, () => Area), {key: a.key, model: model, area: a, descriptor}))
        let tabs = !_.isEmpty(descriptor.tabs) && <Tabs tabs={descriptor.tabs} model={model} descriptor={descriptor} />
        let fields = !_.isEmpty(descriptor.fields) && descriptor.fields.map(f => React.createElement(optional(() => f.component, () => defaultFieldCass), {key: f.property, model: model, field: f}))
        let className = inline ? "form-horizontal" : ""

        return (
            <div className="form">
                <form action="javascript:;" className={className} role="form" onSubmit={this.onSubmit.bind(this)}>
                    {areas}
                    {(tabs.length > 0 || fields.length > 0) &&
                    <Card padding="true">
                        {tabs}
                        {fields}
                        <div className="clearfix"></div>
                    </Card>
                    }

                    <div className="row">
                        <div className="text-right col-sm-12">
                            <button type="button" className="btn btn-default waves-effect m-r-10" onClick={this.onCancel.bind(this)}><i className="zmdi zmdi-arrow-back" /> {descriptor.cancelText || M("cancel")}</button>
                            <button type="submit" className="btn btn-primary waves-effect"><i className="zmdi zmdi-save" /> {descriptor.submitText || M("submit")}</button>
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
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12")
        let control = React.createElement(this.props.field.control, _.assign({field: this.props.field, model: this.props.model}, this.props.field.props))
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let validationResult = model.validationResult[this.props.field.property] ? model.validationResult[this.props.field.property] : {valid: true}
        if (!validationResult.valid) {
            className += " has-error"
        }
        return (

            <div className={className}>
                {hasLabel &&
                <Label field={this.props.field}/>
                }
                {control}
            </div>
        )
    }
}

export class InlineField extends React.Component {
    render() {
        let model = this.props.model
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12")
        let control = React.createElement(this.props.field.control, _.assign({field: this.props.field, model: this.props.model}, this.props.field.props))
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let inline = optional(this.props.inline, false)
        let controlSize = hasLabel ? "col-sm-10" : "col-sm-12"
        let validationResult = model.validationResult[this.props.field.property] ? model.validationResult[this.props.field.property] : {valid: true}
        if (!validationResult.valid) {
            className += " has-error"
        }
        return (

            <div className={className}>
                {hasLabel &&
                <div className="col-sm-2">
                    <Label field={this.props.field} className="control-label"/>
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
                <input
                    type="text"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property), "")}
                    onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class TextArea extends Control {
    render() {
        let field = this.props.field
        let style = {
            height: optional(this.props.height, "150px")
        }
        return (
            <div className="fg-line">
                <textarea
                    style={style}
                    className="form-control"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property), "")}
                    onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class ReadOnlyText extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input
                    disabled="disabled"
                    readOnly="readOnly"
                    type="text"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property), "")}
                    onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class Mail extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input
                    type="email"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property), "")}
                    onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}

export class YesNo extends Control {
    onValueChange(e) {
        let value = parseBoolean(e.target.value)
        let model = this.props.model
        let field = this.props.field
        model.set(field.property, value)
        this.forceUpdate()
    }

    render() {
        let field = this.props.field
        let yesText = optional(this.props.yesText, "Yes")
        let noText = optional(this.props.noText, "No")

        return (
            <div className="yesno">
                <label className="radio radio-inline m-r-5">
                    <input type="radio" name={field.property} value="true" checked={optional(this.props.model.get(field.property), false)} onChange={this.onValueChange.bind(this)} />
                    <i className="input-helper">{yesText}</i>
                </label>
                <label className="radio radio-inline m-r-5">
                    <input type="radio" name={field.property} value="false" checked={!(optional(this.props.model.get(field.property), false))} onChange={this.onValueChange.bind(this)} />
                    <i className="input-helper">{noText}</i>
                </label>
            </div>
        )
    }
}


export class Switch extends Control {
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
                <input
                    type="checkbox"
                    hidden="hidden"
                    name={field.property}
                    id={field.property}
                    data-property={field.property}
                    checked={optional(this.props.model.get(field.property), false)}
                    onChange={this.onValueChange.bind(this)} />

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
                <input
                    type="number"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property))}
                    onChange={this.onValueChange.bind(this)} />
            </div>
        )
    }
}


export class Select extends Control {

    constructor(props) {
        super(props)

        this.__dataSourceOnChange = (data) => {
            this.forceUpdate()
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.datasource)) {
            this.props.datasource.on("change", this.__dataSourceOnChange)
        }

        let me = ReactDOM.findDOMNode(this)
        $(me).selectpicker({
            liveSearch: optional(this.props.searchEnabled, false)
        })
    }

    componentDidUpdate() {
        let model = this.props.model
        let field = this.props.field
        let me = ReactDOM.findDOMNode(this)

        $(me).selectpicker("refresh")
    }

    componentWillUnmount() {
        if (!_.isEmpty(this.props.datasource)) {
            this.props.datasource.off("change", this.__dataSourceOnChange)
        }
    }

    render() {
        let model = this.props.model
        let field = this.props.field
        let datasource = this.props.datasource
        let options = optional(() => datasource.data.rows, []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)

        return (
            <select
                id={field.property}
                className="form-control"
                data-property={field.property}
                onChange={this.onValueChange.bind(this)}
                title={field.placeholder}
                value={optional(model.get(field.property), "")}
                multiple={optional(this.props.multiple, false)}>
                {this.props.allowNull &&
                <option value="" style={{color: "#999999"}}>{optional(this.props.nullText, "(none)")}</option>
                }
                {options}
            </select>
        )
    }
}


export class Lookup extends Control {
    constructor(props) {
        super(props)

        this.datasource = this.props.datasource || datasource.create()
        this.query = this.props.query || query.create()

        this.__dataSourceOnChange = (data) => {
            this.forceUpdate()
        }

        this.__queryChange = () => {
            if (_.isFunction(this.props.loader)) {
                this.props.loader(this.query, this.datasource)
            }
        }
    }

    componentDidMount() {
        this.datasource.on("change", this.__dataSourceOnChange)
        this.query.on("change", this.__queryChange)

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

        if (_.isFunction(this.props.loader)) {
            this.props.loader(this.query, this.datasource)
        }
    }

    componentWillUnmount() {
        this.datasource.off("change", this.__dataSourceOnChange)
        this.query.off("change", this.__queryChange)
    }

    showEntities(e) {
        e.stopPropagation()

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
        let current = optional(model.get(field.property), [])
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

        model.set(field.property, result)

        this.forceUpdate()
    }

    remove(e) {
        e.stopPropagation()

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
        let mode = this.props.mode
        if ("multiple" != mode && "single" != mode) {
            throw new Error("Please specify a mode for lookup: [single|multiple]")
        }
        return mode
    }

    getHeaderText() {
        let field = this.props.field
        let mode = this.checkedMode()
        let model = this.props.model
        let value = model.get(field.property)

        if (_.isEmpty(value)) {
            return <span className="placeholder">{this.getPlaceholderText()}</span>
        } else {
            return this.getCurrentValueDescription()
        }
    }

    getCurrentValueDescription() {
        let model = this.props.model
        let field = this.props.field
        let mode = this.checkedMode()

        if (mode == "multiple") {
            let rows = model.get(field.property)
            return rows.length == 1 ? M("oneElementSelected") : format(M("nElementsSelected"), rows.length)
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

    onGridKeyDown(e) {
        if (isCancel(e.which)) {
            this.remove(e)
            e.preventDefault()
        }
    }

    getPlaceholderText() {
        let field = this.props.field

        if (field.placeholder) {
            return field.placeholder
        } else {
            return M("nothingSelected")
        }
    }

    render() {
        let mode = this.checkedMode()
        let model = this.props.model
        let field = this.props.field
        let rows = model.get(field.property) || []
        let selectionGrid = mode == "multiple" ? _.assign({}, this.props.selectionGrid, {columns: _.union(this.props.selectionGrid.columns, [{
            cell: ActionsCell,
            tdClassName: "grid-actions",
            actions: [
                {icon: "zmdi zmdi-delete", action: (row) => this.removeRow(row)}
            ]
        }])}) : null
        let addClassName
        if (mode == "single") {
            addClassName = "zmdi zmdi-more"
        } else if (mode == "multiple") {
            addClassName = "zmdi zmdi-plus"
        }

        return (
            <div className="fg-line" tabIndex="0">
                <div className="lookup">
                    <div className="lookup-header" onClick={this.showEntities.bind(this)}>
                        <div className="actions pull-right">
                            <a href="javascript:;" title={M("remove")} onClick={this.remove.bind(this)} className="m-r-0"><i className="zmdi zmdi-close" /></a>
                            <a href="javascript:;" title={M("add")} onClick={this.showEntities.bind(this)}><i className={addClassName} /></a>
                        </div>
                        <span className="lookup-current-value">{this.getHeaderText()}</span>
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
                        onKeyDown={this.onGridKeyDown.bind(this)}
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
                                    descriptor={this.props.popupGrid}
                                    data={resultToGridData(this.datasource.data)}
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
                                <button type="button" className="btn btn-link" onClick={this.select.bind(this)}>{M("ok")}</button>
                                <button type="button" className="btn btn-link" data-dismiss="modal">{M("cancel")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class File extends Control {
    constructor(props) {
        super(props)

        this.state = {filename: null}
    }

    onFileSelected(e) {
        let model = this.props.model
        let field = this.props.field
        let file = e.target.files[0]
        inputfile.readDataUrl(file).then(result => {
            model.set(field.property, result)
            this.setState({filename: file.name})
        })
    }

    remove(e) {
        e.preventDefault()
        e.stopPropagation()

        let model = this.props.model
        let field = this.props.field
        model.set(field.property, null)
        this.setState({filename: null})
    }

    search(e) {
        e.preventDefault()
        e.stopPropagation()

        let me = ReactDOM.findDOMNode(this)
        $(me).find("input[type=file]").click()
    }

    render() {
        let model = this.props.model
        let field = this.props.field
        let value = model.get(field.property)
        let hasValue = !_.isEmpty(value)

        return (
            <div className="input-file fg-line" tabIndex="0">
                <div onClick={this.search.bind(this)}>
                    {!hasValue ?
                        <div>
                            <div className="actions pull-right">
                                <a href="javascript:;" title={M("search")} onClick={this.search.bind(this)} className="m-r-0"><i className="zmdi zmdi-search" /></a>
                            </div>
                            <span className="placeholder">{field.placeholder}</span>
                        </div>
                        :
                        <div>
                            <div className="actions pull-right">
                                <a href="javascript:;" title={M("remove")} onClick={this.remove.bind(this)} className="m-r-0"><i className="zmdi zmdi-close" /></a>
                            </div>
                            <span className="input-file-name"><span className="zmdi zmdi-file"></span> {this.state.filename}</span>
                        </div>
                    }
                </div>

                <input type="file" accept={field.accept} onChange={this.onFileSelected.bind(this)} />
            </div>
        )
    }
}

export class Image extends Control {
    constructor(props) {
        super(props)
    }

    onFileSelected(e) {
        let model = this.props.model
        let field = this.props.field
        let file = e.target.files[0]
        inputfile.readDataUrl(file).then(result => {
            model.set(field.property, result)
            this.forceUpdate()
        })
    }

    delete(e) {
        e.stopPropagation()
        e.preventDefault()

        let model = this.props.model
        let field = this.props.field
        let me = ReactDOM.findDOMNode(this)
        $(me).find("input[type=file]").val(null)

        model.set(field.property, null)
        this.forceUpdate()
    }

    search(e) {
        e.preventDefault()
        e.stopPropagation()

        let me = ReactDOM.findDOMNode(this)
        $(me).find("input[type=file]").click()
    }

    render() {
        let model = this.props.model
        let field = this.props.field
        let accept = field.accept || ".jpg,.png,.jpeg,.gif,.bmp"

        let imgStyle = {
            "backgroundRepeat": "no-repeat",
            "backgroundSize": "contain",
            "backgroundPosition": "center",
            "height": "150px",
            "backgroundColor": "#F2F2F2"
        }
        if (this.props.width) {
            imgStyle.width = this.props.width
        }
        if (this.props.height) {
            imgStyle.height = this.props.height
        }

        let imageData = model.get(field.property)

        return (
            <div className="input-image fg-line">
                <div onClick={this.search.bind(this)}>
                    {!_.isEmpty(imageData) ?
                        <div className="input-image-container">
                            <div className="actions">
                                <a href="javascript:;" onClick={this.delete.bind(this)} className="delete-button"><i className="zmdi zmdi-close"></i></a>
                            </div>
                            <div className="input-image" style={_.assign(imgStyle, {"backgroundImage": `url("${imageData}")`})}></div>
                        </div>
                        :
                        <div className="input-image" style={_.assign(imgStyle, {"backgroundImage": `url("resources/images/noimage.png")`})}></div>
                    }
                </div>
                <input type="file" accept={accept} onChange={this.onFileSelected.bind(this)} />
            </div>
        )
    }
}
