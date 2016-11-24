"use strict"

define("components/secure", (module, exports) => {

    const Login = require("../screens/login")
    const SessionStore = require("../stores").session

    class Secure extends React.Component {

        constructor(props) {
            super(props)

            this.state = SessionStore.state || {}
        }

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