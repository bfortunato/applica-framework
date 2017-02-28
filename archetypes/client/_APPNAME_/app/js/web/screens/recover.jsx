"use strict";

import {AccountStore} from "../../stores"
import M from "../../strings"
import {connect} from "../utils/aj"
import {FullScreenLayout, Screen} from "../components/layout"
import * as ui from "../utils/ui"
import {recoverAccount} from "../../actions"
import * as forms from "../utils/forms"

export default class Recover extends Screen {
    constructor(props) {
        super(props)

        connect(this, AccountStore)
    }

    recover() {
        let data = forms.serialize(this.refs.recover_form)
        recoverAccount(data)
    }

    componentWillUpdate(props, state) {
        if (state.recovered) {
            ui.navigate("/")
        }
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-forget-password">
                        <form action="javascript:;" className="lcb-form" onSubmit={this.recover.bind(this)} ref="recover_form">
                            <p className="text-left">{M("accountRecoverText")}</p>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                                <div className="fg-line">
                                    <input type="email" name="mail" className="form-control" placeholder={M("mailAddress")} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i className="zmdi zmdi-check"></i></button>
                        </form>

                        <div className="lcb-navigation">
                            <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>{M("signIn")}</span></a>
                            <a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>{M("register")}</span></a>
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}


