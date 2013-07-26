define(['fco/collections/volumetrics'],
  function (VolumetricsCollection) {
    var someFakeFCOTransactionData = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 7
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 4
      }
    ];

    describe("FCO volumetrics collections", function () {
      var volumetricsCollection = undefined;

      beforeEach(function () {
        volumetricsCollection = new VolumetricsCollection({ data: someFakeFCOTransactionData }, {
          serviceName: 'notARealFCOTransaction'
        });
      });

      it("should query backdrop for journey data for the specified service", function () {
        expect(volumetricsCollection.url()).toContain("journey");
        expect(volumetricsCollection.url()).toContain("notARealFCOTransaction");
      });

      it("should count the total number of people starting the transaction", function () {
        expect(volumetricsCollection.numberOfJourneyStarts()).toEqual(21);
      });

      it("should count the total number of people completing the transaction", function () {
        expect(volumetricsCollection.numberOfJourneyCompletions()).toEqual(10);
      });

      it("should give the total completion rate as a percentage", function () {
        expect(volumetricsCollection.completionRate()).toBeCloseTo(47.6, 0.01);
      });

      it("should give a series for applications", function () {
        var applicationsSeries = volumetricsCollection.applicationsSeries();
        expect(applicationsSeries.title).toBe("Done");
        expect(applicationsSeries.id).toBe("done");
        expect(applicationsSeries.weeksWithData).toBe(3);
        expect(applicationsSeries.mean).toBeCloseTo(3.33, 0.01);
        expect(applicationsSeries.values).not.toBeUndefined();
      });

      it("should give a series for completion rate", function () {
        var completionSeries = volumetricsCollection.completionSeries();
        expect(completionSeries.title).toBe("Completion rate");
        expect(completionSeries.id).toBe("completion");
        expect(completionSeries.weeksWithData).toBe(3);
        expect(completionSeries.totalCompletion).toBeCloseTo(47.6, 0.01);
        expect(completionSeries.values.length).not.toBeUndefined();
      });
      
      it("should map applications to application series", function () {
        var firstValue = volumetricsCollection.applicationsSeries().values.at(6);
        expect(firstValue.get('_start_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
        expect(firstValue.get('_end_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
        expect(firstValue.get('uniqueEvents')).toBe(3);
        var secondValue = volumetricsCollection.applicationsSeries().values.at(7);
        expect(secondValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
        expect(secondValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
        expect(secondValue.get('uniqueEvents')).toBe(3);
        var thirdValue = volumetricsCollection.applicationsSeries().values.at(8);
        expect(thirdValue.get('_start_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
        expect(thirdValue.get('_end_at')).toBeMoment(moment("2013-07-01T01:00:00+01:00"));
        expect(thirdValue.get('uniqueEvents')).toBe(4);
      });

      it("should map completion rates to completion series", function () {
        var firstValue = volumetricsCollection.completionSeries().values.at(6);
        expect(firstValue.get('_start_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
        expect(firstValue.get('_end_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
        expect(firstValue.get('completion')).toBe(0.6);
        var secondValue = volumetricsCollection.completionSeries().values.at(7);
        expect(secondValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
        expect(secondValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
        expect(secondValue.get('completion')).toBeCloseTo(0.428, 0.001);
        var thirdValue = volumetricsCollection.completionSeries().values.at(8);
        expect(thirdValue.get('_start_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
        expect(thirdValue.get('_end_at')).toBeMoment(moment("2013-07-01T01:00:00+01:00"));
        expect(thirdValue.get('completion')).toBeCloseTo(0.4444, 0.001);
      });
      
      it("should query for 9 weeks of data for application series", function () {
        expect(volumetricsCollection.applicationsSeries().values.length).toBe(9);
      });

      it("should pad out missing data for application series", function () {
        var paddedValues = volumetricsCollection.applicationsSeries().values.first(6);
        var paddedValue = paddedValues.pop();
        expect(paddedValue.get('_start_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
        expect(paddedValue.get('_end_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
        expect(paddedValue.get('uniqueEvents')).toBe(0);

        var paddedValue2 = paddedValues.pop();
        expect(paddedValue2.get('_start_at')).toBeMoment(moment("2013-05-27T01:00:00+01:00"));
        expect(paddedValue2.get('_end_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
        expect(paddedValue2.get('uniqueEvents')).toBe(0);
      });

      it("should query for 9 weeks of data for completion series", function () {
        expect(volumetricsCollection.completionSeries().values.length).toBe(9);
      });

      it("should pad out missing data for completions series", function () {
        var paddedValues = volumetricsCollection.completionSeries().values.first(6);
        var paddedValue = paddedValues.pop();
        expect(paddedValue.get('_start_at')).toBeMoment(moment("2013-06-03T01:00:00+0100"));
        expect(paddedValue.get('_end_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
        expect(paddedValue.get('completion')).toBe(0);
      });

      it("should have a completion rate of 0 when there's no done event for the timestamp", function () {
        var events = { data: [
          {
            _timestamp: "2013-06-09T23:00:00+00:00",
            eventCategory: "fco-transaction-name:start",
            uniqueEvents: 5
          }
        ]};

        var noDoneEventVolumetricsCollection = new VolumetricsCollection(events, {
          serviceName: 'notARealFCOTransaction'
        });

        expect(noDoneEventVolumetricsCollection.completionSeries().values.at(8).get('completion')).toBe(0);
      })
    });
  }
);
