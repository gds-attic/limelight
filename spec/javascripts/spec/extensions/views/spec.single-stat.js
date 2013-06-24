define([
  'extensions/views/single-stat',
  'licensing/collections/licensing-availability-for-24-hours'
], function (SingleStatView, LicensingAvailabilityFor24HoursCollection) {
  describe("SingleStatView", function () {

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

    it("Should display uptime percentage", function () {
      var collection = new LicensingAvailabilityFor24HoursCollection(
        {"data": [{
          "uptime": 3,
          "downtime": 1,
          "unmonitored": 6
        }]});

      var view = new SingleStatView({
        collection: collection,
        getStatFunction: function (collection) { return collection.getPercentageOfUptime() + '%'; }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>30%</strong>");
      });
    });

    it("Should display response time", function () {
      var collection = new LicensingAvailabilityFor24HoursCollection(
        {"data": [{
          "avgresponse": 377
        }]});

      var view = new SingleStatView({
        collection: collection,
        getStatFunction: function (collection) { return collection.getAverageResponseTime() + 'ms'; }
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>377ms</strong>");
      });
    });
  });
});
