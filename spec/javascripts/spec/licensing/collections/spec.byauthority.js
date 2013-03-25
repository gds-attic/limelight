define([
  'licensing/collections/byauthority'
],
function (Collection, Applications) {
  describe("ApplicationsByAuthorityCollection", function() {
    describe("queryParams", function() {
      it("requests data for the last nine weeks", function() {
        var collection = new Collection([], {
          licenceUrlSlug: 'test-licence'
        });
        spyOn(Collection.__super__, "moment");
        Collection.__super__.moment.plan = function () {
          var realMoment = collection.moment.originalValue;
          // set "now" to a fixed date to enable static expectations
          if (!arguments.length) {
            return realMoment('2013-03-13');
          }
          return realMoment.apply(null, arguments);
        }
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-01-07T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.period).toEqual('week');
        expect(params.filter_by).toEqual('test-licence');
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.limit).toEqual(5);
        expect(params.sort_by).toEqual('_count:descending');
        expect(params.collect).toEqual('authorityName,licenceName');
      });
    });
  });
});
