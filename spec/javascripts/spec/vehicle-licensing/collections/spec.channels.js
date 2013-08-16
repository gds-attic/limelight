define([
  'vehicle-licensing/collections/channels'
],
function (Channels) {
  describe("Vehicle Licensing Channels Collection", function () {
    describe("parse", function () {
      it("parses response into three separate series", function () {
        var response = {
          "data": [
            {
              "_count": 7.0, 
              "_end_at": "2013-07-29T00:00:00+01:00", 
              "_start_at": "2013-07-22T00:00:00+01:00",
              "successful_agent:sum": 7636.0,
              "successful_ivr:sum": 131501.0,
              "successful_web:sum": 708121.0
            },
            {
              "_count": 7.0, 
              "_end_at": "2013-08-05T00:00:00+01:00", 
              "_start_at": "2013-07-29T00:00:00+01:00",
              "successful_agent:sum": 7273.0,
              "successful_ivr:sum": 139895.0,
              "successful_web:sum": 715274.0
            }
          ]
        };

        var channels = new Channels(response, { parse: true });
        expect(channels.length).toEqual(3);
        expect(channels.at(0).get('id')).toEqual('successful_agent');
        expect(channels.at(0).get('title')).toEqual('Agent');
        expect(channels.at(0).get('values').length).toEqual(2);
        expect(channels.at(0).get('values').at(0).get('_start_at').utc().format()).toEqual('2013-07-21T23:00:00+00:00');
        expect(channels.at(0).get('values').at(0).get('_end_at').utc().format()).toEqual('2013-07-28T23:00:00+00:00');
        expect(channels.at(0).get('values').at(0).get('_count')).toEqual(7636);
        expect(channels.at(0).get('values').at(1).get('_count')).toEqual(7273);
      });
    });
  });
});
