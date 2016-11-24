"use strict";

define("screens/register", (module, exports) => {

    const AccountStore = require("../stores").account
    const { FullScreenLayout, Screen } = require("../components/layout")
    const ui = require("../utils/ui")
    const { register } = require("../actions")
    const forms = require("../utils/forms")

    class Register extends Screen {
        constructor(props) {
            super(props)

            connect(this, AccountStore)
        }

        register() {
            let data = forms.serialize(this.refs.register_form)
            register(data)
        }

        setState(state) {
            if (state.registered) {
                ui.navigate("/registrationComplete")
            } else {
                super.setState(state)
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
                                        <input type="text" name="name" className="form-control" placeholder="Name" />
                                    </div>
                                </div>

                                <div className="input-group m-b-20">
                                    <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                                    <div className="fg-line">
                                        <input type="email" name="mail" className="form-control" placeholder="Email Address" />
                                    </div>
                                </div>

                                <div className="input-group m-b-20">
                                    <span className="input-group-addon"><i className="zmdi zmdi-male"></i></span>
                                    <div className="fg-line">
                                        <input type="password" name="password" className="form-control" placeholder="Password" />
                                    </div>
                                </div>

                                <a href="" className="btn btn-login btn-success btn-float"><i className="zmdi zmdi-check"></i></a>
                            </form>

                            <div className="lcb-navigation">
                                <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                                <a href="#recover" data-ma-block="#l-forget-password"><i>?</i> <span>Forgot Password</span></a>
                            </div>
                        </div>
                    </div>
                </FullScreenLayout>
            )
        }

    }

    module.exports = Register

})