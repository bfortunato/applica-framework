define(["framework/core", "framework/model", "framework/views"], function(core, model, views) {

    var exports = {};

    var AutoForm = core.AObject.extend({
        ctor: function(code) {
            AutoForm.super.ctor.call(this);

            if(code != 12345) {
                throw "AutoForm is a singleton. Please use AutoForm.instance()"
            }
        },

        scan: function() {
            $("[data-component='auto_form']").each(function(i, autoForm) {
                var url = $(autoForm).attr("data-url");
                var action = $(autoForm).attr("data-action");
                var ajax = $(autoForm).attr("data-ajax") == "true";

                var service = new model.FormService();
                service.set("url", url);
                service.set("action", action);
                service.set("ajax", ajax);

                var view = new views.FormView(service);
                view.set("container", $(autoForm));
                view.show();

                view.on("load", function() {
                    if(ajax) {
                        view.on("submit", function(e) {
                            var data = view.form.serialize();
                            service.performAction(data);
                            e.preventDefault();
                        });
                    } else {
                        if(action) {
                            view.get("form.element").find("[data-component='form']").attr("action", action);
                        }
                    }
                });
            });
        }
    });

    AutoForm.__instance = null;
    AutoForm.instance = function() {
        if(AutoForm.__instance == null) {
            AutoForm.__instance = new AutoForm(12345);
        }

        return AutoForm.__instance;
    };


    var AutoGrid = core.AObject.extend({
        ctor: function(code) {
            AutoGrid.super.ctor.call(this);

            if(code != 12345) {
                throw "AutoGrid is a singleton. Please use AutoForm.instance()"
            }
        },

        scan: function() {
            $("[data-component='auto_grid']").each(function(i, autoGrid) {
                var url = $(autoGrid).attr("data-url");

                var service = new model.GridService();
                service.set("url", url);

                var view = new views.GridView(service);
                view.set("container", $(autoGrid));
                view.show();
            });
        }
    });

    AutoGrid.__instance = null;
    AutoGrid.instance = function() {
        if(AutoGrid.__instance == null) {
            AutoGrid.__instance = new AutoGrid(12345);
        }

        return AutoGrid.__instance;
    };


    exports.AutoForm = AutoForm;
    exports.AutoGrid = AutoGrid;

    return exports;

});