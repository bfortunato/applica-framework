"use strict";

import {EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {connectDiscriminated} from "../../utils/aj"
import {HeaderBlock, ActionsMatcher} from "../../components/common"
import {Form} from "../../components/forms"
import {newEntity, getEntity, saveEntity, freeEntities} from "../../../actions"
import entities from "../../entities"
import * as ui from "../../utils/ui"
import {optional} from "../../../utils/lang";

export default class EntityForm extends Screen {
    constructor(props) {
        super(props)

        if (_.isEmpty(props.entity)) {
            throw new Error("Please specify entity for form")
        }

        this.discriminator = "entity_form_" + props.entity

        connectDiscriminated(this.discriminator, this, EntitiesStore, {data: null})
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.entityId) && this.props.entityId != "create") {
            getEntity({discriminator: this.discriminator, entity: this.props.entity, id: this.props.entityId})
        } else {
            newEntity({discriminator: this.discriminator, entity: this.props.entity, id: this.props.entityId})
        }
    }

    componentWillUnmount() {
        freeEntities(this.discriminator)
    }

    onSubmit(data) {
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(data)
        } else {
            saveEntity({discriminator: this.discriminator, entity: this.props.entity, data: data})    
        }
        
    }

    onCancel() {
        this.goBack()
    }

    goBack() {
        ui.navigate(this.getGridUrl())
    }

    componentWillUpdate(props, state) {
        if (state.saved) {
            this.goBack()
            return false
        }
    }

    getEntity() {
        return this.props.entity
    }

    getGridUrl() {
        let form = entities[this.getEntity()].form
        return optional(form.gridUrl, "/entities/" + this.getEntity())
    }

    getActions() {
        let defaultActions = [
            {
                type: "button",
                icon: "zmdi zmdi-arrow-left",
                tooltip: strings.back,
                action: () => { this.goBack() }
            },
            {
                type: "button",
                icon: "zmdi zmdi-save",
                tooltip: strings.save,
                action: () => { this.refs.form.submit() }
            }

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

    render() {
        let title = this.getTitle()
        let subtitle = this.getSubtitle()
        let actions = this.getActions()
        let descriptor = this.getDescriptor()

        return (
            <Layout>
                <HeaderBlock title={title} subtitle={subtitle} actions={actions}/>
                <Form
                    ref="form"
                    descriptor={descriptor} 
                    data={this.state.data} 
                    onSubmit={this.onSubmit.bind(this)} 
                    onCancel={this.onCancel.bind(this)}
                    />
            </Layout>
        )
    }
}


