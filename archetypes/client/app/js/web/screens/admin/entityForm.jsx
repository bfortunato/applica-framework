"use strict";

import {entities as EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {connect} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Form, Text, Mail, Check, Select, Lookup, Image} from "../../components/forms"
import {Grid, TextCell, ActionsCell} from "../../components/grids"
import {check, sanitize} from "../../../libs/validator"
import {saveEntity, freeEntities} from "../../../actions"

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

        let descriptor = {
            id: "user",
            submitText: "Save",
            areas: [
                {
                    title: "General informations",
                    subtitle: "Insert all information about user",
                    fields: [
                        {
                            property: "name",
                            control: Text,
                            label: "Name",
                            placeholder: "Name",
                            sanitizer: (value) => sanitize(value).trim(),
                            validator: (value) => check(value).notEmpty()
                        },
                        {
                            property: "mail",
                            control: Mail,
                            label: "Mail",
                            placeholder: "Mail",
                            sanitizer: (value) => sanitize(value).trim(),
                            validator: (value) => check(value).isEmail()
                        },
                        {
                            property: "active",
                            control: Check,
                            label: "Active",
                            placeholder: "Active",
                            sanitizer: (value) => sanitize(value).toBoolean()
                        },
                        {
                            property: "role",
                            control: Lookup,
                            label: "Role",
                            placeholder: "Role",
                            mode: "multiple",
                            selectionGrid: {
                                "columns": [
                                    {property: "name", header: "Name", cell: TextCell, sortable: true, searchable: false},
                                    {property: "mail", header: "Mail", cell: TextCell, sortable: true, searchable: false},
                                    {
                                        cell: ActionsCell, 
                                        tdClassName: "grid-actions",
                                        actions: [
                                            {icon: "zmdi zmdi-delete", action: () => logger.i("action performed")}
                                        ]
                                    },
                                ]
                            },
                            popupGrid: {
                                columns: [
                                    {property: "name", header: "Name", cell: TextCell, sortable: true, searchable: false},
                                    {property: "mail", header: "Mail", cell: TextCell, sortable: true, searchable: false}
                                ]
                            }
                        },
                        {
                            property: "image",
                            control: Image
                        }
                    ]
                }
            ]
        }

        return (
            <Layout>
                <HeaderBlock title="User" subtitle="Edit user" actions={actions}/>
                <Form ref="form" descriptor={descriptor} data={this.state.data} onSubmit={this.onSubmit.bind(this)} />
            </Layout>
        )
    }
}


