window.SPA_CONTAINER = $("#spa-container"); //single page application container, where the ajax views are loaded for default

require([
    "framework/plugins",
    "framework/core",
    "framework/ui",
    "framework/views",
    "framework/controllers",
    "framework/helpers",
    "controllers"], function(_p, core, ui, fviews, fcontrollers, fhelpers, controllers) {

    $.datepicker.setDefaults( $.datepicker.regional[ COUNTRY_CODE ] );

    //register all js controllers here
    //specify singleton if controller must be a singleton
    (function registerRoutes() {
        ui.Navigation.instance().registerController("crud", function() { return new fcontrollers.CrudController(); }, "singleton");
        ui.Navigation.instance().registerController("librarydemo", function() { return new controllers.LibraryDemoController(); });
    })();


    fhelpers.AutoForm.instance().scan();

    //ajax navigation entry point
    ui.Navigation.instance().start();
});