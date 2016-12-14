"use strict";

import {entities as EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {loadEntities, deleteEntities} from "../../../actions"
import {connect} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Grid} from "../../components/grids"
import * as query from "../../../api/query"
import {format} from "../../../utils/lang"

function isCancel(which) {
    return which == 46 || which == 8
}

function isEsc(which) {
    return which == 27
}

class EntitiesList extends Screen {
    constructor(props) {
        super(props)

        let _query = query.create()
        _query.page = 1
        _query.rowsPerPage = 20

        this.state = {grid: null, result: null, query: _query}

        this.state.query.on("change", () => {
            this.onQueryChanged()
        })

        connect(this, [EntitiesStore])
    }

    componentDidMount() {
        loadEntities({entity: this.props.entity, query: this.state.query})
    }

    onQueryChanged() {
        loadEntities({entity: this.props.entity, query: this.state.query})
    }

    createEntity() {

    }

    deleteEntities() {
        let selection = this.refs.grid.getSelection()
        if (_.isEmpty(selection)) {
            return
        }

        swal({ title: strings.confirm, text: format(strings.entityDeleteConfirm, selection.length), showCancelButton: true })
            .then(() => {
                deleteEntities({entity: this.props.entity, ids: selection.map(s => s.id)})
            })
            .catch(() => {})
    }

    onGridKeyDown(e) {
        if (isCancel(e.which)) {
            this.deleteEntities()
        } else if (isEsc(e.which)) {
            this.refs.grid.clearSelection()
        }
    }

    render() {
        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                tooltip: strings.refresh,
                action: () => { loadEntities({entity: this.props.entity, query: this.state.query}) }
            },
            {
                type: "button",
                icon: "zmdi zmdi-plus",
                tooltip: strings.create,
                action: () => { swal("Ciao") }
            },
            {
                type: "button",
                icon: "zmdi zmdi-delete",
                tooltip: strings.delete,
                action: () => { this.deleteEntities() }
            },
            {
                type: "button",
                icon: "zmdi zmdi-select-all",
                tooltip: strings.selectAll,
                action: () => { this.refs.grid.toggleSelectAll() }
            }

        ]

        let descriptor = {
            "id": "users",
            "columns": [
                {"property": "name", "header": "Name", "component": "text", "sortable": true},
                {"property": "mail", "header": "Mail", "component": "text", "sortable": true},
                {"property": "active", "header": "Active", "component": "check"}
            ]
        }

         return (
            <Layout>
                <HeaderBlock title="Users" subtitle="Manage system users" actions={actions}/>
                <Grid ref="grid" descriptor={descriptor} result={this.state.result} query={this.state.query} onKeyDown={this.onGridKeyDown.bind(this)} />
                <FloatingButton icon="zmdi zmdi-plus" onClick={this.createEntity.bind(this)} />
            </Layout>
        )
    }
}

module.exports = EntitiesList

