import React from "react"


class GlobalLoader extends React.Component {

    render() {
        return (
            <div className="global-loader page-loader" style={{display: "none"}}>
                <div className="page-loader__spinner">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"></circle>
                    </svg>
                </div>
            </div>
        )
    }
}

class Preloader extends React.Component {
    render() {
        return ((this.props.visible || true) ?
            <div className="page-loader__spinner">
                <svg viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"></circle>
                </svg>
            </div>
            :
            null
        )
    }
}

class UnobtrusiveLoader extends React.Component {

    render() {
        return (
            <div className="unobtrusive-loader" style={{display: "none"}}>
                <div className="page-loader__spinner">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"></circle>
                    </svg>
                </div>
            </div>
        )
    }
}

exports.GlobalLoader = GlobalLoader;
exports.Preloader = Preloader;
exports.UnobtrusiveLoader = UnobtrusiveLoader;