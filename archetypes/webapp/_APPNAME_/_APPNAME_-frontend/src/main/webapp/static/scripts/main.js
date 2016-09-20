define(["framework/helpers"], function(helpers) {

    //scan pages for forms and grids
    helpers.AutoForm.instance().scan();
    helpers.AutoGrid.instance().scan();

});