define([
  "fco/collections/fco-availability-for-24-hours"
], function (FcoAvailability24HourCollection) {
  describe("Fco Availability for 24 hours collection", function () {
    it("should use the specified service name in the url", function () {
      var fcoAvailability24HourCollection =
        new FcoAvailability24HourCollection(null, { serviceName: "something-something-fco" });

      var url = fcoAvailability24HourCollection.url();

      expect(url).toContain('/something-something-fco/')
    });

    it("should filter queries for the specified pingdom check", function () {
      var fcoAvailability24HourCollection =
        new FcoAvailability24HourCollection(null, {
          checkName: "fcoCheckOfSomeKind"
        });

      var url = fcoAvailability24HourCollection.url();

      expect(url).toContain('filter_by=' + encodeURIComponent('check:fcoCheckOfSomeKind'));
    });
  });
});
