"use strict";

import {EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import M from "../../../strings"
import {connectDiscriminated} from "../../utils/aj"
import {ActionsMatcher, HeaderBlock} from "../../components/common"
import {Form} from "../../components/forms"
import {freeEntities, getEntity, newEntity, saveEntity} from "../../../actions"
import entities from "../../entities"
import * as ui from "../../utils/ui"
import {optional} from "../../../utils/lang"

export default class EntityForm extends Screen {
    constructor(props) {
        super(props)

        if (_.isEmpty(props.entity)) {
            throw new Error("Please specify entity for form")
        }

        this.discriminator = "entity_form_" + props.entity
        this.initialEntity = null
        this.willGoBack = true

        connectDiscriminated(this.discriminator, this, EntitiesStore, {data: null})
    }

    componentDidMount() {
        let form = this.refs.form
        let model = form.model

        this.onBeforeUnload = function() {
            if (model.hasChanges()) {
                return M("formChangeAlert")
            }
        }

        window.onbeforeunload = this.onBeforeUnload
        ui.addOnBeforeChangeListener(this.onBeforeUnload)

        if (!_.isEmpty(this.props.entityId) && this.props.entityId !== "create") {
            getEntity({discriminator: this.discriminator, entity: this.props.entity, id: this.props.entityId})
        } else {
            newEntity({discriminator: this.discriminator, entity: this.props.entity, id: this.props.entityId})
        }
    }

    componentWillUnmount() {
        freeEntities({discriminator: this.discriminator})

        window.onbeforeunload = null
        ui.removeOnBeforeChangeListener(this.onBeforeUnload)
    }

    submit(goBack) {
        this.willGoBack = goBack
        this.refs.form.submit()
    }

    onSubmit(data) {
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(data)
        } else {
            saveEntity({discriminator: this.discriminator, entity: this.props.entity, data: data, reload: !this.willGoBack})    
        }        
    }

    onCancel() {
        this.goBack()
    }

    goBack() {
        const form = this.refs.form
        const data = form.model.sanitized()
        ui.navigate(this.getGridUrl(data))
    }

    componentWillUpdate(props, state) {
        if (state.saved) {
            this.refs.form.model.reset()
        }

        if (state.saved && this.willGoBack) {
            this.goBack()
            return false
        }

        if (state.validationError) {
            if (state.validationResult) {
                let form = this.refs.form
                if (form && form.model) { 
                    _.each(state.validationResult.errors, e => {
                        form.model.setError(e.property, M(e.message))
                    })
                }
            }
            this.refs.form.model.invalidateForm()
        }
    }

    getEntity() {
        return this.props.entity
    }

    getGridUrl(data) {
        const form = entities[this.getEntity()].form
        let gridUrl = form.gridUrl
        if (_.isFunction(gridUrl)) {
            gridUrl = gridUrl(data)
        }
        return optional(gridUrl, "/entities/" + this.getEntity())
    }

    getActions() {
        let defaultActions = [
            {
                id: "back",
                type: "button",
                icon: "zmdi zmdi-arrow-left",
                tooltip: M("back"),
                action: () => { this.goBack() }
            },
            {
                id: "save",
                type: "button",
                icon: "zmdi zmdi-save",
                tooltip: M("save"),
                action: () => { this.submit(true) }
            },
            /*
            {
                id: "save-go-back",
                type: "button",
                icon: "zmdi zmdi-rotate-ccw",
                tooltip: M("saveAndGoBack"),
                action: () => { this.submit(true) }
            }
            */
        ]

        let form = entities[this.getEntity()].form
        let matcher = new ActionsMatcher(defaultActions)
        return matcher.match(form.actions)
    }

    getTitle() {
        let form = entities[this.getEntity()].form
        return optional(form.title, "Edit")
    }

    getSubtitle() {
        let form = entities[this.getEntity()].form
        return form.subtitle
    }

    getDescriptor() {
        let form = entities[this.getEntity()].form
        return form.descriptor
    }

    getFormComponent() {
        let form = entities[this.getEntity()].form
        return optional(() => form.component, () => Form)
    }

    render() {
        let title = this.getTitle()
        let subtitle = this.getSubtitle()
        let actions = this.getActions()
        let descriptor = this.getDescriptor()
        let component = this.getFormComponent()

        return (
            <Layout>
                <HeaderBlock title={title} subtitle={subtitle} actions={actions}/>
                {React.createElement(component, {
                    ref: "form",
                    descriptor: descriptor,
                    data: this.state.data,
                    onSubmit: this.onSubmit.bind(this),
                    onCancel: this.onCancel.bind(this)
                })}
            </Layout>
        )
    }
}


