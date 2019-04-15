import React from "react";
import ReactDOM from "react-dom";
import M from "../../strings"
import {Actions, Card} from "./common"
import {format, optional, diff} from "../../utils/lang"
import {Observable} from "../../aj/events"
import {ActionsCell, Grid, resultToGridData} from "./grids"
import * as query from "../../api/query"
import {isCancel} from "../utils/keyboard"
import * as inputfile from "../utils/inputfile"
import * as datasource from "../../utils/datasource"
import {parseBoolean} from "../../utils/lang"
import _ from "underscore"

export const VALIDATION_ERROR = {}

export class Model extends Observable {
    constructor(form) {
        super()

        this.descriptor = null
        this.initialData = {}
        this.data = {}
        this.validationResult = {}
        this.initialized = false
        this.form = form
        this.changesTrackingDisabled = false
    }

    invalidateForm() {
        if (this.form) {
            this.form.forceUpdate()
        }
    }

    load(data) {
        this.data = data ? data : {}
        if (!this.initialized && data != null) {
            this.invoke("load", this)
            this.initialized = true

            this.initialData = _.clone(this.data)
        }
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

    hasChanges() {
        let d = diff(this.data, this.initialData)
        return d.length > 0
    }

    trackChanges() {
        this.changesTrackingDisabled = false
    }

    untrackChanges() {
        this.changesTrackingDisabled = true
    }

    reset() {
        this.initialized = false
        this.data = {}
        this.initialData = {}
    }

    set(property, value) {
        let initialValue = this.data[property]
        this.data[property] = value 

        if (!this.changesTrackingDisabled) {
            this.invoke("property:change", property, value)
        }   
    }

    assign(property, value) {
        let actual = optional(this.get(property), {})
        this.set(property, _.assign(actual, value))
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

    resetValidation() {
        this.validationResult = {}
    }

    setError(property, message) {
        this.validationResult[property] = {
            valid: false,
            message: message
        }
    }

    resetError(property) {
        this.validationResult[property] = {
            valid: true
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

    isFieldVisible(field) {
        let descriptor = this.props.descriptor
        let model = this.props.model

        if (_.isFunction(descriptor.visibility)) {
            return descriptor.visibility(field, model, descriptor)
        }

        return true
    }

    getExtra() {
        return null
    }

    render() {
        let descriptor = this.props.descriptor
        let area = this.props.area
        let inline = optional(descriptor.inline, false)
        inline = optional(area.inline, inline)
        let defaultFieldCass = inline ? InlineField : Field
        let tabs = !_.isEmpty(area.tabs) && <Tabs tabs={area.tabs} model={this.props.model} descriptor={descriptor} />
        let fields = !_.isEmpty(area.fields) && _.filter(area.fields, f => this.isFieldVisible(f)).map(f => React.createElement(optional(() => f.component, () => defaultFieldCass), {key: f.property, model: this.props.model, field: f, descriptor: descriptor}))

        return (
            <Card title={area.title} subtitle={area.subtitle} actions={area.actions}>
                {tabs}
                <div className="row">
                    <div className="col-md-12">
                        {fields}
                    </div>
                </div>
                <div className="clearfix"></div>

                {this.getExtra()}
            </Card>
        )
    }
}

export class AreaNoCard extends React.Component {

    isFieldVisible(field) {
        let descriptor = this.props.descriptor
        let model = this.props.model

        if (_.isFunction(descriptor.visibility)) {
            return descriptor.visibility(field, model, descriptor)
        }

        return true
    }

    render() {
        let descriptor = this.props.descriptor
        let area = this.props.area
        let tabs = !_.isEmpty(area.tabs) && <Tabs tabs={area.tabs} model={this.props.model} />
        let fields = !_.isEmpty(area.fields) && _.filter(area.fields, f => this.isFieldVisible(f)).map(f => React.createElement(optional(() => f.component, () => Field), {key: f.property, model: this.props.model, field: f,  descriptor: descriptor}))
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

    isFieldVisible(field) {
        let descriptor = this.props.descriptor
        let model = this.props.model

        if (_.isFunction(descriptor.visibility)) {
            return descriptor.visibility(field, model, descriptor)
        }

        return true
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
            let fields = !_.isEmpty(c.fields) && _.filter(c.fields, f => this.isFieldVisible(f)).map(f => React.createElement(optional(() => f.component, () => defaultFieldClass), {key: f.property, model: this.props.model, field: f, onCancel: this.props.onCancel, canSave: this.props.canSave}))
            return (
                <div key={key} role="tabpanel" className={"tab-pane " + (this.getTabClass(selectedTab, c.id, firstTabId))} id={`${c.key}`}>
                    <div className="row">{fields}</div>
                    <div className="clearfix"></div>
                </div>
            )
            first = false
            return el
        })



        return (
            <div>
                <ul className="tab-nav" style={{textAlign: "center"}} role="tablist">
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
    if (!descriptor.hasKeys) {
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

        descriptor.hasKeys = true
    }
}

export class FormSubmitEvent {
    constructor(form, model) {
        this.form = form
        this.model = model
        this.stopped = false
    }

    stop() {
        this.stopped = true
    }

    forceSubmit() {
        this.form.forceSubmit()
    }
}

export class FormBody extends React.Component {

    isFieldVisible(field) {
        let descriptor = this.props.descriptor
        let model = this.props.model

        if (_.isFunction(descriptor.visibility)) {
            return descriptor.visibility(field, model, descriptor)
        }

        return true
    }

    render() {
        let descriptor = this.props.descriptor
        generateKeys(descriptor)
        let model = this.props.model
        let inline = optional(descriptor.inline, false)
        let defaultFieldCass = inline ? InlineField : Field
        let areas = !_.isEmpty(descriptor.areas) && descriptor.areas.map(a => React.createElement(optional(() => a.component, () => Area), {key: a.key, model: model, area: a, descriptor}))
        let tabs = !_.isEmpty(descriptor.tabs) && <Tabs tabs={descriptor.tabs} model={model} descriptor={descriptor} />
        let fields = !_.isEmpty(descriptor.fields) && _.filter(descriptor.fields, f => this.isFieldVisible(f)).map(f => React.createElement(optional(() => f.component, () => defaultFieldCass), {key: f.property, model: model, field: f, descriptor: descriptor, params : this.props.params, onCancel: this.props.onCancel}))
        let showInCard = optional(descriptor.showInCard, true)

        return (
            <div className="form-body">
                {areas}
                {(tabs.length > 0 || fields.length > 0) &&
                    (showInCard
                        ?
                        <Card padding="false">
                            {tabs}
                            <div className="p-l-30 p-r-30">
                                {fields}
                            </div>                            
                            <div className="clearfix"></div>
                        </Card> 
                        :
                        <div className="form-body-content">
                            {tabs}
                            {fields}
                            <div className="clearfix"></div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export class Form extends React.Component {
    constructor(props) {
        super(props)

        this.model = new Model(this);
        this.model.once("load", () => {
            let descriptor = this.props.descriptor;
            if (_.isFunction(descriptor.onModelLoadFirstTime)) {
                descriptor.onModelLoadFirstTime(this.model)
            }
        })

        this.model.on("load", () => {
            let descriptor = this.props.descriptor
            if (_.isFunction(descriptor.onModelLoad)) {
                descriptor.onModelLoad(this.model)
            }
        })


    }

    submit() {
        this.onSubmit()
    }

    forceSubmit() {
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(this.model.sanitized())
        }
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        let event = new FormSubmitEvent(this, this.model)

        try {
            let descriptor = this.props.descriptor
            if (_.isFunction(descriptor.beforeSubmit)) {
                descriptor.beforeSubmit(event)

                if (event.stopped) {
                    return
                }
            }
        } catch (e) {
            if (e === VALIDATION_ERROR) {
                this.forceUpdate()
                return
            } else {
                throw e
            }
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
        this.model.load(nextProps.data)
    }

    isFieldVisible(field) {
        let descriptor = this.props.descriptor
        let model = this.model

        if (_.isFunction(descriptor.visibility)) {
            return descriptor.visibility(field, model, descriptor)
        }

        return true
    }

    getExtra() {
        return null
    }

    showFormFooter() {
        return optional(this.props.descriptor.showFormFooter, true)
    }


    render() {
        let descriptor = this.props.descriptor
        let model = this.model

        let inline = optional(descriptor.inline, false)
        let className = inline ? "form-horizontal" : ""
        let canSave = this.props.canSave
        let canCancel = this.props.canCancel
        let showFormFooter = this.showFormFooter();


        return (
            <div className="form">
                <form action="javascript:;" className={className} role="form" onSubmit={this.onSubmit.bind(this)}>
                    <FormBody descriptor={descriptor} model={model} />

                    {showFormFooter &&
                    <FormFooter descriptor={descriptor}  model={model} onCancel={this.onCancel.bind(this)}/>
                    }
                    <div className="clearfix"></div>
                    {this.getExtra()}
                </form>
            </div>
        )
    }
}
class FormFooter extends React.Component {

    constructor(props) {
        super(props)
    }


    onCancel() {
        if(_.isFunction(this.props.onCancel)) {
            this.props.onCancel();
        }
    }

    canSave() {
        let descriptor = this.props.descriptor;
        return _.isFunction(descriptor.canSave) ? descriptor.canSave(this.props.model) : true
    }

    canCancel() {
        let descriptor = this.props.descriptor;
        return _.isFunction(descriptor.canCancel) ? descriptor.canCancel(this.props.model) : true
    }

    render() {
        const descriptor = this.props.descriptor;

        let submitText = M("save");
        let cancelText = M("back");
        if(descriptor) {
            if(descriptor.submitText) {
                submitText = descriptor.submitText;
            }
            if(descriptor.cancelText) {
                cancelText = descriptor.cancelText;
            }
        }

        const style = {marginBottom: "30px"}

        const canSave = this.canSave();
        const canCancel = this.canCancel();

        return (

            <div className="btn-actions-bar" style={style}>
                {canCancel &&
                <button type="button" className="btn btn-dark" onClick={this.onCancel.bind(this)}><i className="zmdi zmdi-arrow-back" /> {cancelText}</button>
                }
                {canSave && <button type="submit" className="btn btn-primary"><i className="zmdi zmdi-save" /> {submitText}</button>}
            </div>

        );
    }

}

/************************
    Controls and Fields
 ************************/
export const FORM_FOOTER = "actionsButtons"
export class Field extends React.Component {
    render() {

        if(this.props.field.property == FORM_FOOTER) {

            return (

                <FormFooter descriptor={this.props.descriptor}  model={this.props.model} onCancel={this.onCancel.bind(this)} />

            );

        }

        let model = this.props.model
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12")
        let control = React.createElement(_.isFunction(this.props.field.getControl) ? this.props.field.getControl(model) : this.props.field.control, _.assign({
            field: this.props.field,
            model: this.props.model
        }, this.props.field.props));
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let validationResult = optional(model.validationResult[this.props.field.property], {valid: true})
        if (!validationResult.valid) {
            className += " has-error"
        }
        if (!_.isEmpty(this.props.field.className)) {
            className += " " + this.props.field.className
        }
        return (
            <div className={className} style={{minHeight: 58}}>
                {hasLabel &&
                    <Label field={this.props.field}/>
                }
                {control}
                {!validationResult.valid && !_.isEmpty(validationResult.message) &&
                    <small className="help-block">{validationResult.message}</small>
                }
                <i className="form-group__bar"></i>
            </div>
        )
    }
}

export class InlineField extends React.Component {
    render() {
        if(this.props.field.property == FORM_FOOTER) {
            return (
                <FormFooter descriptor={this.props.descriptor} model={this.props.model}  onCancel={this.onCancel.bind(this)} />
            );

        }

        let model = this.props.model
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12")
        let control = React.createElement(this.props.field.control, _.assign({field: this.props.field, model: this.props.model}, this.props.field.props))
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let inline = optional(this.props.inline, false)
        let controlSize = hasLabel ? "col-sm-10" : "col-sm-12"
        let validationResult = optional(model.validationResult[this.props.field.property], {valid: true})
        if (!validationResult.valid) {
            className += " has-error"
        }
        if (!_.isEmpty(this.props.field.className)) {
            className += " " + this.props.field.className
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
                    {!validationResult.valid && !_.isEmpty(validationResult.message) &&
                        <small className="help-block">{validationResult.message}</small>
                    }
                </div>
                <i className="form-group__bar"></i>
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
            <input
                type="text"
                className="form-control input-sm"
                id={field.property}
                data-property={field.property}
                placeholder={field.placeholder}
                value={optional(this.props.model.get(field.property), "")}
                onChange={this.onValueChange.bind(this)} />
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
            <textarea
                style={style}
                className="form-control"
                id={field.property}
                data-property={field.property}
                placeholder={field.placeholder}
                value={optional(this.props.model.get(field.property), "")}
                onChange={this.onValueChange.bind(this)} />
        )
    }
}

export class ReadOnlyText extends Control {

    getText() {
        let field = this.props.field
        let model = this.props.model
        let formatter = optional(() => this.props.formatter, () => { return v => v })
        return optional(formatter(model.get(field.property)), "")
    }

    render() {
        let field = this.props.field
        

        return (
            <input
                disabled="disabled"
                readOnly="readOnly"
                type="text"
                className="form-control input-sm"
                id={field.property}
                data-property={field.property}
                placeholder={field.placeholder}
                value={this.getText()}
                onChange={this.onValueChange.bind(this)} />
        )
    }
}

export class Color extends Control {

    componentDidMount() {
        let field = this.props.field
        let model = this.props.model
        let me = ReactDOM.findDOMNode(this)
        let input = $(me).find("#" + field.property)
        $(me).find(".color-picker").farbtastic(v => {
            model.set(field.property, v)
            this.forceUpdate()
        })
    }

    render() {
        let field = this.props.field
        let value = this.props.model.get(field.property)
        let colorStyle = {backgroundColor: `${optional(value, "#000000")}`}

        return (
            <div className="cp-container">
                <div className="">
                    <div className="dropdown">
                        <input
                            type="text"
                            className="form-control cp-value"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            id={field.property}
                            data-property={field.property}
                            placeholder={field.placeholder}
                            value={optional(this.props.model.get(field.property), "")}
                            onChange={this.onValueChange.bind(this)} />

                        <div className="dropdown-menu">
                            <div className="color-picker" data-cp-default="#000000"></div>
                        </div>

                        <i className="cp-value" style={colorStyle} />
                    </div>
                </div>
            </div>
        )
    }
}

export class Spacer extends Control {
    render() {
        return (
            <div className="form-spacer-control"></div>
        )
    }
}

export class Mail extends Control {
    render() {
        let field = this.props.field

        return (
            <input
                type="email"
                className="form-control input-sm"
                id={field.property}
                data-property={field.property}
                placeholder={field.placeholder}
                value={optional(this.props.model.get(field.property), "")}
                onChange={this.onValueChange.bind(this)} />
        )
    }
}


export class DateTime extends Control {

    getDefaultFormat() {
        return "DD/MM/YYYY";
    }

    componentDidMount() {

        let self = this;

        let me = ReactDOM.findDOMNode(this)

        let field = this.props.field
        let model = this.props.model

        $(me).on("dp.change", (e) => {
            if (e.date) {
                let date = e.date.toDate()
                let time = date.getTime()
                model.set(field.property, time)
            }else {
                model.set(field.property, null)
            }
        });
    }

    componentWillUpdate(props,state) {
        if (props.model){
            this.setData()
        }
    }

    setData(){
        let self = this;
        let options = {
            locale: this.props.locale,
            format: this.props.format ? this.props.format : self.getDefaultFormat()
        };

        let minDate = this.props.getMinDate && this.props.getMinDate(this.props.model);
        let maxDate = this.props.getMaxDate && this.props.getMaxDate(this.props.model);
        let disabledDates = this.props.getDisabledDates && this.props.getDisabledDates(this.props.model);

        if(minDate) {
            options["minDate"] = minDate
        }

        if(maxDate) {
            options["maxDate"] = maxDate
        }

        if(disabledDates) {
            options["disabledDates"] = disabledDates
        }
        let field = this.props.field;
        let model = this.props.model;
        let me = ReactDOM.findDOMNode(this);
        let value = model.get(field.property);

        if ($(me).data('DateTimePicker'))
            $(me).data('DateTimePicker').destroy()
        $(me).datetimepicker(options);
        $(me).data("DateTimePicker").date(value ? new Date(value) : null)
    }


    isDisabled() {
        return _.isFunction(this.props.isDisabled) ?  this.props.isDisabled(this.props.model) : false
    }

    render() {
        let disabled = this.isDisabled();
        let field = this.props.field

        return (
            <div className="input-group">
                <input
                    disabled={disabled}
                    type="text"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder} />
                <div className="input-group-addon">
                    <span className="zmdi zmdi-calendar" />
                </div>
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

    componentDidMount() {
        let model = this.props.model
        let field = this.props.field
        let fn = () => {
            let value = parseBoolean(model.get(field.property))
            if (value === null || value === undefined) {
                value = false
            }
            model.untrackChanges()
            model.set(field.property, value)
            model.trackChanges()
        }

        model.once("load", fn)
        fn()
    }

    render() {
        const field = this.props.field
        const yesText = optional(this.props.yesText, "Yes")
        const noText = optional(this.props.noText, "No")
        const yesId = `__yesno-${field.property}-yes`
        const noId = `__yesno-${field.property}-no`
        return (
            <div className="yesno">
            <div className="radio radio--inline">
                <input id={yesId} type="radio" name={field.property} value="true" checked={optional(this.props.model.get(field.property), false)} onChange={this.onValueChange.bind(this)} />
                <label htmlFor={yesId} className="radio__label">{yesText}</label>
            </div>
            <div className="radio radio--inline">
                <input id={noId} type="radio" name={field.property} value="false" checked={!(optional(this.props.model.get(field.property), false))} onChange={this.onValueChange.bind(this)} />
                <label htmlFor={noId} className="radio__label">{noText}</label>
            </div>
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
            <div className="toggle-switch">
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
    constructor(props) {
        super(props)

        this.setState({})
    }

    // getMinValue() {
    //     return _.isFunction(this.props.getMinValue) ? this.props.getMinValue(this.props.model) : 0;
    // }


    onValueChange(e) {
        let value = e.target.value
        let model = this.props.model
        let field = this.props.field

        if (value == "" || value == "-" || (this.props.onlyInteger ? value.match(/^\d+$/) : value.match(/^-?(\d+\.?\d{0,9}|\.\d{1,9})$/))) {

            model.set(field.property, value)
            this.forceUpdate()
            if (_.isFunction(this.props.performOnChange)) {
                this.props.performOnChange(this.props.model, value);
            }
        }

    }


    render() {
        let field = this.props.field

        return (
            <input
                ref="text"
                type="text"
                className="form-control input-sm"
                id={field.property}
                data-property={field.property}
                placeholder={field.placeholder}
                value={optional(this.props.model.get(field.property), "")}
                onChange={this.onValueChange.bind(this)}/>
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

    onValueChange(e) {
        let multiple = optional(this.props.multiple, false)
        let value = $(e.target).val()
        let model = this.props.model
        let field = this.props.field

        if (multiple) {
            if (value == null) {
                value = []
            }
        }

        model.set(field.property, value)

        this.forceUpdate()
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.datasource)) {
            this.props.datasource.on("change", this.__dataSourceOnChange)
        }

        let me = ReactDOM.findDOMNode(this)
        let model = this.props.model
        let field = this.props.field
        let multiple = optional(this.props.multiple, false)

        $(me)
            .focus(() => {
                $(me).addClass("fg-toggled")
            })
            .blur(() => {
                $(me).removeClass("fg-toggled")
            })

        $(me).find("select")
            .select2({
                liveSearch: optional(this.props.searchEnabled, false)
            })
            .on("loaded.bs.select", function() {
                if (_.isEmpty(model.get(field.property))) {
                    let value = $(this).val()

                    if (multiple) {
                        if (_.isEmpty(value)) {
                            value = []
                        }
                    }

                    model.untrackChanges()
                    model.set(field.property, value)
                    model.trackChanges()
                }
            })
    }

    componentDidUpdate() {
        let model = this.props.model
        let field = this.props.field
        let me = ReactDOM.findDOMNode(this)
        let multiple = optional(this.props.multiple, false)

        $(me).find("select").select2()
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
        let multiple = optional(this.props.multiple, false)

        return (
            <select
                id={field.property}
                className="form-control"
                data-property={field.property}
                onChange={this.onValueChange.bind(this)}
                title={field.placeholder}
                value={optional(model.get(field.property), multiple ? [] : "")}
                multiple={multiple}>
                {this.props.allowNull &&
                    <option key="empty" value="" style={{color: "#999999"}}>{optional(this.props.nullText, "(none)")}</option>
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

            let customFormatter = field.formatter || this.props.formatter
            let formatter = _.isFunction(customFormatter) ? customFormatter : (row) => {
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
                        <div className="actions">
                            <a href="javascript:;" className="actions__item" title={M("remove")} onClick={this.remove.bind(this)}><i className="zmdi zmdi-close" /></a>
                            <a href="javascript:;" className="actions__item" title={M("add")} onClick={this.showEntities.bind(this)}><i className={addClassName} /></a>
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
                                <h5 className="modal-title" id="myModalLabel">{field.label}</h5>
                            </div>
                            <div className="modal-body">
                                <Grid 
                                    ref="searchGrid" 
                                    descriptor={this.props.popupGrid}
                                    data={resultToGridData(this.datasource.data)}
                                    query={this.props.query}
                                    showInCard="false" 
                                    quickSearchEnabled="true"
                                    footerVisible="true"
                                    summaryVisible="true"
                                    paginationEnabled="true"
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
            <div className="input-image">
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

export class Gallery extends Control {
    constructor(props) {
        super(props)
        this.state = {images: []};
        this.model = this.props.model;
        this.field = this.props.field;
        this.counter = 0;

    }

    componentDidMount() {


        this.model.once("load", () => {

            let value = optional(this.model.get(this.field.property), []);
            _.assign(this.state, {images: value});
            this.forceUpdate()
        })
    }


    onImageAdd(newImage) {

        let images = optional(this.state.images, []);

        if (!_.any(images, i => i === newImage)) {
            images.push(newImage);
            _.assign(this.state, {images: images})

            this.model.set(this.field.property, images)
            this.forceUpdate()
            return true;
        }

        return false;
    }

    onImageDelete(imageToRemove) {
        let images = optional(this.state.images, []);

        images = _.filter(images, i => i !== imageToRemove)
        _.assign(this.state, {images: images})
        this.model.set(this.field.property, images)
        this.forceUpdate()

    }


    createSingleImageComponent(imageData) {
        this.counter++;

        return <SingleImage key={this.field.property+ "_" + this.counter}
                            imageData={imageData}
                            onImageAdd={this.onImageAdd.bind(this)}
                            onImageDelete={this.onImageDelete.bind(this)}
        />
    }

    render() {
        let images = optional(this.state.images, []);
        let fields = [];
        let actions = [];

        if (images.length > 0) {
            _.forEach(images, (e) => {
                fields.push(this.createSingleImageComponent(e))
            })

        }

        fields.push(this.createSingleImageComponent())

        return (
            <div>
                {fields}

            </div>


        )
    }
}

export class MultiFile extends Control {
    constructor(props) {
        super(props)
        this.state = {files: []};
        this.model = this.props.model;
        this.field = this.props.field;
        this.counter = 0;
        this.fileTypes = this.field.fileTypes || "*";
    }

    componentDidMount() {

        this.model.once("load", () => {

            let value = optional(this.model.get(this.field.property), []);
            _.assign(this.state, {files: value});
            this.forceUpdate()
        })
    }


    onAdd(newFile) {
        let files = optional(this.state.files, []);

        if (!_.any(files, i => i.data === newFile.data)) {
            files.push(newFile);
            _.assign(this.state, {files: files})

            this.model.set(this.field.property, files)
            this.forceUpdate()
            return true;
        }

        return false;
    }

    onDelete(toRemove) {
        let files = optional(this.state.files, []);
        files = _.filter(files, i => i.data !== toRemove.data)
        _.assign(this.state, {files: files})
        this.model.set(this.field.property, files)
        this.forceUpdate()

    }


    createSingleFileComponent(data) {
        this.counter++;

        return <SingleFile key={this.field.property+ "_" + this.counter}
                           file={data? data : {}}
                           fileTypes={this.fileTypes}
                           onAdd={this.onAdd.bind(this)}
                           onDelete={this.onDelete.bind(this)}
        />
    }

    render() {
        let files = optional(this.state.files, []);
        let fields = [];
        let actions = [];
        let title = optional(this.props.field.title, M("attachments"))

        if (files.length > 0) {
            _.forEach(files, (e) => {
                fields.push(this.createSingleFileComponent(e))
            })

        }

        fields.push(this.createSingleFileComponent())

        return (
            <div>
                <HeaderBlock title={title} label={this.props.field.label} actions={actions}/>
                {fields}

            </div>


        )
    }
}

export class SingleImage extends Control {
    constructor(props) {
        super(props)


        this.state = {data: props.data}
    }

    onFileSelected(e) {
        let file = e.target.files[0]
        inputfile.readDataUrl(file).then(result => {
            if (_.isFunction(this.props.onImageAdd)) {
                if (this.props.onImageAdd(result)) {
                    _.assign(this.state, {imageData: result})
                    this.forceUpdate()
                }
            }

        })
    }

    delete(e) {
        e.stopPropagation()
        e.preventDefault()

        let me = ReactDOM.findDOMNode(this)
        $(me).find("input[type=file]").val(null)

        let image = this.state.imageData;
        _.assign(this.state, {imageData: null})
        this.forceUpdate()
        if (_.isFunction(this.props.onImageDelete)) {
            this.props.onImageDelete(image)
        }

    }

    search(e) {

        e.preventDefault()
        e.stopPropagation()

        let me = ReactDOM.findDOMNode(this)
        $(me).find("input[type=file]").click()
    }

    render() {
        let accept = ".jpg,.png,.jpeg,.gif,.bmp"

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

        let imageData = optional(this.state.imageData, null)

        return (
            <div className="input-image col-sm-4 col-ms-6" style={{marginBottom: '5px'}}>
                <div onClick={this.search.bind(this)}>
                    {!_.isEmpty(imageData) ?
                        <div className="input-image-container">
                            <div className="actions">
                                <a href="javascript:;" onClick={this.delete.bind(this)} className="delete-button"><i
                                    className="zmdi zmdi-close"></i></a>
                            </div>
                            <div className="input-image"
                                 style={_.assign(imgStyle, {"backgroundImage": `url("${imageData}")`})}></div>
                        </div>
                        :
                        <div className="input-image"
                             style={_.assign(imgStyle, {"backgroundImage": `url("resources/images/noimage.png")`})}></div>
                    }
                </div>
                <input type="file" accept={accept} onChange={this.onFileSelected.bind(this)}/>
            </div>
        )
    }
}

export class PasswordText extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input
                    type="password"
                    className="form-control input-sm"
                    id={field.property}
                    data-property={field.property}
                    placeholder={field.placeholder}
                    value={optional(this.props.model.get(field.property), "")}
                    onChange={this.onValueChange.bind(this)}/>
            </div>
        )
    }
}

export class SingleFile extends Control {
    constructor(props) {
        super(props)

        let filename = optional(props.file.filename, null);
        let data = optional(props.file.data, null);
        let base64 = optional(props.file.base64, null);

        this.state = {filename: filename, data: data, base64: base64}
    }

    onFileSelected(e) {
        let file = e.target.files[0]
        showLoader()
        inputfile.readDataUrl(file).then(result => {
            if (_.isFunction(this.props.onAdd)) {
                this.props.onAdd({data: result, filename: file.name, base64: true})
            }
            hideLoader()
        })
    }

    remove(e) {
        e.stopPropagation()
        e.preventDefault()


        if (_.isFunction(this.props.onDelete)) {
            this.props.onDelete({data: this.state.data, filename: this.state.filename})
        }
    }

    download(e) {
        e.preventDefault()
        e.stopPropagation()

        let value = optional(this.state.data, null)

        let url = config.get("service.url") + value
        window.open(url)
    }


    search(e) {
        e.preventDefault()
        e.stopPropagation()

        let me = ReactDOM.findDOMNode(this)

        //Serve per invocare il change se si seleziona un file uguale al precedente
        $(me).find("input[type=file]").val("")
        $(me).find("input[type=file]").click()
    }

    render() {

        let value = optional(this.state.data, null)
        //let fileName = optional(this.state.filename, null)
        let hasValue = !_.isEmpty(value)
        let readOnly =  optional(this.props.readOnly, false)
        let canDownload = hasValue && !value.includes("base64");
        let component = null
        let fileTypes = optional(this.props.fileTypes, "*")

        if (!hasValue) {
            component = (
                <div>
                    <div className="actions pull-right">
                        <a href="javascript:;" title={M("search")} onClick={this.search.bind(this)} className="m-r-0"><i
                            className="zmdi zmdi-search"/></a>
                    </div>
                    <span className="placeholder"></span>
                </div>
            )
        } else {
            component = (
                <div>
                    <div className="actions pull-right">
                        {readOnly && <a href="javascript:;" title={M("remove")} onClick={this.remove.bind(this)} className="m-r-0"><i
                            className="zmdi zmdi-close"/></a>}
                        {canDownload && <a href="javascript:;" title={M("download")} onClick={this.download.bind(this)}
                                           className="m-r-0"><i className="zmdi zmdi-download"/></a>}
                    </div>
                    <span className="input-file-name"><span className="zmdi zmdi-file"/> {this.state.filename} </span>
                </div>
            )
        }

        return (
            <div className="col-sm-4 col-ms-6" style={{marginBottom: '5px'}}>
                <div className="input-file fg-line" tabIndex="0">
                    <div onClick={this.search.bind(this)}>
                        {component}
                    </div>

                    <input type="file" accept={fileTypes} onChange={this.onFileSelected.bind(this)}/>
                </div>
            </div>

        )
    }
}