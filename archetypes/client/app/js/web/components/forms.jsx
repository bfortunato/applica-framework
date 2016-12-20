"use strict"

import strings from "../../strings"
import { Card, HeaderBlock } from "./common"
import { format } from "../../utils/lang"
import { Observable } from "../../aj/events"
import {Grid} from "./grids"

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

        let invalid = _.any(this.validationResult, (k, v) => !v.valid)
        return !invalid
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
        console.log(me)
        $(me).find(".tab-button").click((e) => {
            console.log("ciao")
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

        let valid = this.model.validate()
        if (!valid) {
            this.forceUpdate()
        }
        let validationResult = this.model.validationResult
        let data = this.model.data

        console.log(validationResult)
        console.log(data)
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
    }
}

export class Select extends Control {

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find("select").select2({
            placeholder: this.props.field.placeholder,
            data: [{id: 1, text: "Bruno"}, {id: 2, text: "Massimo"}, {id: 3, text: "Flavio"}]
        })

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

export class Lookup extends Control {
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
        let me = ReactDOM.findDOMNode(this)
        $(me).find(".lookup-grid").modal("show")
    }

    render() {
        let descriptor = {
            "id": "users",
            "columns": [
                {"property": "name", "header": "Name", "component": "text"},
                {"property": "mail", "header": "Mail", "component": "text"}
            ]
        }

        let rows = []
        for (let x = 0; x < 2; x++) {
            let xo = {
                index: x,
                selected: false,
                expanded: false,
                data: {name: "name" + x, mail: "mail" + x, active: true},
                children: []
            }

            rows.push(xo)

        }


        return (
            <div className="fg-line" tabIndex="0">
                <div className="lookup">
                    <div className="lookup-header">
                        <div className="actions pull-right">
                            <a href="javascript:;" title={strings.add} onClick={this.showEntities.bind(this)}><i className="zmdi zmdi-plus" /></a>
                            <div className="clearfix"></div>
                        </div>
                    </div>

                    <table className="table table-condensed table-hover">
                       <tbody>
                            <tr className="selection-row">
                                <td>Bruno</td>
                                <td>Fortunato</td>
                                <td className="actions"><a href="javascript:;" className="action" title={strings.delete}><i className="zmdi zmdi-delete" /></a></td>
                            </tr>
                            <tr className="selection-row">
                                <td>Massimo</td>
                                <td>Galante</td>
                                <td className="actions"><a href="javascript:;" className="action" title={strings.delete}><i className="zmdi zmdi-delete" /></a></td>
                            </tr>
                            <tr className="selection-row">
                                <td>Nicola</td>
                                <td>Matera</td>
                                <td className="actions"><a href="javascript:;" className="action" title={strings.delete}><i className="zmdi zmdi-delete" /></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="lookup-grid modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">Select roles</h4>
                            </div>
                            <div className="modal-body">
                                <Grid ref="grid" showInCard="false" descriptor={descriptor} data={{rows: rows, totalRows: 100}} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{strings.cancel}</button>
                                <button type="button" className="btn btn-primary">{strings.ok}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}