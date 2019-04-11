"use strict"

import {MenuStore} from "../../stores/menu";
import {SessionStore} from "../../stores/session";
import {UIStore} from "../../stores/ui";
import {expandMenuItem, setActiveMenuItem} from "../../actions/menu";
import {logout} from "../../actions/session";
import * as ui from "../utils/ui";
import {GlobalLoader, PageLoader, UnobtrusiveLoader} from "./loader";
import {connect} from "../utils/aj";
import {optional, parseBoolean} from "../../utils/lang";
import M from "../../strings";
import _ from "../../libs/underscore"
import {SystemStore} from "../../stores/system";
import {systemInformation} from "../../actions/system";

function showPageLoader() {
    $(".page-loader").show()
}

function hidePageLoader() {
    $(".page-loader").fadeOut(500)
}

class Header extends React.Component {
    render() {
        return (
            <header id="header" className="header clearfix">
                <div className="navigation-trigger hidden-xl-up" data-ma-action="aside-open" data-ma-target=".sidebar">
                    <div className="navigation-trigger__inner">
                        <i className="navigation-trigger__line"></i>
                        <i className="navigation-trigger__line"></i>
                        <i className="navigation-trigger__line"></i>
                    </div>
                </div>

                <div className="header__logo hidden-sm-down">
                    <h1><a href="index.html">{M("appName")}</a></h1>
                </div>
            </header>
        )
    }
}

class ProfileBox extends React.Component {

    constructor(props) {
        super(props)

        connect(this, [SessionStore, UIStore])

        this.state = {}
    }

    logout() {
        logout()
        ui.navigate("/login")
    }

    render() {
        return (
            <div className="user">
                <div className="user__info" data-toggle="dropdown">
                        {this.state.profileImage ?
                            <img className="user__img" src={this.state.profileImage} alt="" />
                            :
                            <img className="user__img" src="theme/img/demo/profile-pics/1.jpg" alt="" />
                        }
                    <img className="user__img" src="demo/img/profile-pics/8.jpg" alt="" />
                    <div>
                        <div className="user__name">{optional(() => this.state.user.name, "NA")}</div>
                        <div className="user__email">{optional(() => this.state.user.mail, "NA")}</div>
                    </div>
                </div>

                <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">View Profile</a>
                    <a className="dropdown-item" href="#">Settings</a>
                    <a className="dropdown-item" href="#" onClick={this.logout.bind(this)}><i className="zmdi zmdi-time-restore"></i> Logout</a>
                </div>
            </div>
        )
    }
}

class MenuLevel extends React.Component {
    onSelect(item) {
        if (item.href) {
            location.href = item.href
        }

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(item)
        }

        let hasChildren = !_.isEmpty(item.children)
        if (hasChildren) {
            this.onExpand(item)
        }
    }

    onExpand(item) {
        if (_.isFunction(this.props.onExpand)) {
            this.props.onExpand(item)
        }
    }

    render() {
        let menu = optional(this.props.menu, [])
        let isMainMenu = optional(parseBoolean(this.props.isMainMenu), false)

        let key = 1
        let items = menu.map(i => {
            let className = ""
            if (i.active) { className += "active" }
            let hasChildren = !_.isEmpty(i.children)
            if (hasChildren) { className += " navigation__sub" }
            if (i.expanded) { className += " toggled" }

            return (
                <li key={key++} className={className}>
                    <a href="javascript:;" onClick={this.onSelect.bind(this, i)} data-ma-action={hasChildren ? "submenu-toggle" : undefined} >
                        <i className={i.icon}></i> {i.text}
                    </a>

                    {hasChildren &&
                        <MenuLevel parent={i} menu={i.children} onExpand={this.onExpand.bind(this, i)} onSelect={this.onSelect.bind(this)} />
                    }
                </li>
            )
        })

        let expanded = !isMainMenu && this.props.parent.expanded === true
        let style = {}
        if (expanded) {
            style.display = "block"
        }
        let className = ""
        if (isMainMenu) {
            className += "navigation"
        } else {
            className = "navigation__sub"
        }

        return (
            <ul className={className} style={style}>
                {items}
            </ul>
        )
    }
}

class MainMenu extends React.Component {
    onExpand(item) {
        if (_.isFunction(this.props.onExpand)) {
            this.props.onExpand(item)
        }
    }

    onSelect(item) {
        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(item)
        }
    }


    render() {
        let menu = this.props.menu

        return (
            <MenuLevel menu={menu} isMainMenu="true" onExpand={this.onExpand.bind(this)} onSelect={this.onSelect.bind(this)}/>
        )
    }
}

class SideBar extends React.Component {
    render() {
        return (
            <aside id="sidebar" className="sidebar">
                <div className="scrollbar-inner">
                    <ProfileBox />
                    <MainMenuContainer />
                </div>
            </aside>
        )
    }
}

class MainMenuContainer extends React.Component {
    constructor(props) {
        super(props)

        connect(this, MenuStore, {menu: []})

        logger.i("Menu created")
    }

    onSelect(item) {
        setActiveMenuItem({item})
    }

    onExpand(item) {
        expandMenuItem({item})
    }

    render() {
        return <MainMenu menu={this.state.menu} onExpand={this.onExpand.bind(this)} onSelect={this.onSelect.bind(this)} />
    }
}


class Footer extends React.Component {

    constructor(props) {
        super(props)
        connect(this, SystemStore, {})
    }

    componentDidMount() {
        systemInformation()
    }

    render() {
        let backendVersion = this.state.backendVersion;
        let apiVersion = this.state.apiVersion;
        let copyrightInfos = this.state.copyrightInfos;

        return (
            <footer className="footer hidden-xs-down">
                <ul className="nav footer__nav">
                    {backendVersion && <li> Web: v {backendVersion}</li> }
                    {apiVersion && <li> API: v {apiVersion}</li>}
                    {copyrightInfos && <li> Copyright: {copyrightInfos}</li>}
                </ul>
            </footer>
        )
    }
}

class Layout extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <SideBar/>

                <section className="content">
                    {this.props.children}
                </section>

                <Footer />
            </div>
        )
    }
}


class FullScreenLayout extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}


class ScreenContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentScreen: null
        }
    }

    componentDidMount() {
        ui.addScreenChangeListener(screen => {
            //showPageLoader()
            this.setState(_.assign(this.state, {currentScreen: screen}))
            //hidePageLoader()
        })
    }

    render() {
        if (_.isEmpty(this.state.currentScreen)) {
            return <div />
        }
        return this.state.currentScreen
    }
}


class Screen extends React.Component {

}


class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div>
                <PageLoader />
                <GlobalLoader />
                <UnobtrusiveLoader />
                <ScreenContainer />
            </div>
        )
    }
}

exports.Index = Index
exports.Screen = Screen
exports.FullScreenLayout = FullScreenLayout
exports.Layout = Layout
exports.Header = Header
exports.Footer = Footer
