"use strict";

import {EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {connect} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Form} from "../../components/forms"
import {saveEntity, freeEntities} from "../../../actions"
import entities from "../../entities"

function isCancel(which) {
    return which == 46 || which == 8
}

function isEsc(which) {
    return which == 27
}

let discriminator = 1

export default class EntityForm extends Screen {
    constructor(props) {
        super(props)

        connect(this, EntitiesStore, {data: {name: "Bruno", mail: "bimbobruno@gmail.com", active: true, roles: []}})
    }

    componentDidMount() {
        this.discriminator = discriminator++
    }

    componentWillUnmount() {
        freeEntities(this.discriminator)
    }

    onSubmit(data) {
        saveEntity({entity: this.props.entity, data: data})
    }

    render() {
        let form = entities[this.props.entity].form

        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-arrow-left",
                tooltip: strings.refresh,
                action: () => { swal("Ciao") }
            },
            {
                type: "button",
                icon: "zmdi zmdi-save",
                tooltip: strings.create,
                action: () => { swal("Ciao") }
            }

        ]

        let descriptor = form.descriptor

        return (
            <Layout>
                <HeaderBlock title={form.title} subtitle={form.subtitle} actions={actions}/>
                <Form ref="form" descriptor={descriptor} data={this.state.data} onSubmit={this.onSubmit.bind(this)} />
            </Layout>
        )
    }
}


