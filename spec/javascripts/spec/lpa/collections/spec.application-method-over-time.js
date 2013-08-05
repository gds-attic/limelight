define([
  'lpa/collections/application-method-over-time'
],
function (ApplicationMethod) {

  describe("Application method over time", function() {
    it("groups data into digital and non-digital", function() {
      var exampleJson = {
        "data": [
          {
            "_timestamp": "2013-01-01T00:00:00+00:00",
            "value": "631",
            "key": "property_and_financial_paper_applications",
          },
          {
            "_timestamp": "2013-01-01T00:00:00+00:00",
            "value": "247",
            "key": "health_and_welfare_paper_applications",
          },
          {
            "_timestamp": "2013-01-01T00:00:00+00:00",
            "value": "28",
            "key": "property_and_financial_digital_applications",
          },
          {
            "_timestamp": "2013-01-01T00:00:00+00:00",
            "value": "94",
            "key": "health_and_welfare_digital_applications",
          },
          {
            "_timestamp": "2013-01-01T00:00:00+00:00",
            "value": "77",
            "key": "property_and_financial_digital_applications_perfect",
          }
        ]
      };

      var expected = [
        {
          "id": "non_digital",
          "title": "Non-digital",
          "values": [{
            "_start_at": "2013-01-01T00:00:00+00:00",
            "_end_at": "2013-01-02T00:00:00+00:00",
            "_count": 878,
            "fraction": 0.878
          }]
        },
        {
          "id": "digital",
          "title": "Digital",
          "values": [{
            "_start_at": "2013-01-01T00:00:00+00:00",
            "_end_at": "2013-01-02T00:00:00+00:00",
            "_count": 122,
            "fraction": 0.122
          }]
        }
      ];

      var parsed = ApplicationMethod.prototype.parse(exampleJson);

      _.each(parsed, function(group) {
        group.values[0]._start_at = group.values[0]._start_at.format();
        group.values[0]._end_at = group.values[0]._end_at.format();
      });

      expect(parsed).toEqual(expected);

    });
  });

});
