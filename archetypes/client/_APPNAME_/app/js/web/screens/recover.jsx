"use strict";

import {AccountStore} from "../../stores/account";
import M from "../../strings";
import {connect} from "../utils/aj";
import {FullScreenLayout, Screen} from "../components/layout";
import * as ui from "../utils/ui";
import {requestRecoveryCode, resetPassword, validateRecoveryCode} from "../../actions/account";
import * as forms from "../utils/forms";
import {safeGet} from "../../utils/lang";
import * as _ from "../../libs/underscore"
import {PasswordRecoveryStore} from "../../stores/passwordRecovery";

export default class Recover extends Screen {
    constructor(props) {
        super(props);
        connect(this, [AccountStore, PasswordRecoveryStore]);
    }

    requestCode(data) {
        requestRecoveryCode(data);
    }

    requestNewCode() {
        let data = {
            mail: this.state.mail,
        };
        this.requestCode(data);
    }

    validateCode(data) {
        data.mail = this.state.mail;
        validateRecoveryCode(data);
    }

    resetPassword(data) {
        _.assign(data,{mail: this.state.mail, code: this.state.code});
        resetPassword(data);
    }

    componentWillUpdate(props, state) {
        if (state.recovered) {
            // ui.navigate("/")
        }
    }

    getContent(){
        let recoveryStep = safeGet(this.state,"recoveryStep", 1);
        switch (recoveryStep) {
            case 1:
                return <CodeRequestForm
                    onSubmit = {this.requestCode.bind(this)}
                />;
            case 2:
                return <CodeValidationForm
                    onSubmit = {this.validateCode.bind(this)}
                    onTryAgain = {this.requestNewCode.bind(this)}
                />;
            case 3:
                return <PasswordChangeForm
                    onSubmit = {this.resetPassword.bind(this)}
                />;
            case 4:
                return ui.navigate("/");
            default:
                return "";
        }
    }

    render() {

        let content = this.getContent();
        return (
            <FullScreenLayout>
                <div className="login-content">
                    <div className="lc-block toggled" id="l-forget-password">
                        {content}

                        <div className="lcb-navigation">
                            <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i>
                                <span>{M("signIn")}</span></a>
                            {/*<a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i>*/}
                                {/*<span>{M("register")}</span></a>*/}
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}

class CodeRequestForm extends React.Component {
    constructor(props) {
        super(props);
    }

    onSubmit() {
        let data = forms.serialize(this.refs.recover_form);
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(data);
        }
    }

    render() {
        return (
            <form action="javascript:;" className="lcb-form" onSubmit={this.onSubmit.bind(this)}
                  ref="recover_form">
                <p className="text-left">{M("accountRecoverText")}</p>

                <div className="input-group m-b-20">
                    <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                    <div className="fg-line">
                        <input type="email" name="mail" className="form-control"
                               placeholder={M("mailAddress")}/>
                    </div>
                </div>

                <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i
                    className="zmdi zmdi-check"></i></button>
            </form>
        )

    }
}

class CodeValidationForm extends React.Component {
    constructor(props){
        super(props);
    }

    onSubmit() {
        let data = forms.serialize(this.refs.validate_code_form);
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(data);
        }
    }

    onTryAgain() {
        if (_.isFunction(this.props.onTryAgain)) {
            this.props.onTryAgain();
        }
    }

    render(){
        return(
            <form action="javascript:;" className="lcb-form" onSubmit={this.onSubmit.bind(this)}
                  ref="validate_code_form">
                <p className="text-left">{M("codeValidationText")}</p>

                <div className="input-group m-b-20">
                    <span className="input-group-addon"><i className="zmdi zmdi-key"></i></span>
                    <div className="fg-line">
                        <input type="text" name="code" className="form-control"
                               placeholder={M("validationCode")}/>
                    </div>
                </div>

                <button
                    type="button"
                    className = "btn btn-success btn-icon-text waves-effect"
                    onClick = {this.onTryAgain.bind(this)}
                >
                    <i className = "zmdi zmdi-refresh"/>
                    {M("requestNew")}
                </button>

                <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i
                    className="zmdi zmdi-check"></i></button>


            </form>
        )
    }
}

class PasswordChangeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit(){
        let data = {
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm,
        };
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(data);
        }
    }

    updatePassword(e){
        this.setState({password: e.target.value});
    }

    updatePasswordConfirm(e){

        this.setState({passwordConfirm: e.target.value});
    }

    render(){
        return(
            <form action="javascript:;" className="lcb-form" onSubmit={this.onSubmit.bind(this)}
                  ref="validate_code_form">
                <p className="text-left">{M("newPasswordText")}</p>

                <div className="input-group m-b-20">
                    <span className="input-group-addon"><i className="zmdi zmdi-lock"></i></span>
                    <div className="fg-line">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder={M("password")}
                            onChange={this.updatePassword.bind(this)}
                        />
                    </div>
                </div>

                <div className="input-group m-b-20">
                    <span className="input-group-addon"><i className="zmdi zmdi-lock-outline"></i></span>
                    <div className="fg-line">
                        <input
                            type="password"
                            name="passwordConfirm"
                            className="form-control"
                            placeholder={M("passwordConfirm")}
                            onChange={this.updatePasswordConfirm.bind(this)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-login btn-success btn-float animated fadeInLeft"><i
                    className="zmdi zmdi-check"></i></button>

            </form>
        )
    }
}


