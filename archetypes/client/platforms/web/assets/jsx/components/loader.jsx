"use strict"

define("components/loader", (module, exports) => {

    const UiStore = require("../stores").ui;

    class PageLoader extends React.Component {

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

        componentDidUpdate() {
            if (this.state.loading) {
                $(this.refs.page_loader).show()
            } else {
                $(this.refs.page_loader).fadeOut(500);
            }
        }

        componentWillUnmount() {
            UiStore.unsubscribe(this);
        }

        render() {
            return (
                <div className="page-loader" ref="page_loader">
                    <div className="preloader">
                        <svg className="pl-circular" viewBox="25 25 50 50">
                            <circle className="plc-path" cx="50" cy="50" r="20" />
                        </svg>

                        <p>Please wait...</p>
                    </div>
                </div>
            )
        }
    }

    class GlobalLoader extends React.Component {

        render() {
            return (
                <div className="global-loader" ref="page_loader" style={{display: "none"}}>
                    <div className="layer"></div>
                    <div className="preloader">
                        <svg className="pl-circular" viewBox="25 25 50 50">
                            <circle className="plc-path" cx="50" cy="50" r="20" />
                        </svg>
                    </div>

                    <p className="message">Please wait...</p>
                </div>
            )
        }
    }

    class Preloader extends React.Component {
        render() {
            return ((this.props.visible || true) ?
                <div className="preloader">
                    <svg className="pl-circular" viewBox="25 25 50 50">
                        <circle className="plc-path" cx="50" cy="50" r="20" />
                    </svg>
                </div>
                :
                null
            )
        }
    }

    exports.PageLoader = PageLoader;
    exports.GlobalLoader = GlobalLoader;
    exports.Preloader = Preloader;

})