define(["framework/core", "framework/ui", "framework/model", "framework/views"], function(core, ui, model, views) {
    var exports = {};

    var Controller = core.Disposable.extend({ });

    var CrudController = Controller.extend({
        ctor: function() {
            CrudController.super.ctor.call(this);

            this.gridService = null;
            this.defaultFormIdentifier = null;
            this.defaultGridIdentifier = null;
            this.formService = null;
        },

        index: function(params) {
            if(this.gridService) {
                if(params.reload == 1) {
                    this.gridService.reload();
                    return;
                }

                if(params.cancel == 1) {
                    return;
                }
            }

            var identifier = this.defaultGridIdentifier || params.e;
            if(!identifier) throw "Please specify grid identifier";

            var url = BASE + "crud/grid/" + identifier;
            var gridService = new model.GridService();
            gridService.set({
                method: "POST",
                url: url,
                identifier: identifier
            });

            if (params) {
                var loadRequest = model.QueryStringLoadRequest.parse(params);
                gridService.set("loadRequest", loadRequest);
            }

            this.gridService = gridService;

            var view = this.createGridView(params);
            view.set("fullScreenForm", params.fs);

            return view;
        },

        createGridView: function(params) {
            return new views.CrudGridAppView(this.gridService);
        },

        createFormView: function(params) {
            var self = this;
            var view = null;
            if(params.dialog == 1) {
                view = new views.CrudFormDialogView(this.formService);
            } else {
                view = new views.CrudFormAppView(this.formService);

                this.pushDispose(function() {
                    view.dispose();
                });
            }

            view.on({
                cancel: function() {
                    ui.Navigation.instance().navigate("crud", "list", {
                        e: self.formService.get("gridIdentifier"),
                        fs: 0,
                        cancel: 1
                    });
                },

                close: function() {
                    ui.Navigation.instance().navigate("crud", "list", {
                        e: self.formService.get("gridIdentifier"),
                        fs: 0,
                        reload: 1
                    });
                }
            });

            return view;
        },

        list: function(params) {
            return this.index(params);
        },

        edit: function(params) {
            var identifier = this.defaultFormIdentifier || params.e;
            if(!identifier) throw "Please specify form identifier";

            var formService = new model.FormService();
            var url = BASE + "crud/form/" + identifier;
            formService.set({
                identifier: identifier,
                gridIdentifier: params.g || identifier,
                url: url,
                data: { id: params.id }
            });

            this.formService = formService;

            var view = this.createFormView(params);


            return view;
        },

        create: function(params) {
            return this.edit(params);
        }
    });

    exports.Controller = Controller;
    exports.CrudController = CrudController;

    return exports;
});