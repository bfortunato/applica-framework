define(["framework/core"], function(core) {
    var exports = {};
    var utils = core.utils;

    var Navigation = core.AObject.extend({
        ctor: function(secret) {
            if (secret != 12345) throw "Navigation is a singleton. Please use ui.Navigation.instance()";

            this.controller = null;
            this.controllers = {};
            this.instances = {};
            this.lastLocation = "";
        },

        registerController: function(key, controllerBuilder, mode) {
            var self = this;
            if (mode == "singleton") {
                this.controllers[key] = function() {
                    if (!self.instances[key]) {
                        self.instances[key] = controllerBuilder();
                    }
                    return self.instances[key];
                };
            } else {
                this.controllers[key] = controllerBuilder;
            }
        },

        registerHandler: function(key) {
            console.log("registerHandler is deprecated: " + key);
        },

        navigate: function(controller, action, params) {
            location.href = this.navigateUrl(controller, action, params);
        },

        navigateUrl: function(controller, action, params) {
            action = action || "index";
            var paramsString = "";
            var paramsArray = [];
            if (params) {

                for(var key in params) {
                    var value = params[key];
                    if (value != null && value != undefined) {
                        paramsArray.push(utils.format("{0}={1}", key, value));
                    }
                }

                if (paramsArray.length > 0) {
                    paramsString = "?" + paramsArray.join("&");
                }
            }

            var url = utils.format("{0}#/{1}/{2}{3}", BASE, controller, action, paramsString);
            return url;
        },

        start: function() {
            window.setTimeout(utils.callback(this, function() {
                if (this.lastLocation != location.href) {
                    this.lastLocation = location.href;

                    var split = location.href.split("#");
                    if (split.length > 1) {
                        var data = this.parseNavigationString(split[1]);
                        if (data.controller) {
                            var controllerBuilder = this.controllers[data.controller];
                            if ($.isFunction(controllerBuilder)) {
                                if (this.controller) {
                                    if ($.isFunction(this.controller.dispose)) {
                                        this.controller.dispose();
                                    }
                                }
                                this.controller = controllerBuilder();
                                var action = this.controller[data.action];
                                if ($.isFunction(action)) {
                                    var view = action.call(this.controller, data.params);
                                    if (view) {
                                        if ($.isFunction(view.show)) {
                                            view.show();
                                            var container = view.get("container");
                                            container.addClass("fadeIn");
                                            window.setTimeout(function() { container.removeClass("fadeIn"); }, 1000);
                                        }
                                    }

                                    //select menu voice
                                    if (location.href.indexOf("#") != -1) {
                                        var menu = ".framework-navigation[href='#" + location.href.split("#")[1] + "']"
                                        $(".framework-navigation").each(function() {
                                            $(this).parent().removeClass("active");
                                        });
                                        $(menu).parent().addClass("active");
                                    }

                                }
                            }
                        }
                    }
                }
                this.start();
            }), 250);
        },

        parseNavigationString: function(navigationString) {
            var out = { controller: null, action: null, params: {}};

            if (navigationString.indexOf("/") == 0) {
                var split = navigationString.split("?");
                var route = split[0].split("/");
                var paramsString = null;
                if (split.length > 1) {
                    paramsString = split[1];
                }

                var controller = route[1];
                var action = "index";
                if (route.length > 2) {
                    action = route[2];
                }

                out.controller = controller;
                out.action = action;

                if (paramsString) {
                    var params = paramsString.split("&");
                    for(var i = 0; i < params.length; i++) {
                        var split = params[i].split("=");
                        out.params[decodeURI(split[0])] = decodeURI(split[1]);
                    }
                }
                
                var pathVariables = 0;
                if (route.length > 3) {
                    for (var i = 3; i < route.length; i++) {
                        pathVariables++;
                        out.params["_" + pathVariables] = decodeURI(route[i]);
                    }
                }
            }

            return out;
        }
    });


    Navigation.__instance = null;
    Navigation.instance = function() {
        if (!Navigation.__instance) {
            Navigation.__instance = new Navigation(12345);
        }

        return Navigation.__instance;
    };

    var CommandsManager = core.AObject.extend({
        ctor: function (code) {
            if (code != 12345) {
                throw "CommandsManager is singleton. Use instance() method";
            }

            this.commands = {};
        },

        register: function(commandName, command) {
            this.commands[commandName] = command;
        },

        execute: function(commandName, context) {
            var fn = this.commands[commandName];
            if ($.isFunction(fn)) {
                if (context) {
                    fn.apply(context);
                } else {
                    fn();
                }
            } else {
                throw commandName + " not registered as function in CommandsManager";
            }
        }
    });

    CommandsManager.__instance = null;
    CommandsManager.instance = function () {
        if (!CommandsManager.__instance) {
            CommandsManager.__instance = new CommandsManager(12345);
        }

        return CommandsManager.__instance;
    };

    var EventsManager = core.AObject.extend({
        ctor: function (code) {
            if (code != 12345) {
                throw "EventsManager is singleton. Use instance() method";
            }

            this.url = null;
        },

        start: function(url) {
            this.url = url;
        }
    });

    EventsManager.__instance = null;
    EventsManager.instance = function () {
        if (!EventsManager.__instance) {
            EventsManager.__instance = new EventsManager(12345);
        }

        return EventsManager.__instance;
    };


    exports.CommandsManager = CommandsManager;
    exports.EventsManager = EventsManager;
    exports.Navigation = Navigation;

    return exports;
});