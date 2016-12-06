"use strict";

const AccountStore = require("../../stores").account
const { FullScreenLayout, Screen } = require("../components/layout")
const ui = require("../utils/ui")
const { login } = require("../../actions")
const forms = require("../utils/forms")
const { Preloader } = require("../components/loader")
const { connect } = require("../utils/aj")
import strings from "../../strings"

export default class RegistrationOk extends Screen {

    constructor(props) {
        super(props)

        connect(this, AccountStore)
    }

    goHome() {
        ui.navigate("/")
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-login">
                        <div className="text-center m-b-10"><img src="resources/images/logo.png" /></div>

                        <div className="jumbotron">
                            <h1>{strings.congratulations}!</h1>
                            <p>{this.state.message}</p>
                            <p><a className="btn btn-primary btn-lg waves-effect" href="javascript:;" onClick={this.goHome.bind(this)} role="button">{strings.continue}</a></p>
                        </div>

                        <div className="lcb-navigation">
                            <a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>{strings.register}</span></a>
                            <a href="#recover" data-ma-block="#l-forget-password"><i>?</i> <span>{strings.forgotPassword}</span></a>
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}


