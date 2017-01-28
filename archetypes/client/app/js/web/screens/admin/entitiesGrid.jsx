"use strict";

import {EntitiesStore} from "../../../stores"
import {Layout, Screen} from "../../components/layout"
import strings from "../../../strings"
import {loadEntities, deleteEntities} from "../../../actions"
import {connectDiscriminated} from "../../utils/aj"
import {HeaderBlock, FloatingButton} from "../../components/common"
import {Grid, resultToGridData} from "../../components/grids"
import * as query from "../../../api/query"
import {format} from "../../../utils/lang"
import {isCancel} from "../../utils/keyboard"
import entities from "../../entities"
import * as ui from "../../utils/ui"

export default class EntitiesGrid extends Screen {
    constructor(props) {
        super(props)

        if (_.isEmpty(props.entity)) {
            throw new Error("Please specify entity for form")
        }

        let _query = query.create()
        _query.page = 1
        _query.rowsPerPage = 50

        this.state = {grid: null, result: null, query: _query}

        this.state.query.on("change", () => {
            this.onQueryChanged()
        })

        this.discriminator = "entity_grid_" + this.props.entity

        connectDiscriminated(this.discriminator, this, [EntitiesStore])
    }

    componentDidMount() {
        loadEntities({discriminator: this.discriminator, entity: this.props.entity, query: this.state.query})
    }

    onQueryChanged() {
        loadEntities({discriminator: this.discriminator, entity: this.props.entity, query: this.state.query})
    }

    createEntity() {
        ui.navigate(`/admin/entities/${this.props.entity}/create`)
    }

    deleteEntities() {
        let selection = this.refs.grid.getSelection()
        if (_.isEmpty(selection)) {
            return
        }

        swal({ title: strings.confirm, text: format(strings.entityDeleteConfirm, selection.length), showCancelButton: true })
            .then(() => {
                deleteEntities({discriminator: this.discriminator, entity: this.props.entity, ids: selection.map(s => s.id)})
            })
            .catch((e) => {logger.i(e)})
    }

    onGridKeyDown(e) {
        if (isCancel(e.which)) {
            this.deleteEntities()
        }
    }

    onGridRowDoubleClick(row) {
        ui.navigate(`/admin/entities/${this.props.entity}/${row.id}`)
    }

    render() {
        let grid = entities[this.props.entity].grid

        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                tooltip: strings.refresh,
                action: () => { loadEntities({discriminator: this.discriminator, entity: this.props.entity, query: this.state.query}) }
            },
            {
                type: "button",
                icon: "zmdi zmdi-plus",
                tooltip: strings.create,
                action: () => { this.createEntity() }
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

        let descriptor = grid.descriptor
        let data = resultToGridData(this.state.result)

        return (
            <Layout>
                <HeaderBlock title={grid.title} subtitle={grid.subtitle} actions={actions}/>
                <Grid 
                    ref="grid" 
                    descriptor={descriptor} 
                    data={data} 
                    query={this.state.query} 
                    onKeyDown={this.onGridKeyDown.bind(this)} 
                    onRowDoubleClick={this.onGridRowDoubleClick.bind(this)}
                />
                <FloatingButton icon="zmdi zmdi-plus" onClick={this.createEntity.bind(this)} />
            </Layout>
        )
    }
}

