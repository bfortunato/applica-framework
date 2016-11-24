"use strict"

define("screens/login", (module, exports) => {

    const { FullScreenLayout, Screen } = require("../components/layout")
    const { login } = require("../actions")
    const forms = require("../utils/forms")

    class Login extends Screen {

        login() {
            let data = forms.serialize(this.refs.login_form)
            login(data)
        }

        render() {
            let loginButtonClass = "animated fadeInLeft"

            return (
                <FullScreenLayout>
                    <div className="login-content">
                        <div className="lc-block toggled" id="l-login">
                            <div className="text-center m-b-10"><img src="resources/images/logo.png" /></div>

                            <form action="javascript:" className="lcb-form" onSubmit={this.login.bind(this)} ref="login_form">
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

                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember_me" value="1" />
                                            <i className="input-helper"></i>
                                            Keep me signed in
                                    </label>
                                </div>

                                <button type="submit" className={"btn btn-login btn-success btn-float " + loginButtonClass}><i className="zmdi zmdi-arrow-forward"></i></button>
                            </form>

                            <div className="lcb-navigation">
                                <a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>Register</span></a>
                                <a href="#recover" data-ma-block="#l-forget-password"><i>?</i> <span>Forgot Password</span></a>
                            </div>
                        </div>
                    </div>
                </FullScreenLayout>
            )
        }

    }

    module.exports = Login

})