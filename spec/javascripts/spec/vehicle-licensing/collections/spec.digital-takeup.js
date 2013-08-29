define([
  'vehicle-licensing/collections/digital-takeup'
],
function (DigitalTakeupCollection) {
  describe("DigitalTakeupCollection", function () {
    var response = {
      "data": [
        {
          "_timestamp": "2013-08-01T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-01T00:00:00+00:00_tax-disc-fully-digital",
          "channel": "fully-digital",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 2
        },
        {
          "_timestamp": "2013-08-02T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-02T00:00:00+00:00_tax-disc-fully-digital",
          "channel": "fully-digital",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 5
        },
        {
          "_timestamp": "2013-08-01T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-01T00:00:00+00:00_tax-disc-assisted-digital",
          "channel": "assisted-digital",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 2
        },
        {
          "_timestamp": "2013-08-02T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-02T00:00:00+00:00_tax-disc-assisted-digital",
          "channel": "assisted-digital",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 3
        },
        {
          "_timestamp": "2013-08-01T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-01T00:00:00+00:00_tax-disc-manual",
          "channel": "manual",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 4
        },
        {
          "_timestamp": "2013-08-02T00:00:00+00:00",
          "_week_start_at": "2013-07-29T00:00:00+00:00",
          "_id": "2013-08-02T00:00:00+00:00_tax-disc-manual",
          "channel": "manual",
          "service": "tax-disc",
          "transaction": "V-V890 Another transaction",
          "volume": 4
        }
      ]
    };

    var expected = [
      {
        "id": "digital",
        "title": "Digital",
        "fraction": 0.35,
        "values": [{
          "_start_at": "2013-07-29T00:00:00+00:00",
          "_end_at": "2013-08-05T00:00:00+00:00",
          "digital": 7,
          "total": 20,
          "fraction": 0.35
        }]
      }
    ];



    describe("parse", function () {
      var parsed = DigitalTakeupCollection.prototype.parse(response);
      _.each(parsed, function(group) {
        group.values[0]._start_at = group.values[0]._start_at.utc().format();
        group.values[0]._end_at = group.values[0]._end_at.utc().format();
      });

      expect(parsed).toEqual(expected);
    });
  });
});
