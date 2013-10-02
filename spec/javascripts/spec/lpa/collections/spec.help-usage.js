define([
  'lpa/collections/help-usage'
],
  function (Collection) {
    describe("LPA Help Usage Collection", function () {

      describe("queryParams", function () {

        it("queries for help usage in the last week", function () {
          var collection = new Collection();

          setupMoment('2013-09-30 15:20:31', collection);

          var params = collection.queryParams();

          expect(params.filter_by).toEqual('eventAction:help');
          expect(params.group_by).toEqual('eventLabel');
          expect(params.collect).toEqual(['uniqueEvents']);
          expect(params.start_at).toBeMoment(moment('2013-09-23 00:00:00'));
          expect(params.end_at).toBeMoment(moment('2013-09-30 00:00:00'));
        });
      });

      describe("parse", function () {
        it("parses usage response from backdrop", function () {
          var response = {
            "data": [
              {
                "eventLabel":"help1",
                "uniqueEvents": [123]
              },
              {
                "eventLabel":"help2",
                "uniqueEvents":[456]
              },
              {
                "eventLabel":"help3",
                "uniqueEvents":[789]
              }
            ]
          };

          var collection = new Collection(response, { parse: true });

          expect(collection.length).toEqual(3);

          expect(collection.at(0).get('description')).toEqual('help1');
          expect(collection.at(0).get('count')).toEqual(123);
          expect(collection.at(1).get('description')).toEqual('help2');
          expect(collection.at(1).get('count')).toEqual(456);
          expect(collection.at(2).get('description')).toEqual('help3');
          expect(collection.at(2).get('count')).toEqual(789);
        });
      });
    });
  });

