define([
  'vehicle-licensing/views/customer-satisfaction-view',
  'vehicle-licensing/collections/customer-satisfaction'
],
function (View, Collection) {
  describe("Customer Satisfaction view", function() {
    describe("getCurrentValue", function () {
      it('should return SORN satisfaction as a percentage', function() {
        var collection = buildCollection([
          { "satisfaction_sorn": 1.6 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getCurrentValue()).toEqual("85%")
      });

      it('should return Tax Disc satisfaction as a percentage', function() {
        var collection = buildCollection([
          { "satisfaction_tax_disc": 1.4 }
        ]);

        var view = new View({
          collection: collection,
          service: 'tax-disc'
        });

        expect(view.getCurrentValue()).toEqual("90%")
      });

      it('should return rounded the percentage', function() {
        var collection = buildCollection([
          { "satisfaction_sorn": 1.99 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getCurrentValue()).toEqual("75.3%")
      });

      it('should round to 2 decimal digits values below 10', function() {
        var collection = buildCollection([
          { "satisfaction_sorn": 4.65 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getCurrentValue()).toEqual("8.75%")
      });

      it('should not round 100%', function() {
        var collection = buildCollection([
          { "satisfaction_sorn": 1 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getCurrentValue()).toEqual("100%")
      });
    });

    describe("getCurrentDate", function () {
      it('should display current date as month and year', function() {
        var collection = buildCollection([
          { "_timestamp": "2013-03-01T00:00:00+00:00" }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getCurrentDate()).toEqual("March 2013");
      });
    });

    describe("getChangeString", function() {
      it("should return the percentage change in Tax Disc satisfaction from previous month", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_tax_disc": 1.6 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_tax_disc": 1.45 }
        ]);

        var view = new View({
          collection: collection,
          service: 'tax-disc'
        });

        expect(view.getChangeString()).toEqual("+3.75%")

      });

      it("should return the percentage change in Sorn satisfaction from previous month", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 2 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 1.5 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeString()).toEqual("+12.5%")

      });

      it("should handle negative change", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 1.4 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 2 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeString()).toEqual("-15%")

      });

      it("should handle no change", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 2 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 2 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeString()).toEqual("0%")
      });

      it("should round change to 0", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 1.9999999 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 2 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeString()).toEqual("0%")
      });
    });

    describe("getChangeClasses", function() {
       it("should return classes for positive change", function () {
         var collection = buildCollection([
           { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 2 },
           { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 1.5 }
         ]);

         var view = new View({
           collection: collection,
           service: 'sorn'
         });

         expect(view.getChangeClasses()).toEqual("increase improvement");
       });

      it("should return classes for negative change", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 2 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 4 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeClasses()).toEqual("decrease decline");
      });

      it("should return classes for no change", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 2 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 2 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeClasses()).toEqual("no-change");
      });

      it("should return classes for no change when change is rounded to 0", function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00", "satisfaction_sorn": 1.9999999 },
          { "_timestamp": "2013-03-01T00:00:00+00:00", "satisfaction_sorn": 2 }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getChangeClasses()).toEqual("no-change");
      });
    });


    describe("getPreviousDate", function () {
      it('should display current date as month and year', function() {
        var collection = buildCollection([
          { "_timestamp": "2013-02-01T00:00:00+00:00" },
          { "_timestamp": "2013-03-01T00:00:00+00:00" }
        ]);

        var view = new View({
          collection: collection,
          service: 'sorn'
        });

        expect(view.getPreviousDate()).toEqual("February 2013");
      });
    });
  });

  function buildCollection(data) {
    var defaultDatum =         {
      "_timestamp": "1999-01-01T00:00:00+00:00",
      "satisfaction_tax_disc": 5,
      "satisfaction_sorn": 5
    };

    var response = {
      data: _.map(data, function (datum) { return _.defaults(datum, defaultDatum); })
    };

    return new Collection(response, { parse: true });
  }

});
