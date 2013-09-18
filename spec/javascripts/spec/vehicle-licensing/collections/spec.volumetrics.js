define([
  'vehicle-licensing/collections/volumetrics'
],
function (VolumetricsCollection) {
  describe("VolumetricsCollection", function () {
    var response = {
  "data": [
    {
      "volume:sum": 5, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "volume:sum": 3,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
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
      "volume:sum": 16, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "volume:sum": 6,
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
        "id": "manual",
        "title": "Manual",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "volume:sum": 3,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      },
      {
        "id": "assisted-digital",
        "title": "Post Office",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "volume:sum": 6,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "volume:sum": 10,
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      }, 
      {
        "id": "fully-digital",
        "title": "Digital",
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
        ]
      }
    ];



    describe("parse", function () {
      it("parses the response", function () {
        var parsed = VolumetricsCollection.prototype.parse(response);
        expect(parsed).toEqualProperties(expected);
      });
    });
  });
});
