"use strict"

import { FullScreenLayout, Screen } from "../components/layout"
import { login } from "../../actions"
import * as forms from "../utils/forms"
import strings from "../../strings"

export default class Login extends Screen {

    login() {
        let data = forms.serialize(this.refs.login_form)
        login(data)
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-login">
                        <div className="text-center m-b-10"><img src="resources/images/logo.png" /></div>

                        <form action="javascript:" className="lcb-form" onSubmit={this.login.bind(this)} ref="login_form">
                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                                <div className="fg-line">
                                    <input type="email" name="mail" className="form-control" placeholder={strings.mailAddress} />
                                </div>
                            </div>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-male"></i></span>
                                <div className="fg-line">
                                    <input type="password" name="password" className="form-control" placeholder={strings.password} />
                                </div>
                            </div>

                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" name="remember_me" value="1" />
                                        <i className="input-helper"></i>
                                        Keep me signed in
                                </label>
                            </div>

                            <button type="submit" className={"btn btn-login btn-success btn-float animated fadeInLeft"}><i className="zmdi zmdi-arrow-forward"></i></button>
                        </form>

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


