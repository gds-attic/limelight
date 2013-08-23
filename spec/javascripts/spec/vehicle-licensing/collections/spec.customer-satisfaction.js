define([
  'vehicle-licensing/collections/customer-satisfaction'
],
  function (CustomerSatisfaction) {
    describe("Vehicle Licensing Customer Satisfaction Collection", function () {
      it("should have customer satisfaction from the last entry", function () {
        var data = {
          data: [
            {
              "_timestamp": "2013-01-01T00:00:00+00:00",
              "satisfaction_tax_disc": 1.3,
              "satisfaction_sorn": 1.7
            },
            {
              "_timestamp": "2013-02-01T00:00:00+00:00",
              "satisfaction_tax_disc": 1.4,
              "satisfaction_sorn": 1.8
            }
          ]
        };

        var customerSatisfaction = new CustomerSatisfaction(data, {parse: true});

        expect(customerSatisfaction.last().get('_timestamp')).toBeMoment(moment("2013-02-01"));
        expect(customerSatisfaction.last().get('satisfaction_sorn')).toBe(0.8);
        expect(customerSatisfaction.last().get('satisfaction_tax_disc')).toBe(0.9);
      });
    });
  });