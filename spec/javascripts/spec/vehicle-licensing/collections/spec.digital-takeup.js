define([
  'vehicle-licensing/collections/digital-takeup'
],
function (DigitalTakeupCollection) {
  describe("DigitalTakeupCollection", function () {
    var response = {
  "data": [
    {
      "volume:sum": 11, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "volume:sum": 9,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "volume:sum": 2,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "channel": "manual"
    }, 
    {
      "volume:sum": 7, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "volume:sum": 3,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "volume:sum": 4,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "channel": "fully-digital"
    }, 
    {
      "volume:sum": 10, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "volume:sum": 10,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "channel": "assisted-digital"
    }
  ]
};

    var expected = [
      {
        "id": "digital",
        "title": "Digital",
        "fraction": 0.25,
        "values": [
          {
            "_start_at": "2012-08-01T00:00:00+00:00",
            "_end_at": "2012-09-01T00:00:00+00:00",
            "fraction": 0.25
          },
          {
            "_start_at": "2012-09-01T00:00:00+00:00",
            "_end_at": "2012-10-01T00:00:00+00:00",
            "fraction": 0.25
          }
        ]
      }
    ];

    describe("parse", function () {
      it("parses the response", function () {
        var parsed = DigitalTakeupCollection.prototype.parse(response);
        expect(parsed).toEqualProperties(expected);
      });
    });
  });
});
