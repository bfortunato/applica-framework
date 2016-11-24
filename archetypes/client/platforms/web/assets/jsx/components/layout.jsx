"use strict"

define("components/layout", (module, exports) => {

    const SessionStore = require("../stores").session
    const { logout } = require("../actions")
    const ui = require("../utils/ui")
    const { PageLoader, GlobalLoader } = require("./loader")
    const { connect } = require("../utils/aj")

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
                            {this.state.user.name}

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

    class SideBar extends React.Component {
        render() {
            return (
                <aside id="sidebar" className="sidebar c-overflow">
                    <ProfileBox />

                    <ul className="main-menu">
                        <li className="active"><a href="index.html"><i className="zmdi zmdi-home"></i> Home</a></li>
                        <li><a href="theme/typography.html"><i className="zmdi zmdi-format-underlined"></i> Typography</a></li>
                        <li><a href="theme/tables.html"><i className="zmdi zmdi-view-list"></i> Tables</a></li>
                        <li><a href="theme/form-elements.html"><i className="zmdi zmdi-collection-text"></i> Form Elements</a></li>
                        <li><a href="theme/buttons.html"><i className="zmdi zmdi-crop-16-9"></i> Buttons</a></li>
                        <li><a href="theme/icons.html"><i className="zmdi zmdi-airplane"></i>Icons</a></li>
                        <li className="sub-menu">
                            <a href="" data-ma-action="submenu-toggle"><i className="zmdi zmdi-collection-item"></i> Sample Pages</a>
                            <ul>
                                <li><a href="theme/login.html">Login and Sign Up</a></li>
                                <li><a href="theme/lockscreen.html">Lockscreen</a></li>
                                <li><a href="theme/404.html">Error 404</a></li>
                            </ul>
                        </li>
                        <li className="sub-menu">
                            <a href="" data-ma-action="submenu-toggle"><i className="zmdi zmdi-menu"></i> 3 Level Menu</a>

                            <ul>
                                <li><a href="theme/form-elements.html">Level 2 link</a></li>
                                <li className="sub-menu">
                                    <a href="" data-ma-action="submenu-toggle">I have children too</a>

                                    <ul>
                                        <li><a href="">Level 3 link</a></li>
                                        <li><a href="">Another Level 3 link</a></li>
                                        <li><a href="">Third one</a></li>
                                    </ul>
                                </li>
                                <li><a href="">One more 2</a></li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            )
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
})