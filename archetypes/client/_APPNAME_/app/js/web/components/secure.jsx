"use strict"

import Login from "../screens/login"
import {connect} from "../utils/aj"
import ChangePassword from "../screens/changePassword";
import {SessionStore} from "../../stores/session";

class Secure extends React.Component {

    constructor(props) {
        super(props)

        connect(this, SessionStore)
    }

    render() {
        let toPrint = this.props.children;
        if (this.state.isLoggedIn && this.state.user && this.state.user.firstLogin) {
            toPrint =  <ChangePassword/>
        } else if (!this.state.isLoggedIn)  {
            toPrint =  <Login/>
        }
        return (
            (
                toPrint
            )
        )
    }

}

module.exports = Secure
