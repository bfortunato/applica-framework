define([
    "framework/core",
    "framework/model",
    "framework/plugins",
    "framework/ui"],
    function (fcore, fmodel, plugins, ui) {

        var exports = {};

        var WebPartManager = fcore.AObject.extend({
            ctor: function (code) {
                if (code != 12345) {
                    throw "WebPartManager is singleton. Use instance() method";
                }

                this.webparts = [];
                this.active = null;
                this.lastLocation = null;
            },

            registerWebpart: function (webpart) {
                this.webparts.push(webpart);
            },

            getWebpart: function (id) {
                return fcore.utils.findOne(this.webparts, function (webpart) {
                    return webpart.id == id || webpart.uid == id;
                });
            },

            scan: function () {
                var hasActivators = false;
                var currentActivator = location.href.split("#")[1];

                //scan for webpart loaders
                $("[data-component=webpart_loader]").each(function (i, loader) {
                    var id = $(loader).attr("data-webpart-id");
                    var url = $(loader).attr("data-webpart-url");
                    var container = $(loader).attr("data-webpart-container");
                    var autoload = $(loader).attr("data-webpart-autoload") == "true";
                    var loadCommand = $(loader).attr("data-webpart-onload");
                    var activator = $(loader).attr("data-webpart-activator");
                    var sendUid = $(loader).attr("data-webpart-send-uid") == "true";

                    if(activator) {
                        hasActivators = true;
                    }

                    var webpart = new WebPart(id);
                    webpart.set("url", url);
                    webpart.set("container", $(container));
                    webpart.set("activator", activator);
                    webpart.set("sendUid", sendUid);

                    if(loadCommand) {
                        webpart.on("load", function() {
                            ui.CommandsManager.instance().execute(loadCommand, this);
                        });
                    }

                    WebPartManager.instance().registerWebpart(webpart);

                    if (autoload) {
                        if(activator) {
                            if(!currentActivator) {
                                location.href = location.href.split("#")[0] + "#" + activator;
                            }
                        } else {
                            webpart.load();
                        }

                    }

                    if(!activator) {
                        $(loader).click(function () {
                            var id = $(this).attr("data-webpart-id");
                            var webpart = WebPartManager.instance().getWebpart(id);
                            if (webpart) {
                                webpart.load();
                            }
                        });
                    }
                });

                //scan for auto webpart
                $("[data-component='webpart']").each(function(i, container) {
                    var id = $(container).attr("data-webpart-id");
                    var url = $(container).attr("data-webpart-url");

                    var webpart = new WebPart(id);
                    webpart.set("url", url);
                    webpart.set("container", $(container));

                    WebPartManager.instance().registerWebpart(webpart);

                    webpart.load();
                });

                if(hasActivators) {
                    this.activate();
                }
            },

            activate: function() {
                window.setTimeout(fcore.utils.callback(this, function() {
                    if(this.lastLocation != location.href) {
                        this.lastLocation = location.href;

                        var split = location.href.split("#");
                        if(split.length > 1) {
                            var activator = split[1];

                            var webpart = fcore.utils.findOne(this.webparts, function(w) {
                                return w.get("activator") == activator;
                            });

                            if(webpart) {
                                webpart.load();
                            }
                        }
                    }
                    this.activate();
                }), 250);
            }
        });

        WebPartManager.__instance = null;
        WebPartManager.instance = function () {
            if (!WebPartManager.__instance) {
                WebPartManager.__instance = new WebPartManager(12345);
            }

            return WebPartManager.__instance;
        };

        var WebPart = fcore.AObject.extend({
            ctor: function (id) {
                WebPart.super.ctor.call(this);

                this.id = id;
                this.uid = null;
                this.url = null;
                this.container = null;
                this.data = {};
                this.clear = true;
                this.values = {};
                this.activator = null;
                this.cached = false;
                this.lastResponse = null;
                this.sendUid = false;
            },

            load: function () {
                $.loader.show({ parent: this.container })




                if(this.lastResponse && this.cached) {
                    this.onServiceLoad(this.lastResponse);
                    return;
                }

                var self = this;
                var service = new WebPartService();
                service.set("method", "GET");
                service.set("url", this.url);

                if(this.sendUid) {
                    if(!this.data) {
                        this.data = {};
                    }
                    this.uid = fcore.utils.GUID();
                    this.data["webpartUid"] = this.uid;
                }

                service.set("data", this.data);

                service.on({
                    error: function (error) {
                        self.onServiceError(error);
                    },
                    load: function (data) {
                        self.lastResponse = data;
                        self.onServiceLoad(data);
                    }
                });

                service.load();
            },

            invalidate: function() {
                this.lastResponse = null;
            },

            onServiceError: function(error) {
                var self = this;
                $.loader.hide({ parent: self.container })
                $.notify.error(error);

                self.invoke("error", error);
            },

            onServiceLoad: function(response) {
                var self = this;
                $.loader.hide({ parent: self.container })

                $(self.container).attr("data-webpart-uid", self.uid);

                if(self.clear) {
                    $(self.container).empty();
                    $(self.container).html(response);
                } else {
                    var d = _E("div").html(response);
                    $(self.container).append(d);
                }


                //check for values;
                var valuesJson = $(self.container).find("input.webpart-values[type='hidden']").val();
                if(valuesJson) {
                    try {
                        self.values = $.parseJSON(valuesJson);
                    } catch(error) {
                        self.values = {};
                    }
                    $(self.container).find("input.webpart-values[type='hidden']").remove();
                }

                self.invoke("load");
                self.callback("load");
            }
        });

        var ModalWebPart = fcore.AObject.extend({
            ctor: function(webpart) {
                ModalWebPart.super.ctor.call(this);

                if((this.container = $("body .modal-webparts-container")).size() == 0) {
                    this.container = _E("div").addClass("modal-webparts-container hide").appendTo("body");
                }

                this.element = null;
                this.options = {};
                this.opening = false;

                if(webpart) {
                    this.set("webpart", webpart);
                }
            },

            set_webpart: function(webpart) {
                var self = this;

                this.webpart = webpart;
                this.webpart.on("load", function() {
                    self.loaded = true;
                    if(self.opening) {
                        self.createDialog();
                    }
                    self.opening = false;
                })
            },

            createDialog: function() {
                var self = this;

                self.options = $.extend(self.options, {
                    destroyOnClose: true,
                    autoOpen: true,
                    close: function() { self.onClose(); }
                });

                $(self.element).modalDialog(self.options);
            },

            load: function() {
                if(!this.webpart) {
                    throw "Webpart not specified";
                }



                this.opening = true;

                this.webpart.load();
            },

            onClose: function() {
                this.invoke("close");
            },

            open: function() {
                this.element = _E("div");
                $(this.element).appendTo(this.container);
                this.webpart.set("container", this.element);

                this.load();
            },

            close: function() {

                $(this.element).modalDialog("close");
            }
        });


        var WebPartService = fmodel.AjaxService.extend({
            ctor: function() {
                WebPartService.super.ctor.call(this);

                this.set("contentType", null);
                this.set("dataType", null);
            },

            onSuccess: function(response) {
                this.invoke("load", response);
            }
        });


        exports.WebPartManager = WebPartManager;
        exports.WebPart = WebPart;
        exports.WebPartService = WebPartService;
        exports.ModalWebPart = ModalWebPart;

        return exports;

    });