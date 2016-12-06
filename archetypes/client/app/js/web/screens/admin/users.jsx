"use strict";

const GridsStore = require("../../../stores").grids
const { Layout, Screen } = require("../../components/layout")
const ui = require("../../utils/ui")
import strings from "../../../strings"
const { getGrid } = require("../../../actions")
import { connect } from "../../utils/aj"
import { Card } from "../../components/common"
import { Grid, TextColumn, CheckColumn } from "../../components/grids"

class Users extends Screen {
    constructor(props) {
        super(props)

        connect(this, GridsStore, {descriptor: null, result: null})
    }

    componentDidMount() {
        getGrid({id: "users"})
    }

    render() {
        return (
            <Layout>
                <Card title="Users">
                    <Grid descriptor={this.state.grid} />
                </Card>
            </Layout>


        )
    }
}

module.exports = Users

