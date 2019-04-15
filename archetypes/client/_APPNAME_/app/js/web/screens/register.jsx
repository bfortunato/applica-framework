import React from "react";
import ReactDOM from "react-dom";
import {AccountStore} from "../../stores/account";
import M from "../../strings";
import {connect} from "../utils/aj";
import {FullScreenLayout, Screen} from "../components/layout";
import * as ui from "../utils/ui";
import {register} from "../../actions/account";
import * as forms from "../utils/forms";

export default class Register extends Screen {
    constructor(props) {
        super(props)

        connect(this, AccountStore)
    }

    register() {
        let data = forms.serialize(this.refs.register_form)
        register(data)
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
        if (state.registered) {
            ui.navigate("/registrationComplete")
        }
    }

    render() {
        return (
            <FullScreenLayout>
                <div className="login">
                    <div className="login__block active">
                        <div className="login__block__header palette-Blue bg">
                            <i className="zmdi zmdi-account-circle"></i>
                            Create an account

                            <div className="actions actions--inverse login__block__actions">
                                <div className="dropdown">
                                    <i data-toggle="dropdown" className="zmdi zmdi-more-vert actions__item"></i>

                                    <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="/#/login">Already have an account?</a>
                                        <a className="dropdown-item" href="/#/recover">Forgot password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form action="javascript:;" className="lcb-form" onSubmit={this.register.bind(this)} ref="register_form">
                            <div className="login__block__body">
                                <div className="form-group form-group--float form-group--centered">
                                    <input type="text" name="name" className="form-control" />
                                    <label>Name</label>
                                    <i className="form-group__bar"></i>
                                </div>

                                <div className="form-group form-group--float form-group--centered">
                                    <input type="email" name="mail" className="form-control" />
                                    <label>Email Address</label>
                                    <i className="form-group__bar"></i>
                                </div>

                                <div className="form-group form-group--float form-group--centered">
                                    <input type="password" name="password" className="form-control" />
                                    <label>Password</label>
                                    <i className="form-group__bar"></i>
                                </div>

                                <div className="checkbox">
                                    <input type="checkbox" id="accept" />
                                    <label className="checkbox__label" htmlFor="accept">Accept the license agreement</label>
                                </div>

                                <button type="submit" className="btn btn--icon login__block__btn"><i className="zmdi zmdi-check"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}

