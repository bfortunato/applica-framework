"use strict";

define("screens/registrationOk", (module, exports) => {

    const AccountStore = require("../stores").account
    const { FullScreenLayout, Screen } = require("../components/layout")
    const ui = require("../utils/ui")
    const { login } = require("../actions")
    const forms = require("../utils/forms")
    const { Preloader } = require("../components/loader")
    const { connect } = require("../utils/aj")
    const strings = require("../strings")


    class RegistrationOk extends Screen {

        constructor(props) {
            super(props)

            connect(this, AccountStore)
        }

        goHome() {
            ui.navigate("/")
        }

        render() {
            return (
                <FullScreenLayout>
                    <div className="login-content">
                        <div className="lc-block toggled" id="l-login">
                            <div className="text-center m-b-10"><img src="resources/images/logo.png" /></div>

                            <div className="jumbotron">
                                <h1>{strings.congratulations}!</h1>
                                <p>{this.state.welcomeMessage}</p>
                                <p><a className="btn btn-primary btn-lg waves-effect" href="javascript:;" onClick={this.goHome.bind(this)} role="button">Continue</a></p>
                            </div>

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

    module.exports = RegistrationOk;

})