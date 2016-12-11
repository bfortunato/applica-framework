"use strict";

import { grids as GridsStore, entities as EntitiesStore } from "../../../stores"
import { Layout, Screen } from "../../components/layout"
import * as ui from "../../utils/ui"
import strings from "../../../strings"
import { getGrid, loadEntities } from "../../../actions"
import { connect } from "../../utils/aj"
import { Card, HeaderBlock, FloatingButton } from "../../components/common"
import { Grid, Filters } from "../../components/grids"
import * as query from "../../../api/query"

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

        connect(this, [GridsStore, EntitiesStore])
    }

    componentDidMount() {
        getGrid({id: this.props.grid})
        loadEntities({entity: this.props.entity, query: this.state.query})
    }

    onQueryChanged() {
        loadEntities({entity: this.props.entity, query: this.state.query})
    }

    createEntity() {

    }

    render() {
        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                action: () => { loadEntities({entity: this.props.entity, query: this.state.query}) }
            },
            {
                type: "button",
                icon: "zmdi zmdi-plus",
                action: () => { swal("Ciao") }
            }

        ]

        let filtersHidden = this.state.query.filters.length == 0

        return (
            <Layout>
                <HeaderBlock title="Users" subtitle="Manage system users" actions={actions}/>
                <Grid descriptor={this.state.grid} result={this.state.result} query={this.state.query} />
                <div className="animated fadeInUpBig" hidden={filtersHidden}>
                    <Filters query={this.state.query} />
                </div>
                <FloatingButton icon="zmdi zmdi-plus" onClick={this.createEntity.bind(this)} />
            </Layout>
        )
    }
}

module.exports = EntitiesList

