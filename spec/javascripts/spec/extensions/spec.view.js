define([
    'extensions/view',
    'backbone'
],
function (View, Backbone) {
    describe("View", function() {
        it("inherits from Backbone.View", function() {
            var view = new View();
            expect(view instanceof Backbone.View).toBe(true);
        });
    });
});
