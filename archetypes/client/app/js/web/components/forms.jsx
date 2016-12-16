"use strict"

import strings from "../../strings"
import { Card, HeaderBlock } from "./common"
import { format } from "../../utils/lang"
import { Observable } from "../../aj/events"

export class Model extends Observable {
    constructor() {
        super()

        this.data = {}
    }

    set(key, value) {

    }

    get(key) {
        return key
    }

    isValid(key) {

    }


}

export class Field extends React.Component {
    render() {
        let className = "form-group " + (this.props.field.size ? this.props.field.size : "")
        let control = React.createElement(this.props.field.control, {field: this.props.field})
        let hasLabel = this.props.field.label != undefined && this.props.field.label != null
        let controlSize = hasLabel ? "col-sm-10" : "col-sm-12"
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

    set value(newValue) {

    }

    get value() {

    }
}

export class Text extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input type="text" className="form-control input-sm" id={field.property} placeholder={field.placeholder} />
            </div>
        )
    }
}

export class Mail extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="fg-line">
                <input type="email" className="form-control input-sm" id={field.property} placeholder={field.placeholder} />
            </div>
        )
    }
}

export class Check extends Control {
    render() {
        let field = this.props.field

        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" name={field.property} id={field.property} value={this.props.value} />
                        <i className="input-helper"></i>
                        {field.placeholder}
                </label>
            </div>
        )
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
        let fields = area.fields.map(f => <Field key={f.property} model={this.props.model} field={f} />)

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
            let fields = c.fields.map(f => <Field key={f.property} model={this.props.model} field={f} />)
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
    }

    render() {
        let descriptor = this.props.descriptor
        let model = this.props.model || new Model()

        generateKeys(descriptor)

        let areas = !_.isEmpty(descriptor.areas) && descriptor.areas.map(a => <Area key={a.key} model={model} area={a} />)
        let tabs = !_.isEmpty(descriptor.tabs) && <Tabs tabs={descriptor.tabs} model={model} />
        let fields = descriptor.fields.map(f => <Field key={f.property} model={model} field={f} />)

        return (
            <div className="form">
                <form className="form-horizontal" role="form">
                    {areas}
                    <Card padding="true">
                        {tabs}
                        {fields}
                        <div className="clearfix"></div>
                    </Card>

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