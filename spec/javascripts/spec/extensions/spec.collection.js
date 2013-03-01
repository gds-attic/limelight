define([
    'extensions/collection',
    'extensions/model',
    'backbone'
],
function (Collection, Model, Backbone) {
    describe("Collection", function() {
        it("inherits from Backbone.Collection", function() {
            var collection = new Collection();
            expect(collection instanceof Backbone.Collection).toBe(true);
        });
        
        it("sets the extended Model as default model", function() {
            var collection = new Collection([{foo: 'bar'}]);
            expect(collection.models[0] instanceof Model).toBe(true);
        });
    });
});
