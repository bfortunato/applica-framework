"use strict";

const GridsStore = require("../../../stores").grids
const EntitiesStore = require("../../../stores").entities
const { Layout, Screen } = require("../../components/layout")
const ui = require("../../utils/ui")
import strings from "../../../strings"
const { getGrid, loadEntities } = require("../../../actions")
import { connect } from "../../utils/aj"
import { Card } from "../../components/common"
import { Grid, TextColumn, CheckColumn } from "../../components/grids"
import * as query from "../../../api/query"

class EntitiesList extends Screen {
    constructor(props) {
        super(props)

        this.state = {grid: null, result: null, query: query.create()}

        connect(this, [GridsStore, EntitiesStore])
    }

    componentDidMount() {
        getGrid({id: this.props.grid})
        loadEntities({entity: this.props.entity})
    }

    onQueryChanged() {
        loadEntities({entity: this.props.entity, query: this.state.query})
    }

    render() {
        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                action: () => { loadEntities({entity: this.props.entity}) }
            },
            {
                type: "button",
                icon: "zmdi zmdi-plus",
                action: () => { swal("Ciao") }
            }

        ]

        return (
            <Layout>
                <Card title="Users" actions={actions}>
                    <Grid descriptor={this.state.grid} result={this.state.result} query={this.state.query} onQueryChanged={this.onQueryChanged.bind(this)} />
                </Card>
            </Layout>
        )
    }
}

module.exports = EntitiesList

