import React from "react";
import {FullScreenLayout, Screen} from "../components/layout";
import M from "../../strings";
import {changePassword} from "../../actions/account";

export default class ChangePassword extends Screen {

    constructor(props) {
        super(props)

        this.state = {};
    }

    changePassword() {
        changePassword({password: this.state.password, passwordConfirm: this.state.passwordConfirm})
    }

    updatePassword(value) {
        this.state.password = value.target.value;
    }

    updatePasswordConfirm(value) {
        this.state.passwordConfirm = value.target.value;
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block lc-block-alt toggled" id="l-lockscreen">
                        <div className="lcb-form" ref="changePassword_form">

                            <p>E' necessario impostare una password personale al primo accesso nel sistema</p>
                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-lock"></i></span>
                                <div className="fg-line">
                                    <input type="password" onChange={this.updatePassword.bind(this)} name="password" className="form-control" placeholder={M("password")} />
                                </div>
                            </div>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-lock-outline"></i></span>
                                <div className="fg-line">
                                    <input type="password" name="confirmPassword"  onChange={this.updatePasswordConfirm.bind(this)} className="form-control" placeholder={M("passwordConfirm")} />
                                </div>
                            </div>
                        </div>

                        <a href="javascript:;" onClick={this.changePassword.bind(this)} className="btn btn-login btn-success btn-float waves-effect waves-circle waves-float"><i className="zmdi zmdi-arrow-forward"></i></a>

                    </div>
                </div>

            </FullScreenLayout>
        )
    }

}


