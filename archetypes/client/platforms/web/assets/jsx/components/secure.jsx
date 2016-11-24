"use strict"

define("components/secure", (module, exports) => {

    const Login = require("../screens/login")
    const SessionStore = require("../stores").session
    const { connect } = require("../utils/aj")

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


})