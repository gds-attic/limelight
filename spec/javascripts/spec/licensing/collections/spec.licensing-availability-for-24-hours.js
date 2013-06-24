define([
  'licensing/collections/licensing-availability-for-24-hours',
  'lodash'
],
  function (LicensingAvailabilityFor24HoursCollection, _) {
    describe('LicensingAvailabilityFor24HoursCollection', function () {
      var availabilityData = {"data":[
        {
          "uptime": 8,
          "downtime": 1,
          "unmonitored": 1,
          "avgresponse": 321
        },
        {
          "uptime": 9,
          "downtime": 0,
          "unmonitored": 1,
          "avgresponse": 345
        }
      ]};

      it("should be created with correct query parameters", function () {
        var collection = new LicensingAvailabilityFor24HoursCollection();
        var params = collection.queryParams();
        expect(params.filter_by).toEqual("check:licensing");
        expect(params.sort_by).toEqual("_timestamp:descending");
        expect(params.limit).toEqual(24);
      });

      it("should provide percentage of uptime for all models", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection(availabilityData);

          var percentageOfUptime = collection.getPercentageOfUptime();

          expect(percentageOfUptime).toEqual(85);
      });

      it("should provide percentage of uptime", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection({"data": [{
            "uptime": 8,
            "downtime": 1,
            "unmonitored": 1
          }]});

        var percentageOfUptime = collection.getPercentageOfUptime();

        expect(percentageOfUptime).toEqual(80);
      });

      it("should provide total uptime", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection({"data": [{
            "uptime": 5
          }]});

        var totalUptime = collection._getTotalUptime();

        expect(totalUptime).toEqual(5);
      });

      it("should provide total uptime for all models", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection({"data": [{
            "uptime": 5
          },{
            "uptime": 7
          }]});

        var totalUptime = collection._getTotalUptime();

        expect(totalUptime).toEqual(12);
      });

      it("should provide total time", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection({"data": [{
            "uptime": 1,
            "downtime": 2,
            "unmonitored": 3
          }]});

        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(6);
      });

      it("should provide total time for all models", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection(availabilityData);

        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(20);
      });

      it("should provide average response time", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection(availabilityData);

        var averageResponseTime = collection.getAverageResponseTime();

        expect(averageResponseTime).toEqual(333);
      });

      it("should round response time to nearest integer", function () {
        var collection =
          new LicensingAvailabilityFor24HoursCollection({"data": [
            {"avgresponse": 47},
            {"avgresponse": 43},
            {"avgresponse": 56}
          ]});

        var averageResponseTime = collection.getAverageResponseTime();

        expect(averageResponseTime).toEqual(49);
      });
    });
  });
