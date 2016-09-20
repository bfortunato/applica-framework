/**
 * Applica (www.applica.guru).
 * User: bimbobruno
 * Date: 2/21/13
 * Time: 1:41 PM
 */

define(["framework/core", "framework/widgets", "framework/ui", "framework/plugins"], function(core, widgets, ui, plugins) {

    var exports = {};

    var View = core.Disposable.extend({
        ctor: function() {
            View.super.ctor.call(this);

            this.container = window.SPA_CONTAINER;
        },

        show: function() {
            $(this.container).empty().text("view");
        }
    });


    var ContentView = View.extend({
        ctor: function() {
            ContentView.super.ctor.apply(this, arguments);
            this.content = null;
            this.container = window.SPA_CONTAINER;
        },

        clear: function() {
            $(this.container).empty();
        },

        show: function() {
            if(this.content != null) {
                $(this.container).empty().append(this.content);
            }
        }

    });

    var RemoteContentView = ContentView.extend({
        ctor: function(service) {
            RemoteContentView.super.ctor.apply(this, arguments);

            var self = this;

            this.service = service;
            this.service.on({
                load: function(response) {
                    self.onServiceLoad(response);
                },

                error: function(error) {
                    self.onServiceError(error);
                }
            });
        },


        onServiceLoad: function(html) {
            $.loader.hide({ parent: this.container });
            this.content = _E("div").html(html);
            this.container.empty().append(this.content);

        },

        onServiceError: function(error) {
            $.loader.hide({ parent: this.container });
            $.notify.error(error);
        },

        show: function() {
            $.loader.show({ parent: this.container });
            this.service.load();
        }
    });

    var AppView = ContentView.extend({
        ctor: function() {
            AppView.super.ctor.apply(this, arguments);
            this.breadcrumbItems = [];
            this.toolbarButtons = [];
            this.rightbarButtons = [];
        },

        createToolbar: function() {
            var buttons = this.getToolbarButtons();

            var $t = $("#toolbar");
            if(!$t.toolbar("isToolbar")) {
                $t.toolbar();
            }

            $t.toolbar("clear");
            var size = buttons.length;
            for(var i = 0; i < size; i++) {
                var button = buttons[i];
                $t.toolbar("add", button);
            }
        },

        createBreadcrumbs: function() {
            var items = this.getBreadcrumbItems();

            var $b = $("#breadcrumbs");
            if(!$b.breadcrumbs("isBreadcrumbs")) {
                $b.breadcrumbs();
            }

            $b.breadcrumbs('clear');
            $b.breadcrumbs('addAll', items);
        },

        setToolbarButtons: function(toolbarButtons) {
            this.toolbarButtons = toolbarButtons;
        },

        getToolbarButtons: function() {
            return this.toolbarButtons;
        },

        getRightbarButtons: function() {
            return this.rightbarButtons;
        },

        setBreadcrumbItems: function(breadcrumbItems) {
            this.breadcrumbItems = breadcrumbItems;
        },

        getBreadcrumbItems: function() {
            return this.breadcrumbItems;
        },

        show: function() {
            ContentView.prototype.show.call(this);

            this.finishAppView();
        },

        finishAppView: function() {
            this.createToolbar();
            this.createBreadcrumbs();
        },

        set_title: function(title) {
            this.title = title;
            $(".page-title").html(title);
        }
    });


    var DialogView = View.extend({
        ctor : function() {
            DialogView.super.ctor.call(this);

            this.options = {};
            this.content = null;
            this.dialogsContainer;
            this.title = null;
            this.width = null;
        },

        show : function() {
            this.showDialog();
        },

        createDialogContent: function() {
            return _E("div").text("dialog content");
        },

        showDialog : function() {
            var self = this;
            if ($.contains(document.documentElement, this.content)) {
                this.dialogsContainer.append(this.content);
            }

            if (this.title) {
                this.options.title = this.title;
            }

            if(this.width){
                this.options.width = this.width;
            }

            this.options.autoOpen = true;
            this.options.destroyOnClose = true;
            this.options.close = function(dialogResult) {
                if(dialogResult == "cancel") {
                    self.invoke("cancel");
                } else {
                    self.invoke("close");
                }
            };

            $(this.content).modalDialog(this.options);
        }
    });

    var FramedView = AppView.extend({
        ctor: function(frameLoader) {
            FramedView.super.ctor.call(this);

            var self = this;

            this.frameLoader = frameLoader;
            this.frameLoader.on({
                content_change: function() {
                    $.loader.hide();
                    self.renderFrame();
                },
                error: function(message) {
                    $.loader.hide();
                    $.notify.error(message);
                }
            });
        },

        setFragment: function(key, element) {
            if(!this.container) throw "Frame element not setted";
            $(this.container).find("[data-fragment=" + key + "]")
                .clear()
                .append(element);
        },

        getFragment: function(key) {
            if(!this.content) throw "Frame element not setted";
            return $(this.container).find("[data-fragment=" + key + "]");
        },

        renderFrame: function() {
            this.content = $(this.frameLoader.get("content"));
            $(this.container).empty().append(this.content);

            this.finishAppView();
            this.initFrame();
        },

        initFrame: function() {},

        show: function() {
            $.loader.show();
            this.frameLoader.load();
        }

    });




    var FormView = ContentView.extend({
        ctor: function(formService) {
            FormView.super.ctor.call(this);

            this.formService = formService;
            this.form  = new widgets.Form();

            this.initializeServiceEvents();
            this.initializeFormEvents();
        },

        initializeFormEvents: function() {
            var self = this;
            this.form.on({
                submit: function(e) {
                    self.submit(e);
                }
            });
        },

        submit: function(e) {
            this.invoke("submit", e);
        },

        initializeServiceEvents: function() {
            var self = this;
            var form = this.form;
            this.formService.on({
                load: function(element) {
                    $.loader.hide();
                    self.form.set("element", element);
                    self.render();

                    self.invoke("load");
                },
                save: function(response) {
                    $.loader.hide();
                    $.notify.success(msg.MSG_SAVE_COMPLETE);

                    self.invoke("save");
                },
                validationError: function(validationResult) {
                    $.loader.hide();
                    $.notify.warn(msg.MSG_VALIDATION_ERROR);
                    form.handleValidationErrors(validationResult);
                },
                error: function(message) {
                    $.loader.hide();
                    $.notify.error(message);
                }
            });
        },

        render: function() {
            $(this.container).empty();
            this.form.set("container", this.container);
            this.form.render();

            var title = this.formService.get("title");
            if(title) {
                this.form.set("title", title);
            }

            this.invoke("render");
        },

        show: function() {
            if(!this.container) throw "Please specify a container";

            $.loader.show();
            this.formService.load();
        },

        dispose: function() {
            this.form.dispose();
        }
    });


    var GridView = View.extend({
        ctor: function(gridService) {
            GridView.super.ctor.apply(this, arguments);

            this.gridService = gridService;
            this.grid = new widgets.Grid();

            this.initServiceEvents();
            this.initGridEvents();
        },

        initServiceEvents: function() {
            var grid = this.grid;
            var self = this;
            this.gridService.on({
                load: function(element) {
                    $.loader.hide();
                    grid.set("element", element);
                    self.render();
                },
                error: function(message) {
                    $.notify.error(message);
                    $.loader.hide();
                },
                remove: function(ids) {
                    $(ids).each(function(i, id) {
                        grid.markAsRemoved(id);
                    });
                    $.loader.hide();
                }
            });
        },
        reload: function() {
            this.grid.reload();
        },

        initGridEvents: function() {
            var self = this;
            var gridService = this.gridService;
            this.grid.on({
                reload: function() {
                    $.loader.show();
                    gridService.reload();
                },
                page: function(page) {
                    gridService.setPage(page);
                    $.loader.show();
                    gridService.reload();
                },
                sort: function(data) {
                    gridService.setSort(data.property, data.descending);
                    $.loader.show();
                    gridService.reload();
                },
                nextPage: function() {
                    gridService.nextPage();
                    $.loader.show();
                    gridService.reload();
                },
                previousPage: function() {
                    gridService.previousPage();
                    $.loader.show();
                    gridService.reload();
                },
                search: function(filters) {
                    gridService.setFilters(filters);
                    $.loader.show();
                    gridService.reload();
                },
                edit: function(id) {
                    self.edit(id);
                },
                select: function(selection) {
                    self.invoke("select", selection);
                }
            });
        },

        edit: function(id) {
            this.invoke("edit", id);
        },

        render: function() {
            $(this.container).empty();
            this.grid.set("container", this.container);
            this.grid.render();

            var title = this.gridService.get("title");
            if(title) {
                this.grid.set("title", title);
            }

            this.invoke("render");
        },

        show: function() {
            if(!this.container) throw "Please specify a container";

            $.loader.show();
            this.gridService.load();
        },

        dispose: function() {
            this.grid.dispose();
        }

    });


    var FormAppView = AppView.extend({
        ctor: function(formService) {
            FormAppView.super.ctor.call(this);

            var self = this;
            this.formService = formService;
            this.formView = new FormView(formService);

            this.formView.on({
                submit: function() {
                    self.submit();
                },
                save: function() {
                    self.close();
                }
            });

            this.form = this.formView.get("form");
        },

        show: function() {
            FormAppView.super.show.call(this);

            this.formView.show();
        },

        close: function() {},

        submit: function() {},

        dispose: function() {
            this.formView.dispose();
        }

    });


    var FormDialogView = DialogView.extend({
        ctor: function(formService) {
            FormDialogView.super.ctor.call(this);
            var self = this;

            this.formView = new FormView(formService);
            this.formView.on({
                render: function() {
                    var options = {
                        buttons: {
                            "OK": {
                                primary: true,
                                command: function() {
                                    self.formView.get("form").submit();
                                }
                            }
                        },
                        autoOpen: true,
                        destroyOnClose: true,
                        title: self.title || formService.get("title")
                    };
                    self.set("options", options);
                    self.showDialog();

                    self.form.callback("form-dialog-show");
                },
                save: function() { self.close(); },
                submit: function() { self.submit(); }
            });
            this.form = this.formView.get("form");
            this.form.set("inDialog", true);
            this.formService = formService;

            this.on("close", function() {
                self.formView.dispose();
            });

            this.on("cancel", function() {
                self.formView.dispose();
            });
        },

        show: function() {
            this.content = _E("div");
            this.formView.set("container", this.content);
            this.formView.show();
        },

        close: function() {
            $(this.content).modalDialog("close");
        },

        submit: function() {
            this.invoke("submit");
        },

        set_identifier: function(identifier) {
            this.formView.set("identifier", identifier);
        },

        get_identifier: function() {
            return this.formView.get("identifier");
        }

    });



    var GridAppView = AppView.extend({
        ctor: function(gridService) {
            GridAppView.super.ctor.apply(this, arguments);
            var self = this;

            this.gridView = new GridView(gridService);
            this.pushDispose(function() { self.gridView.dispose(); });
            this.gridView.on({
                edit: function(id) {
                    self.edit(id);
                },
                render: function() {
                    self.finishAppView();

                    //$('#toolbar').toolbar('showGroups', 'default');

                    self.invoke("complete");
                },
                select: function() {
                    self.invoke("select");
                },
                unselect: function(selection) {
                    self.invoke("unselect", selection);
                },
                selectAll: function() {
                    self.invoke("selectAll");
                },
                unselectAll: function() {
                    self.invoke("unselectAll");
                }
            });

            this.gridService = gridService;

            this.grid = this.gridView.get("grid");
        },

        edit: function(id) {
            this.invoke("edit", id);
        },

        show: function() {
            GridAppView.super.show.call(this);

            this.gridView.show();
        },

        set_container: function(container) {
            this.gridView.set("container", container);
        },

        get_container: function() {
            return this.gridView.get("container");
        }
    });


    var GridDialogView = DialogView.extend({
        ctor: function(gridService) {
            GridDialogView.super.ctor.apply(this, arguments);
            var self = this;
            this.gridView = new GridView(gridService);
            this.pushDispose(function() { self.gridView.dispose(); });
            this.gridView.on("edit", function(id) { self.edit(id); });
            this.gridView.on("render", function() { self.showDialog(); });
            this.gridService = gridService;
            this.grid = this.gridView.get("grid");
        },

        edit: function(id) {},

        show: function() {
            this.content = _E("div");
            this.gridView.set("container", this.content);
            this.gridView.show();
        },

        close: function() {
            $(this.content).modalDialog("close");
        }
    });




    var CrudFormAppView = FormAppView.extend({
        ctor: function(formService) {
            CrudFormAppView.super.ctor.call(this, formService);

            var self = this;

            self.form.on("cancel", function() {
                self.close();
            });

            self.form.on("render", function() {
                self.invoke("complete");
            });

            self.on("complete", function() {
                self.set("title", self.formService.get("title"));
            });
        },

        getToolbarButtons: function() {
            var self = this;

            return [
                {
                    text: msg.TOOLBAR_BACK,
                    command: function() {
                        self.close();
                    },
                    icon: "arrow-left"
                },
                {
                    text: msg.TOOLBAR_SAVE,
                    command: function() {
                        self.form.submit();
                    },
                    icon: "save"
                }
            ];

        },

        getBreadcrumbItems: function() {
            var self = this;
            return [
                {
                    pageTitle: "_APPNAME_"
                },
                {
                    icon: "glyphicon glyphicon-home",
                    href: BASE
                },
                {
                    label: msg.CRUD_BREADCRUMB_GRID,
                    href: ui.Navigation.instance().navigateUrl("crud", "index", {
                        e: self.formService.get("gridIdentifier"),
                        reload: 1
                    })
                },
                {
                    label: msg.CRUD_BREADCRUMB_FORM
                }
            ];
        },

        close: function() {
            ui.Navigation.instance().navigate("crud", "index", {
                e: this.formService.get("gridIdentifier"),
                reload: 1,
                fs: 1
            });
        },

        submit: function() {
            var data = this.form.serialize();
            this.form.resetValidation();
            $.loader.show();
            this.formService.save(data);
        }

    });




    var CrudFormDialogView = FormDialogView.extend({
        ctor: function(formService) {
            CrudFormDialogView.super.ctor.call(this, formService);

            var self = this;

            this.on("cancel", function() {
                ui.Navigation.instance().navigate("crud", "list", {
                    e: self.formService.get("gridIdentifier"),
                    fs: 0,
                    cancel: 1
                });
            });
        },

        close: function() {
            CrudFormDialogView.super.close.call(this);
            ui.Navigation.instance().navigate("crud", "list", {
                e: this.formService.get("gridIdentifier"),
                fs: 0,
                reload: 1
            });
        },

        submit: function() {
            var data = this.form.serialize();
            this.form.resetValidation();

            $.loader.show();
            this.formService.save(data);
        }
    });

    var CrudGridAppView = GridAppView.extend({
        ctor: function(gridService) {
            CrudGridAppView.super.ctor.call(this, gridService);

            var self = this;

            this.lastTimeSelected = false;
            this.selectionTimer = null;

            gridService.on("load", function() {
                if (self.get("fullScreenForm")) {
                    self.lastTimeSelected = false;
                }
            });

            this.grid = this.get("grid");
            this.gridView = this.get("gridView");
            this.gridView.on({
                select: function() {
                    if(self.selectionTimer) {
                        window.clearTimeout(self.selectionTimer);
                    }

                    self.selectionTimer = window.setTimeout(function() {
                        var somethingSelected = self.grid.getSelection().length > 0;
                        if(somethingSelected !== self.lastTimeSelected) {
                            if(somethingSelected) {
                                //$('#toolbar').toolbar('showGroups', 'selected');
                            } else {
                                //$('#toolbar').toolbar('hideGroups', 'selected');
                            }
                        }
                        self.lastTimeSelected = somethingSelected;
                    }, 100);
                }
            });

            this.fullScreenForm = 0;

            this.on("complete", function() {
                self.set("title", self.gridService.get("title"));
            });
        },

        create: function() {
            ui.Navigation.instance().navigate("crud", "create", {
                e: this.gridService.get("formIdentifier"),
                fs: this.fullScreenForm,
                g: this.gridService.get("identifier")
            });
        },

        edit: function(id) {
            ui.Navigation.instance().navigate("crud", "edit", {
                e: this.gridService.get("formIdentifier"),
                fs: this.fullScreenForm,
                id: id,
                g: this.gridService.get("identifier")
            });
        },

        remove: function(ids) {
            $.loader.show();
            this.gridService.remove(ids);
        },

        getToolbarButtons: function() {
            var self = this;
            var buttons = [];
            buttons.push(
                {
                    text: msg.TOOLBAR_CREATE,
                    command: function () {
                        self.create();
                    },
                    icon: "plus"
                }
            );

            if (this.gridService.get("searchFormIncluded")) {
                buttons.push(
                    {
                        text: msg.TOOLBAR_SEARCH,
                        icon: "search",
                        command: function () {
                            self.get("grid").showSearchForm();
                        }
                    });
            }

            buttons.push(
                {
                    text: msg.TOOLBAR_REFRESH,
                    command: function() {
                        self.gridService.reload();
                    },
                    icon: "refresh"
                }
            );

            buttons.push(
                {
                    text: msg.TOOLBAR_ACTIONS,
                    group: 'selected',
                    type: "menu",
                    alignRight: true,
                    items: [
                        {
                            label: msg.TOOLBAR_SELECT_ALL,
                            command: function() {
                                self.grid.selectAll();
                            }
                        },
                        {
                            label: msg.TOOLBAR_UNSELECT_ALL,
                            command: function() {
                                self.grid.unselectAll();
                            }
                        },
                        { separator: true },
                        {
                            label: msg.TOOLBAR_DELETE_SELECTION,
                            command: function() {
                                var ids = self.grid.getSelection();
                                if(ids.length == 0) {
                                    $.notify.warn(msg.MSG_PLEASE_SELECT_ROW);
                                } else {
                                    self.remove(ids);
                                }
                            },
                            important: true
                        }
                    ],
                    icon: "asterisk"
                }
            );

            return buttons;
        },

        getBreadcrumbItems: function() {
            return [
                {
                    pageTitle: "_APPNAME_"
                },
                {
                    icon: "glyphicon glyphicon-home",
                    href: BASE
                },
                {
                    label: msg.LABEL_HOME,
                    href: BASE
                },
                {
                    label: msg.CRUD_BREADCRUMB_GRID
                }
            ];
        }
    });

    exports.View = View;
    exports.ContentView = ContentView;
    exports.RemoteContentView = RemoteContentView;
    exports.AppView = AppView;
    exports.DialogView = DialogView;
    exports.FramedView = FramedView;
    exports.FormView = FormView;
    exports.GridView = GridView;
    exports.FormAppView = FormAppView;
    exports.FormDialogView = FormDialogView;
    exports.GridAppView = GridAppView;
    exports.GridDialogView = GridDialogView;
    exports.CrudFormAppView = CrudFormAppView;
    exports.CrudFormDialogView = CrudFormDialogView;
    exports.CrudGridAppView = CrudGridAppView;





    return exports;
});