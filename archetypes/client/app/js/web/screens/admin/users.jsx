"use strict";

//const UsersStore = require("../../../stores").users
const { Layout, Screen } = require("../../components/layout");
const ui = require("../../utils/ui");
const forms = require("../../utils/forms");
import strings from "../../../strings"
const { getUsers } = require("../../../actions")
import { connect } from "../../utils/aj"
import { Card } from "../../components/common"
import { Grid, TextColumn, CheckColumn } from "../../components/grids"

class Users extends Screen {
    constructor(props) {
        super(props)

        this.state = {result: null}
        //connect(this, UsersStore, {users: []})
    }

    render() {
        return (
            <Layout>
                <Card title="Users">
                    <Grid data={this.state.result}>
                        <TextColumn property="mail" />
                        <CheckColumn property="active" />
                    </Grid>
                </Card>
            </Layout>
        )
    }
}

module.exports = Users

