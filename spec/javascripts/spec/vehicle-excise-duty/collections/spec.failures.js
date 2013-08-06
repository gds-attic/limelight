define([
  'vehicle-excise-duty/collections/failures',
  'extensions/models/query'
],
function (Collection, Query) {
  describe("Vehicle Excise Duty Failures Collection", function () {

    describe("queryParams", function () {

      it("queries for failures in the last week grouped by reason", function () {
          var collection = new Collection();
          var params = collection.queryParams();
          expect(params).toEqual({
            period: 'week',
            duration: 1,
            group_by: 'reason',
            collect: [
              'count:sum',
              'description'
            ]
          });
      });

      it("allows filtering by type", function () {
          var collection = new Collection([], { type: 'foo' });
          var params = collection.queryParams();
          expect(params).toEqual({
            period: 'week',
            duration: 1,
            group_by: 'reason',
            filter_by: 'type:foo',
            collect: [
              'count:sum',
              'description'
            ]
          });
      });
    });

    describe("parse", function () {
      it("parses grouped response", function () {
        var response = {
          "data": [
            {
              "_count": 2.0, 
              "values": [{
                "_end_at": "2013-08-05T00:00:00+00:00", 
                "_count": 2.0, 
                "_start_at": "2013-07-29T00:00:00+00:00"
              }],
              "description": ["Abandoned"],
              "count:sum": 41.0, 
              "_group_count": 1, 
              "reason": 0.0, 
              "description:set": ["Abandoned"]
            }, 
            {
              "_count": 2.0, 
              "values": [{
                "_end_at": "2013-08-05T00:00:00+00:00", 
                "_count": 2.0, 
                "_start_at": "2013-07-29T00:00:00+00:00"
              }],
              "description": ["User Cancelled Transaction"],
              "count:sum": 2446.0, 
              "_group_count": 1, 
              "reason": 5.0, 
              "description:set": ["User Cancelled Transaction"]
            }
          ]
        };

        var collection = new Collection(response, { parse: true });
        expect(collection.length).toEqual(2);
        expect(collection.at(0).get('description')).toEqual('Abandoned');
        expect(collection.at(0).get('count')).toEqual(41);
        expect(collection.at(1).get('description')).toEqual('User Cancelled Transaction');
        expect(collection.at(1).get('count')).toEqual(2446);
      });
    });
  });
});
