"use strict";

const AccountStore = require("../../stores").account
const { FullScreenLayout, Screen } = require("../components/layout");
const ui = require("../utils/ui");
const forms = require("../utils/forms");
import strings from "../../strings"
const { setActivationCode, confirmAccount } = require("../../actions")
import { connect } from "../utils/aj"

export default class Recover extends Screen {
    constructor(props) {
        super(props)

        connect(this, AccountStore, {activationCode: ""})
    }

    confirm() {
        let data = forms.serialize(this.refs.confirm_form)
        confirmAccount(data)
    }

    componentWillUpdate(props, state) {
        if (state.confirmed) {
            ui.navigate("/")
        }
    }

    componentDidMount() {
        setActivationCode({activationCode: this.props.activationCode})
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-forget-password">
                        <form action="javascript:;" className="lcb-form" onSubmit={this.confirm.bind(this)} ref="confirm_form">
                            <p className="text-left">{strings.accountConfirmText}</p>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-lock"></i></span>
                                <div className="fg-line">
                                    <input type="text" name="activationCode" className="form-control" placeholder={strings.activationCode} value={this.state.activationCode} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i className="zmdi zmdi-lock-open"></i></button>
                        </form>

                        <div className="lcb-navigation">
                            <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>{strings.signIn}</span></a>
                            <a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>{strings.register}</span></a>
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}


