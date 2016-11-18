"use strict"

import { home as HomeStore } from "stores"
import { getMessage } from "actions"

define("components/index", (module, exports) => {
    
     class Index extends React.Component {
        constructor(props) {
            super(props)
            
            this.state = {}
        }

        componentDidMount() {
            HomeStore.subscribe(this, state => {
                this.setState(state);
            })

            getMessage()
        }

        componentWillUnmount() {
            HomeStore.unsubscribe(this);
        }
        
        render() {
            return (
                <div>
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

                    <section id="main">
                        <aside id="sidebar" className="sidebar c-overflow">
                            <div className="s-profile">
                                <a href="" data-ma-action="profile-menu-toggle">
                                    <div className="sp-pic">
                                        <img src="theme/img/demo/profile-pics/1.jpg" alt="" />
                                    </div>

                                    <div className="sp-info">
                                        Malinda Hollaway

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
                                        <a href=""><i className="zmdi zmdi-time-restore"></i> Logout</a>
                                    </li>
                                </ul>
                            </div>

                            <ul className="main-menu">
                                <li className="active"><a href="index.html"><i className="zmdi zmdi-home"></i> Home</a></li>
                                <li><a href="typography.html"><i className="zmdi zmdi-format-underlined"></i> Typography</a></li>
                                <li><a href="tables.html"><i className="zmdi zmdi-view-list"></i> Tables</a></li>
                                <li><a href="form-elements.html"><i className="zmdi zmdi-collection-text"></i> Form Elements</a></li>
                                <li><a href="buttons.html"><i className="zmdi zmdi-crop-16-9"></i> Buttons</a></li>
                                <li><a href="icons.html"><i className="zmdi zmdi-airplane"></i>Icons</a></li>
                                <li className="sub-menu">
                                    <a href="" data-ma-action="submenu-toggle"><i className="zmdi zmdi-collection-item"></i> Sample Pages</a>
                                    <ul>
                                        <li><a href="login.html">Login and Sign Up</a></li>
                                        <li><a href="lockscreen.html">Lockscreen</a></li>
                                        <li><a href="404.html">Error 404</a></li>
                                    </ul>
                                </li>
                                <li className="sub-menu">
                                    <a href="" data-ma-action="submenu-toggle"><i className="zmdi zmdi-menu"></i> 3 Level Menu</a>

                                    <ul>
                                        <li><a href="form-elements.html">Level 2 link</a></li>
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

                        <section id="content">
                            <div className="container">
                                <div className="card">
                                    <div className="card-body card-padding text-center">
                                        <h4>{this.state.message}</h4>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>

                    <footer id="footer">
                        Copyright &copy; 2016 Applica srl

                        <ul className="f-menu">
                            <li><a href="">Home</a></li>
                            <li><a href="">Dashboard</a></li>
                            <li><a href="">Reports</a></li>
                            <li><a href="">Support</a></li>
                            <li><a href="">Contact</a></li>
                        </ul>
                    </footer>
                </div>
            )
        }
    }

    exports.Index = Index
    
});