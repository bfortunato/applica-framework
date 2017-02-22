"use strict"

export function hidePageLoader() {
    $(".page-loader").fadeOut(500)
}

class PageLoader extends React.Component {

    componentDidUpdate() {
        if (this.state.loading) {
            $(this.refs.page_loader).show()
        } else {
            $(this.refs.page_loader).fadeOut(500);
        }
    }

    render() {
        return (
            <div className="page-loader" style={{display: "block"}}>
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
            <div className="global-loader" style={{display: "none"}}>
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

