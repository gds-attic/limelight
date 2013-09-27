define([
  'lpa/collections/help-usage'
],
  function (Collection) {
    describe("LPA Help Usage Collection", function () {

      describe("queryParams", function () {

        it("queries for help usage in the last week", function () {
          var params = new Collection().queryParams();

          expect(params).toEqual({
            period: 'week',
            duration: 1,
            ago: 0,
            filter_by: 'eventAction:help',
            group_by: 'eventLabel',
            collect: [
              'uniqueEvents'
            ]
          });
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

