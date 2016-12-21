"use strict"

import {session as SessionStore, menu as MenuStore} from "../../stores"
import {logout, setActiveMenuItem} from "../../actions"
import * as ui from "../utils/ui"
import {PageLoader, GlobalLoader} from "./loader"
import {connect} from "../utils/aj"
import {optional, parseBoolean} from "../../utils/lang"

function showPageLoader() {
    $(".page-loader").show()
}

function hidePageLoader() {
    $(".page-loader").fadeOut(500)
}

class Header extends React.Component {
    render() {
        return (
            <header id="header" className="clearfix" data-ma-theme="blue">
                <ul className="h-inner">
                    <li className="hi-trigger ma-trigger" data-ma-action="sidebar-open" data-ma-target="#sidebar">
                        <div className="line-wrap">
                            <div className="line top"></div>
                            <div className="line center"></div>
                            <div className="line bottom"></div>
                        </div>
                    </li>

                    <li className="hi-logo hidden-xs">
                        <a href="index.html">_APPNAME_</a>
                    </li>

                    <li className="pull-right">
                        <ul className="hi-menu">

                            <li data-ma-action="search-open">
                                <a href=""><i className="him-icon zmdi zmdi-search"></i></a>
                            </li>

                            <li className="dropdown">
                                <a data-toggle="dropdown" href=""><i className="him-icon zmdi zmdi-more-vert"></i></a>
                                <ul className="dropdown-menu pull-right">
                                    <li className="hidden-xs">
                                        <a data-ma-action="fullscreen" href="">Toggle Fullscreen</a>
                                    </li>
                                    <li>
                                        <a href="">Privacy Settings</a>
                                    </li>
                                    <li>
                                        <a href="">Other Settings</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>

                <div className="h-search-wrap">
                    <div className="hsw-inner">
                        <i className="hsw-close zmdi zmdi-arrow-left" data-ma-action="search-close"></i>
                        <input type="text" />
                    </div>
                </div>
            </header>
        )
    }
}

class ProfileBox extends React.Component {

    constructor(props) {
        super(props)

        connect(this, SessionStore)
    }

    logout() {
        logout()
        ui.navigate("/login")
    }

    render() {
        return (
            <div className="s-profile">
                <a href="" data-ma-action="profile-menu-toggle">
                    <div className="sp-pic">
                        <img src="theme/img/demo/profile-pics/1.jpg" alt="" />
                    </div>

                    <div className="sp-info">
                        {optional(() => this.state.user.name, "NA")}

                        <i className="zmdi zmdi-caret-down"></i>
                    </div>
                </a>

                <ul className="main-menu">
                    <li>
                        <a href=""><i className="zmdi zmdi-account"></i> View Profile</a>
                    </li>
                    <li>
                        <a href=""><i className="zmdi zmdi-input-antenna"></i> Privacy Settings</a>
                    </li>
                    <li>
                        <a href=""><i className="zmdi zmdi-settings"></i> Settings</a>
                    </li>
                    <li>
                        <a href="javascript:" onClick={this.logout.bind(this)}><i className="zmdi zmdi-time-restore"></i> Logout</a>
                    </li>
                </ul>
            </div>
        )
    }
}

class MenuLevel extends React.Component {
    activate(item) {
        setActiveMenuItem({item})
    }

    render() {
        let menu = optional(this.props.menu, [])
        let isMainMenu = optional(parseBoolean(this.props.isMainMenu), false)

        let key = 1
        let items = menu.map(i => {
            let className = ""
            if (i.active) { className += "active" }
            let hasChildren = !_.isEmpty(i.children)
            if (hasChildren) { className += " sub-menu" }

            return (
                <li key={key++} className={className}>
                    <a href={i.href || "javascript:;"} onClick={this.activate.bind(this, i)} data-ma-action={hasChildren ? "submenu-toggle" : undefined} >
                        <i className={i.icon}></i> {i.text}
                    </a>

                    {hasChildren &&
                        <MenuLevel menu={i.children} />
                    }
                </li>
            )
        })

        return (
            <ul className={isMainMenu ? "main-menu" : undefined}>
                {items}
            </ul>
        )
    }
}

class MainMenu extends React.Component {
    render() {
        let menu = this.props.menu

        return (
            <MenuLevel menu={menu} isMainMenu="true"/>
        )
    }
}

class SideBar extends React.Component {
    render() {
        return (
            <aside id="sidebar" className="sidebar c-overflow">
                <ProfileBox />
                <MainMenuContainer />
            </aside>
        )
    }
}

class MainMenuContainer extends React.Component {
    constructor(props) {
        super(props)

        connect(this, MenuStore, {menu: []})
    }

    render() {
        return <MainMenu menu={this.state.menu} />
    }
}


class Footer extends React.Component {
    render() {
        return (
            <footer id="footer">
                Copyright &copy 2016 Applica srl

                <ul className="f-menu">
                    <li><a href="">Home</a></li>
                    <li><a href="">Dashboard</a></li>
                    <li><a href="">Reports</a></li>
                    <li><a href="">Support</a></li>
                    <li><a href="">Contact</a></li>
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

                <section id="main">
                    <SideBar/>

                    <section id="content">
                        <div className="container">
                            {this.props.children}
                        </div>
                    </section>
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
            showPageLoader()
            this.setState(_.assign(this.state, {currentScreen: screen}))
            hidePageLoader()
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
