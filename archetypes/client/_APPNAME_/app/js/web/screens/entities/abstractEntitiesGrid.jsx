import _ from "underscore";
import React from "react";
import {Layout, Screen} from "../../components/layout";
import {SearchStore} from "../../../stores/entities";
import M from "../../../strings";
import {deleteEntities, freeEntities, loadEntities, updateQuery} from "../../../actions/entities";
import {ActionsMatcher, FloatingButton, HeaderBlock} from "../../components/common";
import {Grid, resultToGridData} from "../../components/grids";
import * as query from "../../../framework/query";
import {format, optional} from "../../../utils/lang";
import entities from "../../entities";
import * as ui from "../../utils/ui";
import {Permission} from "../../../api/session";
import {discriminated} from "../../../utils/ajex";

export default class AbstractEntitiesGrid extends Screen {
    constructor(props) {
        super(props)

        if (_.isEmpty(this.getEntity())) {
            throw new Error("Please specify entity for form")
        }

        this.discriminator = "entity_grid_" + this.getEntity()
        let _query = this.getInitialQuery();
        this.state = {grid: null, result: null, query: _query}
        this.state.query.on("change", () => {
            updateQuery({discriminator: this.discriminator, query: this.state.query});
            this.onQueryChanged()
        })

        this.state = {grid: null, result: null, query: _query}
    }


    getInitialQuery() {

        let state = optional(discriminated(optional(SearchStore.state, {}), this.discriminator), {});
        let _query;
        if (state ) {
            _query = state.query;
        }

        if (!_query)
            _query = entities[this.getEntity()].grid.initialQuery


        if (_.isFunction(entities[this.getEntity()].grid.initialQuery)) {
            _query = entities[this.getEntity()].grid.initialQuery()
        }
        if (!_query) {
            _query = query.create()
            _query.page = 1
            _query.rowsPerPage = 50
        }

        return _query;
    }

    getEntity() {
        return this.props.entity
    }

    componentDidMount() {
        loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query})
    }

    componentWillUnmount() {
        freeEntities({discriminator: this.discriminator})
    }

    onQueryChanged() {
        loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query})
    }

    editEntity(data) {
        if (!this.canEdit()) {
            return
        }

        ui.navigate(this.getEditUrl(data))
    }

    createEntity() {
        if (!this.canCreate()) {
            return
        }

        ui.navigate(this.getCreateUrl())
    }

    getCreateUrl() {
        let grid = entities[this.getEntity()].grid
        let createUrl = grid.createUrl
        if (_.isFunction(createUrl)) {
            createUrl = createUrl()
        }
        return optional(createUrl, `/entities/${this.getEntity()}/new`)
    }

    getEditUrl(data) {
        let grid = entities[this.getEntity()].grid
        if (_.isFunction(grid.editUrl)) {
            return format(grid.editUrl(data))
        } else if (!_.isEmpty(grid.editUrl)) {
            return format(grid.editUrl, data.id)
        } else {
            return `/entities/${this.getEntity()}/${data.id}`
        }
    }
    getDeleteMessage() {
        let message = format(M("entityDeleteConfirm"), this.refs.grid.getSelection().length)
        let entityMessage = this.getGrid().deleteMessage
        if (entityMessage)
            message = format("{0}\n{1}", message, entityMessage)
        return message;
    }

    deleteEntities() {
        if (!this.canDelete()) {
            return
        }

        let selection = this.refs.grid.getSelection()
        if (_.isEmpty(selection)) {
            return
        }

        swal({ title: M("confirm"), text: this.getDeleteMessage(), showCancelButton: true })
            .then(res => {
                if (res.value) {
                    deleteEntities({discriminator: this.discriminator, entity: this.getEntity(), ids: selection.map(s => s.id)})
                }
            })
    }

    onGridRowDoubleClick(row) {
        this.editEntity(row)
    }

    getTitle() {
        let grid = entities[this.getEntity()].grid
        return optional(grid.title, "List")
    }

    getSubtitle() {
        let grid = entities[this.getEntity()].grid
        return grid.subtitle
    }

    getActions() {
        let defaultActions = [
            {
                id: "refresh",
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                tooltip: M("refresh"),
                permissions: [this.getEntity() + ":" + Permission.LIST],
                action: () => { loadEntities({discriminator: this.discriminator, entity: this.getEntity(), query: this.state.query}) }
            },
            {
                id: "create",
                type: "button",
                icon: "zmdi zmdi-plus",
                tooltip: M("create"),
                permissions: [this.getEntity() + ":" + Permission.NEW],
                action: () => { this.createEntity() }
            },
            {
                id: "delete",
                type: "button",
                icon: "zmdi zmdi-delete",
                tooltip: M("delete"),
                permissions: [this.getEntity() + ":" + Permission.DELETE],
                action: () => { this.deleteEntities() }
            },
            {
                id: "selectAll",
                type: "button",
                icon: "zmdi zmdi-select-all",
                tooltip: M("selectAll"),
                action: () => { this.refs.grid.toggleSelectAll() }
            }

        ]

        let grid = entities[this.getEntity()].grid
        let matcher = new ActionsMatcher(defaultActions)
        return matcher.match(grid.actions)
    }

    getGrid() {
        return this.refs.grid
    }

    getDescriptor() {
        let grid = entities[this.getEntity()].grid
        return grid.descriptor
    }

    getData() {
        return resultToGridData(this.state.result)
    }

    isQuickSearchEnabled() {
        let grid = entities[this.getEntity()].grid
        return optional(grid.quickSearchEnabled, false)
    }

    canEdit() {
        let grid = entities[this.getEntity()].grid
        return optional(grid.canEdit, true)
    }

    canCreate() {
        let grid = entities[this.getEntity()].grid
        return optional(grid.canCreate, true)
    }

    canDelete() {
        let grid = entities[this.getEntity()].grid
        return optional(grid.canDelete, true)
    }

    hideFilters() {
        return false;
    }


    generateHeaderBlock() {

        let title = this.getTitle()
        let subtitle = this.getSubtitle()
        let actions = this.getActions()
        return <HeaderBlock title={title} subtitle={subtitle} actions={actions}/>
    }

    render() {

        let descriptor = this.getDescriptor()
        let data = this.getData()
        let header = this.generateHeaderBlock()

        return (
            <Layout>
                {header}
                <Grid
                    ref="grid"
                    descriptor={descriptor}
                    data={data}
                    hideFilters={this.hideFilters()}
                    query={this.state.query}
                    //onKeyDown={this.onGridKeyDown.bind(this)}
                    onRowDoubleClick={this.onGridRowDoubleClick.bind(this)}
                    quickSearchEnabled={this.isQuickSearchEnabled()}
                />
                {this.canCreate() &&
                <FloatingButton icon="zmdi zmdi-plus" onClick={this.createEntity.bind(this)} />
                }
            </Layout>
        )
    }
}

