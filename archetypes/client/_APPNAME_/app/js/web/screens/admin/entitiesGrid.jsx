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

        if (_.isEmpty(this.getEntity())) {
            throw new Error("Please specify entity for form")
        }

        let _query = query.create()
        _query.page = 1
        _query.rowsPerPage = 50

        this.state = {grid: null, result: null, query: _query}

        this.state.query.on("change", () => {
            this.onQueryChanged()
        })

        this.discriminator = "entity_grid_" + this.getEntity()

        connectDiscriminated(this.discriminator, this, [EntitiesStore])
    }

    getEntity() {
        return this.props.entity
    }

    componentDidMount() {
        loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query})
    }

    onQueryChanged() {
        loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query})
    }

    editEntity(data) {
        ui.navigate(`/entities/${this.getEntity()}/${data.id}`)
    }

    createEntity() {
        ui.navigate(`/entities/${this.getEntity()}/create`)
    }

    deleteEntities() {
        let selection = this.refs.grid.getSelection()
        if (_.isEmpty(selection)) {
            return
        }

        swal({ title: strings.confirm, text: format(strings.entityDeleteConfirm, selection.length), showCancelButton: true })
            .then(() => {
                deleteEntities({discriminator: this.discriminator, entity: this.getEntity(), ids: selection.map(s => s.id)})
            })
            .catch((e) => {logger.i(e)})
    }

    onGridKeyDown(e) {
        if (isCancel(e.which)) {
            this.deleteEntities()
        }
    }

    onGridRowDoubleClick(row) {
        this.editEntity(row)
    }

    getTitle() {
        let grid = entities[this.getEntity()].grid
        return grid.title
    }

    getSubtitle() {
        let grid = entities[this.getEntity()].grid
        return grid.subtitle
    }

    getActions() {
        let actions = [
            {
                id: "refresh",
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                tooltip: strings.refresh,
                action: () => { loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query}) }
            },
            {
                id: "create",
                type: "button",
                icon: "zmdi zmdi-plus",
                tooltip: strings.create,
                action: () => { this.createEntity() }
            },
            {
                id: "delete",
                type: "button",
                icon: "zmdi zmdi-delete",
                tooltip: strings.delete,
                action: () => { this.deleteEntities() }
            },
            {
                id: "selectAll",
                type: "button",
                icon: "zmdi zmdi-select-all",
                tooltip: strings.selectAll,
                action: () => { this.refs.grid.toggleSelectAll() }
            }

        ]

        return actions;
    }

    getDescriptor() {
        let grid = entities[this.getEntity()].grid
        return grid.descriptor
    }

    getData() {
        return resultToGridData(this.state.result)
    }

    isQuickSearchEnabled() {
        return false
    }

    isCreationEnabled() {
        return true
    }

    render() {
        let title = this.getTitle()
        let subtitle = this.getSubtitle()
        let actions = this.getActions()
        let descriptor = this.getDescriptor()
        let data = this.getData()

        return (
            <Layout>
                <HeaderBlock title={title} subtitle={subtitle} actions={actions}/>
                <Grid
                    ref="grid"
                    descriptor={descriptor}
                    data={data}
                    query={this.state.query}
                    onKeyDown={this.onGridKeyDown.bind(this)}
                    onRowDoubleClick={this.onGridRowDoubleClick.bind(this)}
                    quickSearchEnabled={this.isQuickSearchEnabled()}
                />
                {this.isCreationEnabled() &&
                <FloatingButton icon="zmdi zmdi-plus" onClick={this.createEntity.bind(this)} />
                }
            </Layout>
        )
    }
}

