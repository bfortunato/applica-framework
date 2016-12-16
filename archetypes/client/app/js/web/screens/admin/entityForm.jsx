"use strict";

import {entities as EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {connect} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Form, Text, Mail, Check} from "../../components/forms"

function isCancel(which) {
    return which == 46 || which == 8
}

function isEsc(which) {
    return which == 27
}

export default class EntityForm extends Screen {
    constructor(props) {
        super(props)

        connect(this, [EntitiesStore])
    }

    saveEntity() {

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
                        {property: "name", control: Text, label: "Name", placeholder: "Name"},
                        {property: "mail", control: Mail, label: "Mail", placeholder: "Mail"},
                        {property: "active", control: Check, label: "", placeholder: "Active"},
                    ]
                },
                {
                    title: "General informations 2",
                    subtitle: "Insert all information about user",
                    fields: [
                        {property: "name", control: Text, label: "Name", placeholder: "Name"},
                        {property: "mail", control: Mail, label: "Mail", placeholder: "Mail"},
                        {property: "active", control: Check, label: "", placeholder: "Active"},
                    ]
                }
            ],
            tabs: [
                {
                    title: "Tab 1",
                    fields: [
                        {property: "tab1_name1", control: Text, label: "tab1_name1", placeholder: "tab1_placeholder1"},
                        {property: "tab1_name2", control: Text, label: "tab1_name2", placeholder: "tab1_placeholder2"}
                    ]
                },
                {
                    title: "Tab 2",
                    fields: [
                        {property: "tab2_name1", control: Text, label: "tab2_name1", placeholder: "tab2_placeholder1"},
                        {property: "tab2_name2", control: Text, label: "tab2_name2", placeholder: "tab2_placeholder2"}
                    ]
                }
            ],
            fields: [
                {property: "root_name", control: Text, placeholder: "Name", size: "col-sm-6"},
                {property: "root_mail", control: Mail, placeholder: "Mail", size: "col-sm-6"},
            ]
        }

        return (
            <Layout>
                <HeaderBlock title="User" subtitle="Edit user" actions={actions}/>
                <Form ref="form" descriptor={descriptor} />
            </Layout>
        )
    }
}


