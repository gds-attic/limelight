define([
  'vehicle-licensing/collections/services'
],
function (ServicesCollection) {
  describe("ServicesCollection", function () {
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
          "volume:sum": 2,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "service": "tax-disc"
    }, 
    {
      "volume:sum": 7, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "volume:sum": 4,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "service": "sorn"
    }
  ]
};

    var expected = [
      {
        "id": "sorn",
        "title": "SORN",
        "href": "/performance/sorn",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "volume:sum": 4,
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      },
      {
        "id": "tax-disc",
        "title": "Tax disc",
        "href": "/performance/tax-disc",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "volume:sum": 3,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "volume:sum": 2,
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      }
    ];



    describe("parse", function () {
      it("parses the response", function () {
        var parsed = ServicesCollection.prototype.parse(response);
        expect(parsed).toEqualProperties(expected);
      });
    });
  });
});
