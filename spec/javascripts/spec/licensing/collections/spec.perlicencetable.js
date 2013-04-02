define([
  'licensing/collections/perlicencetable'
],
function (Collection, Applications) {
  describe("ApplicationsByAuthorityCollection", function() {
    describe("queryParams", function() {
      it("requests data with correct parameters", function() {
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
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.filter_by).toEqual('licenceUrlSlug:test-licence');
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.collect).toEqual(['authorityName', 'licenceName']);
      });
    });
  });
});
