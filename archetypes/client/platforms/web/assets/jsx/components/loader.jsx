"use strict"

define("components/loader", (module, exports) => {

    const UiStore = require("../stores").ui;

    class Loader extends React.Component {

        constructor(props) {
            super(props);

            this.state = {
                loading: false
            }
        }

        componentDidMount() {
            UiStore.subscribe(this, state => {
                this.setState(state)
            })
        }

        componentWillUnmount() {
            UiStore.unsubscribe(this);
        }

        render() {
            return (
                (this.state.loading ?
                    <div className="page-loader">
                        <div className="preloader pls-amber">
                            <svg className="pl-circular" viewBox="25 25 50 50">
                                <circle className="plc-path" cx="50" cy="50" r="20" />
                            </svg>

                            <p>Please wait...</p>
                        </div>
                    </div>
                :
                    <div></div>
                )
            )
        }

    }

    module.exports = Loader;

})