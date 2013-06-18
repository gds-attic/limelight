define([
  'licensing/views/visitors-realtime',
  'extensions/collections/collection'
],
function (VisitorsRealtimeView, Collection) {
  describe("VisitorsRealtimeView", function () {
    it("renders a number", function () {
      var view = new VisitorsRealtimeView({
        collection: new Collection([{
          "unique_visitors": 10
        }])
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual(
          '<strong>10</strong> Users online now'
        )
      })
    });

    describe('interpolating numbers', function () {
      beforeEach(function() {
        jasmine.Clock.useMock();

      });

      it("interpolates from previous to latest entry on first render", function () {
        var collection = new Collection([
          { "unique_visitors": 34 },
          { "unique_visitors": 10 }
        ]);
        var view = new VisitorsRealtimeView({
          collection: collection
        });
        jasmine.renderView(view, function () {
          collection.trigger('reset');
          expect(view.$el.find('strong')).toHaveHtml('10');
          jasmine.Clock.tick(view.updateInterval);
          // first tick
          expect(view.$el.find('strong')).toHaveHtml('11');
          jasmine.Clock.tick(view.updateInterval);
          // second tick
          expect(view.$el.find('strong')).toHaveHtml('12');
          jasmine.Clock.tick(view.updateInterval * 22);
          // reached the new value
          expect(view.$el.find('strong')).toHaveHtml('34');
          jasmine.Clock.tick(view.updateInterval * 10);
          // nothing happens, new value was already reached
          expect(view.$el.find('strong')).toHaveHtml('34');
        });
      });

      it("shouldn't blow up if there is only one item in a collection", function () {
        var collection = new Collection([
          { "unique_visitors": 34 }
        ]);
        var view = new VisitorsRealtimeView({
          collection: collection
        });
        jasmine.renderView(view, function () {
          collection.trigger('reset');
        });
      });
    });

    it("renders nothing when there's no data", function () {
      var view = new VisitorsRealtimeView({
        collection: new Collection([])
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual('');
      });
    })
  })
});