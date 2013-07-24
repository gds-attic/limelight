define(['fco/collections/volumetrics'],
  function (VolumetricsCollection) {
    var someFakeFCOTransactionData = { data: [
      {
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 5
      },
      {
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 7
      },
      {
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 9
      },
      {
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 4
      }
    ]};

    describe("FCO volumetrics collections", function () {
      var volumetricsCollection = undefined;

      beforeEach(function () {
        volumetricsCollection = new VolumetricsCollection(someFakeFCOTransactionData, {
          serviceName: 'notARealFCOTransaction'
        });
      });

      it("should query backdrop for journey data for the specified service", function () {
        expect(volumetricsCollection.url()).toContain("journey");
        expect(volumetricsCollection.url()).toContain("notARealFCOTransaction");
      });

      it("should count the total number of people starting the transaction", function () {
        expect(volumetricsCollection.numberOfJourneyStarts(someFakeFCOTransactionData)).toEqual(21);
      });

      it("should count the total number of people completing the transaction", function () {
        expect(volumetricsCollection.numberOfJourneyCompletions(someFakeFCOTransactionData)).toEqual(10);
      });

      it("should give the total completion rate as a percentage", function () {
        expect(volumetricsCollection.completionRate(someFakeFCOTransactionData)).toBeCloseTo(47.6, 0.01);
      });
    });
  }
);
