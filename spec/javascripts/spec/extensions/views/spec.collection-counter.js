define([
  'extensions/collections/collection',
  'extensions/views/collection-counter'
],
function (Collection, Counter) {
  describe("CollectionCounter", function () {
    var view, collection;
    
    it("updates the element count", function () {
      collection = new Collection();
      view = new Counter({
        collection: collection
      });
      jasmine.renderView(view, function () {
        collection.reset( [{}] );
        expect(view.$el).toHaveText('1');
      });
    });
  });

});
