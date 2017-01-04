"use strict"

import Login from "../screens/login"
import {SessionStore} from "../../stores"
import {connect} from "../utils/aj"

class Secure extends React.Component {

    constructor(props) {
        super(props)

        connect(this, SessionStore)
    }

    render() {
        return (
            (this.state.isLoggedIn ?
                this.props.children
                    :
                <Login />
            )
        )
    }

}

module.exports = Secure
