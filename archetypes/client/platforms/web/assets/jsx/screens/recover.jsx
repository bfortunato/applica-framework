"use strict";

define("screens/recover", (module, exports) => {

    const { FullScreenLayout, Screen } = require("../components/layout");
    const ui = require("../utils/ui");

    class Recover extends Screen {
        constructor(props) {
            super(props)
        }

        recover() {
            ui.navigate("/");
        }

        render() {
            return (
                <FullScreenLayout>
                    <div className="login-content">
                        <div className="lc-block toggled" id="l-forget-password">
                            <div className="lcb-form">
                                <p className="text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu risus. Curabitur commodo lorem fringilla enim feugiat commodo sed ac lacus.</p>

                                <div className="fg-line">
                                    <input type="text" className="form-control" placeholder="Email Address" />
                                </div>

                                <a href="" className="btn btn-login btn-success"><i className="zmdi zmdi-check"></i></a>
                            </div>

                            <div className="lcb-navigation">
                                <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                                <a href="" data-ma-action="login-switch" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>Register</span></a>
                            </div>
                        </div>
                    </div>
                </FullScreenLayout>
            )
        }

    }

    module.exports = Recover;

})