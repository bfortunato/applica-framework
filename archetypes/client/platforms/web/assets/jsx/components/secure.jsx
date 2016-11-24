"use strict"

define("components/secureScreen", (module, exports) => {

    const auth = require("../framework/auth")
    const Login = require("../screes/login")
    const { Screen } = require("layout")
    const SessionStore = require("../stores").session;

    class SecureScreen extends Screen {

        componentDidMount() {
            SessionStore.subscribe(this, state => {
                this.setState(state)
            })
        }

        componentWillUnmount() {
            SessionStore.unsubscribe(this)
        }

        render() {
            return (
                (auth.isLoggedIn() ?
                    this.props.children
                        :
                    <Login />
                )
            )
        }

    }


})