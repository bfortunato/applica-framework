"use strict";

import {AccountStore} from "../../stores"
import M from "../../strings"
import {connect} from "../utils/aj"
import {FullScreenLayout, Screen} from "../components/layout"
import * as ui from "../utils/ui"
import {register} from "../../actions"
import * as forms from "../utils/forms"

export default class Register extends Screen {
    constructor(props) {
        super(props)

        connect(this, AccountStore)
    }

    register() {
        let data = forms.serialize(this.refs.register_form)
        register(data)
    }

    componentWillUpdate(props, state) {
        if (state.registered) {
            ui.navigate("/registrationComplete")
        }
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-register">
                        <form action="javascript:;" className="lcb-form" onSubmit={this.register.bind(this)} ref="register_form">
                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-account"></i></span>
                                <div className="fg-line">
                                    <input type="text" name="name" className="form-control" placeholder={M("name")} />
                                </div>
                            </div>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                                <div className="fg-line">
                                    <input type="email" name="mail" className="form-control" placeholder={M("mailAddress")} />
                                </div>
                            </div>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-male"></i></span>
                                <div className="fg-line">
                                    <input type="password" name="password" className="form-control" placeholder={M("password")} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i className="zmdi zmdi-check"></i></button>
                        </form>

                        <div className="lcb-navigation">
                            <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>{M("signIn")}</span></a>
                            <a href="#recover" data-ma-block="#l-forget-password"><i>?</i> <span>{M("forgotPassword")}</span></a>
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}

