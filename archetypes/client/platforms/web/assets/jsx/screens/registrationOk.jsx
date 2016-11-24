"use strict";

define("screens/login", (module, exports) => {

    const SessionStore = require("../stores").session
    const { FullScreenLayout, Screen } = require("../components/layout")
    const ui = require("../utils/ui")
    const { login } = require("../actions")
    const forms = require("../utils/forms")
    const { Preloader } = require("../components/loader")

    class RegistrationOk extends Screen {

        continue() {
            ui.navigate("/")
        }

        render() {
            return (
                <FullScreenLayout>
                    <div className="login-content">
                        <div className="lc-block toggled" id="l-login">
                            <div className="text-center m-b-10"><img src="resources/images/logo.png" /></div>

                            <div class="jumbotron">
                                <h1>Congratulations!</h1>
                                <p>Registration complete. Please confirm your email before login</p>
                                <p><a class="btn btn-primary btn-lg waves-effect" href="javascript:;" onClick={this.continue.bind(this)} role="button">Continue</a></p>
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

    module.exports = Login;

})