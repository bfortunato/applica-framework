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

class Users extends Screen {
    constructor(props) {
        super(props)

        this.state = {grid: null, result: null}

        connect(this, [GridsStore, EntitiesStore])
    }

    componentDidMount() {
        getGrid({id: "users"})
        loadEntities({entity: "user"})
    }

    render() {
        let actions = [
            {
                type: "button",
                icon: "zmdi zmdi-refresh-alt",
                action: () => { loadEntities({entity: "user"}) }
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
                    <Grid descriptor={this.state.grid} result={this.state.result} />
                </Card>
            </Layout>
        )
    }
}

module.exports = Users

