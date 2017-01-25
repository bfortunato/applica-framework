"use strict";

import {EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {connectDiscriminated} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Form} from "../../components/forms"
import {getEntity, saveEntity, freeEntities} from "../../../actions"
import entities from "../../entities"
import * as ui from "../../utils/ui"

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
        if (!_.isEmpty(this.props.entityId)) {
            getEntity({discriminator: this.discriminator, entity: this.props.entity, id: this.props.entityId})
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
        ui.navigate("/admin/entities/" + this.props.entity)
    }

    render() {
        let form = entities[this.props.entity].form

        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-arrow-left",
                tooltip: strings.refresh,
                action: () => { this.goBack() }
            },
            {
                type: "button",
                icon: "zmdi zmdi-save",
                tooltip: strings.create,
                action: () => { this.refs.form.submit() }
            }

        ]

        let descriptor = form.descriptor

        return (
            <Layout>
                <HeaderBlock title={form.title} subtitle={form.subtitle} actions={actions}/>
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


