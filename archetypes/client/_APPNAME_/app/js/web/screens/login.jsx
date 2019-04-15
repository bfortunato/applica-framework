import React from "react";
import ReactDOM from "react-dom";
import {FullScreenLayout, Screen} from "../components/layout";
import {login} from "../../actions/session";
import * as forms from "../utils/forms";
import M from "../../strings";
import {SessionStore} from "../../stores/session";
import {connect} from "../utils/aj";

export default class Login extends Screen {

    constructor(props) {
        super(props)

        connect(this, SessionStore)
    }

    login() {
        let data = forms.serialize(this.refs.login_form)
        login(data)
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

    componentDidUpdate() {
        if (this.state.isLoggedIn) {
            if (location.href.indexOf("login") != -1) {
                location.href = "/#/"
            }
        }

        const me = ReactDOM.findDOMNode(this)
        $(me).find(".form-control").change();
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login">
                    <div className="login__block active" id="l-login">
                        <div className="login__block__header">
                            <i className="zmdi zmdi-account-circle"></i>
                            Hi there! Please Sign in

                            <div className="actions actions--inverse login__block__actions">
                                <div className="dropdown">
                                    <i data-toggle="dropdown" className="zmdi zmdi-more-vert actions__item"></i>

                                    <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="/#/register">Create an account</a>
                                        <a className="dropdown-item" href="/#/recover">Forgot password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form action="javascript:" className="lcb-form" onSubmit={this.login.bind(this)} ref="login_form">
                            <div className="login__block__body">
                                <div className="form-group form-group--float form-group--centered">
                                    <input type="email" name="mail" className="form-control" autoComplete="username"/>
                                    <label>Email Address</label>
                                    <i className="form-group__bar"></i>
                                </div>

                                <div className="form-group form-group--float form-group--centered">
                                    <input type="password" name="password" className="form-control" autoComplete="current-password" />
                                    <label>Password</label>
                                    <i className="form-group__bar"></i>
                                </div>

                                <button type="submit" className="btn btn--icon login__block__btn"><i className="zmdi zmdi-long-arrow-right"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}


