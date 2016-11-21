"use strict";

define("screens/register", (module, exports) => {

    const { FullScreenLayout, Screen } = require("../components/layout");
    const ui = require("../utils/ui");

    class Register extends Screen {
        constructor(props) {
            super(props)
        }

        register() {
            ui.navigate("/");
        }

        render() {
            return (
                <FullScreenLayout>
                    <div className="login-content">
                        <div className="lc-block toggled" id="l-register">
                            <div className="lcb-form">
                                <div className="form-group">
                                    <div className="fg-line">
                                        <input type="text" className="form-control" placeholder="Username" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="fg-line">
                                        <input type="text" className="form-control" placeholder="Email Address" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="fg-line">
                                        <input type="password" className="form-control" placeholder="Password" />
                                    </div>
                                </div>

                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" value="" />
                                            <i className="input-helper"></i>
                                            Terms and Condition
                                    </label>
                                </div>

                                <a href="" className="btn btn-login btn-success"><i className="zmdi zmdi-check"></i></a>
                            </div>

                            <div className="lcb-navigation">
                                <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                                <a href="" data-ma-action="login-switch" data-ma-block="#l-forget-password"><i>?</i> <span>Forgot Password</span></a>
                            </div>
                        </div>
                    </div>
                </FullScreenLayout>
            )
        }

    }

    module.exports = Register;

})