define([
  'extensions/collections/availability-for-24-hours',
  'lodash'
],
  function (AvailabilityFor24HoursCollection, _) {
    describe('AvailabilityFor24HoursCollection', function () {
      var availabilityData = {"data":[
        {
          "uptime": 9,
          "downtime": 1,
          "unmonitored": 1,
          "avgresponse": 321
        },
        {
          "uptime": 10,
          "downtime": 0,
          "unmonitored": 1,
          "avgresponse": 345
        }
      ]};

      var options = {
        checkName: "anything",
        serviceName: "anything",
        parse: true
      };

      it("should use the specified service name in the url", function () {
        var collection =
          new AvailabilityFor24HoursCollection(null, {
            checkName: "anything",
            serviceName: "something-something-fco"
          });

        var url = collection.url();

        expect(url).toContain('/something-something-fco/')
      });

      it("should be created with correct query parameters", function () {
        var collection =
          new AvailabilityFor24HoursCollection(null, {
            checkName: "mycheck",
            serviceName: "anything"
          });
        var params = collection.queryParams();
        expect(params.sort_by).toEqual("_timestamp:descending");
        expect(params.limit).toEqual(24);
      });

      it("should provide percentage of uptime for all models", function () {
        var collection =
          new AvailabilityFor24HoursCollection(availabilityData, options);

          var percentageOfUptime = collection.getPercentageOfUptime();

          expect(percentageOfUptime).toEqual(95);
      });

      xit("should provide percentage uptime + unmonitored", function () {
        var collection =
          new AvailabilityFor24HoursCollection({"data": [{
            "uptime": 8,
            "downtime": 1,
            "unmonitored": 1
          }]}, options);

        var percentageOfUptime = collection.getPercentageOfUptime();

        expect(percentageOfUptime).toEqual(90);
      });

      it("should provide total uptime", function () {

        var collection =
          new AvailabilityFor24HoursCollection(availabilityData, options);

        var totalUptime = collection._getTotalUptime();

        expect(totalUptime).toEqual(19);
      });

      it("should provide total (monitored) time", function () {
        var collection =
          new AvailabilityFor24HoursCollection({"data": [{
            "uptime": 1,
            "downtime": 2,
            "unmonitored": 3
          }]}, options);

        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(3);
      });
      
      it("should provide total monitored AND unmonitored time", function () {
        var collection =
          new AvailabilityFor24HoursCollection({"data": [{
            "uptime": 1,
            "downtime": 2,
            "unmonitored": 3
          }]}, options);

        var totalTime = collection._getTotalTime(true);

        expect(totalTime).toEqual(6);
      });

      it("should provide total time for all models", function () {
        var collection =
          new AvailabilityFor24HoursCollection(availabilityData, options);

        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(20);
      });

      it("should provide average response time", function () {
        var collection =
          new AvailabilityFor24HoursCollection(availabilityData, options);

        var averageResponseTime = collection.getAverageResponseTime();

        expect(averageResponseTime).toEqual(333);
      });

      it("should throw an exception if created with no serviceName", function() {
        expect(function() {
          new AvailabilityFor24HoursCollection([], { checkName: "anything" });
        }).toThrow()
      });

      it("should parse data with end_at as the timestamp and start at as an hour earlier", function() {
         response = {
           data: [
             {
               "uptime": 900, "downtime": 100,
               "unmonitored": 0,
               "avgresponse": 100,
               "check": "anything",
               "_id": "08",
               "_timestamp": "2013-06-17T16:00:00+00:00"
             }
           ]
         }
         var collection =
           new AvailabilityFor24HoursCollection(availabilityData, options);

         data = collection.parse(response);

         expect(data.values[0]._start_at).toEqual(moment("2013-06-17T15:00:00+00:00"));
         expect(data.values[0]._end_at).toEqual(moment("2013-06-17T16:00:00+00:00"));
      });
    });
  });
