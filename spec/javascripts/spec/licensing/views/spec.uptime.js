define([
  'licensing/views/uptime',
  'licensing/collections/licensing-availability-for-24-hours'
], function (UptimeView, LicensingAvailabilityFor24HoursCollection) {
  describe("UptimeView", function () {
    it("Should display average uptime percentage", function () {
      var collection = new LicensingAvailabilityFor24HoursCollection(
        {"data": [{
          "uptime": 3,
          "downtime": 1,
          "unmonitored": 6
        }]});

      var view = new UptimeView({collection: collection});

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual("<strong>30%</strong>");
      });
    });
  });
});
