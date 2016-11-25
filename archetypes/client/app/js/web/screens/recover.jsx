"use strict";

const { FullScreenLayout, Screen } = require("../components/layout");
const ui = require("../utils/ui");
const forms = require("../utils/forms");

export default class Recover extends Screen {
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
                        <form action="javascript:;" className="lcb-form" onSubmit={this.recover.bind(this)} ref="recover_form">
                            <p className="text-left">Please insert your email address to recover password. We will send a new password in your mailbox!</p>

                            <div className="input-group m-b-20">
                                <span className="input-group-addon"><i className="zmdi zmdi-email"></i></span>
                                <div className="fg-line">
                                    <input type="email" name="mail" className="form-control" placeholder="Email Address" />
                                </div>
                            </div>

                            <a href="javascript:;" className="btn btn-login btn-success btn-float"><i className="zmdi zmdi-check"></i></a>
                        </form>

                        <div className="lcb-navigation">
                            <a href="#login" data-ma-block="#l-login"><i className="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                            <a href="#register" data-ma-block="#l-register"><i className="zmdi zmdi-plus"></i> <span>Register</span></a>
                        </div>
                    </div>
                </div>
            </FullScreenLayout>
        )
    }

}


