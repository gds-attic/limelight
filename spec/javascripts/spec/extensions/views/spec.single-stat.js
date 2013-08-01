define([
  'extensions/views/single-stat',
  'extensions/collections/collection'
], function (SingleStatView, Collection) {
  describe("SingleStatView", function () {

    var collectionOptions = {
      checkName: "anything",
      serviceName: "anything"
    };

    describe("extracting the stat from the collection", function () {

      var stubCollection = {
        on: function () {},
        getValue: function () { return 5; }
      }

      it("Should try to get a value from a collection", function () {
        spyOn(stubCollection, 'getValue').andCallThrough();
        view = new SingleStatView({
          collection: stubCollection,
          getStatFunction: function (collection) { return collection.getValue(); } 
        });
        jasmine.renderView(view, function () {
          expect(stubCollection.getValue).toHaveBeenCalled();
          expect(view.$el.html()).toEqual("<strong>5</strong>");
        });
      });
    });

    it("should display uptime + unmonitored percentage", function () {
      var collection = new Collection([{
        "foo": 'bar'
      }], collectionOptions);

      var view = new SingleStatView({
        collection: collection,
        getStatFunction: function (collection) {
          return collection.first().get('foo');
        }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>bar</strong>");
      });
    });
  });
});
