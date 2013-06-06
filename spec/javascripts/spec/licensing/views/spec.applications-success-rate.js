define([
  'licensing/views/applications-success-rate',
  'extensions/collections/collection'
],
function (SuccessRateView, Collection) {
  describe("SuccessRateView", function () {

    var collection;
    beforeEach(function() {
      collection = new Collection();
    });

    describe("initialize", function () {
      it("re-renders on collection reset", function () {
        spyOn(SuccessRateView.prototype, "render");
        var view = new SuccessRateView({
          collection: collection
        });
        collection.reset([{ foo: 'bar' }])
        expect(view.render).toHaveBeenCalled();
      });
    });

    describe("getValue", function () {
      it("returns a success rate fraction when both start and end values are available", function () {
        collection.reset([
          {
            eventCategory: 'licensingUserJourney:end',
            uniqueEvents: 100
          },
          {
            eventCategory: 'licensingUserJourney:downloadFormPage',
            uniqueEvents: 200
          },
          {
            eventCategory: 'ignored',
            uniqueEvents: 23
          }
        ]);
        var view = new SuccessRateView({
          collection: collection
        });
        expect(view.getValue()).toEqual(0.5);
      });

      it("returns null when either start or end value are not available", function () {
        collection.reset([
          {
            eventCategory: 'licensingUserJourney:end',
            uniqueEvents: 100
          },
          {
            eventCategory: 'ignored',
            uniqueEvents: 23
          }
        ]);
        var view = new SuccessRateView({
          collection: collection
        });
        expect(view.getValue()).toBe(null);
      });
    });

    describe("render", function () {
      it("displays success rate as percentage", function () {
        var view = new SuccessRateView({
          collection: collection
        });
        spyOn(view, "getValue").andReturn(0.231);

        jasmine.renderView(view, function () {
          expect(view.$el.html()).toEqual(
            '<strong>23%</strong> average completion rate'
          );
        });
      });
    });
  });
});
