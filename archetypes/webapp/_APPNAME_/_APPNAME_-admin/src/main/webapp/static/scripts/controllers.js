define([
    "framework/core",
    "framework/model",
    "framework/views",
    "framework/controllers"], function(core, fmodel, fviews, fcontrollers) {

    var exports = {};

    var LibraryDemoController = fcontrollers.Controller.extend({
        form: function() {
            var service = new fmodel.FormService();
            service.set({
                method: "GET",
                url: BASE + "librarydemo/form",
                data: {}
            });

            var view = new fviews.FormAppView(service);
            view.set("title", "Library demo form");

            return view;
        }
    });

    exports.LibraryDemoController = LibraryDemoController;

    return exports;
});