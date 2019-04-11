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

    componentDidMount() {
        const me = ReactDOM.findDOMNode(this)
        $(me).find(".form-control").change(function () {
            var x = $(this).val();

            if(!x.length == 0) {
                $(this).addClass("form-control--active");
            }
        }).change();

        $(me).on("blur input", ".form-group--float .form-control", function(){
            var i = $(this).val();

            if (i.length == 0) {
                $(this).removeClass("form-control--active");
            }
            else {
                $(this).addClass("form-control--active");
            }
        });     
        
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
                <div className="login">
                    <div class="login__block active" id="l-forget-password">
                        <div class="login__block__header palette-Purple bg">
                            <i class="zmdi zmdi-account-circle"></i>
                            Forgot Password?

                            <div class="actions actions--inverse login__block__actions">
                                <div class="dropdown">
                                    <i data-toggle="dropdown" class="zmdi zmdi-more-vert actions__item"></i>

                                    <div class="dropdown-menu dropdown-menu-right">
                                        <a class="dropdown-item" href="/#/login">Already have an account?</a>
                                        <a class="dropdown-item" href="/#/register">Create an account</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="login__block__body">
                            {content}
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

                <div class="form-group form-group--float form-group--centered">
                    <input type="text" name="mail" class="form-control" />
                    <label>Email Address</label>
                    <i class="form-group__bar"></i>
                </div>

                <button type="submit" className="btn btn--icon login__block__btn"><i className="zmdi zmdi-check"></i></button>
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

               <div class="form-group form-group--float form-group--centered">
                    <input type="text" name="code" class="form-control" />
                    <label>Validation code</label>
                    <i class="form-group__bar"></i>
                </div>

                <button
                    type="button"
                    className = "btn btn--icon login__block__btn"
                    onClick = {this.onTryAgain.bind(this)}
                >
                    <i className = "zmdi zmdi-refresh"/>
                    {M("requestNew")}
                </button>

                <button type="submit" className="btn btn--icon login__block__btn"><i
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


