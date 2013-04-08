define([
  'licensing/collections/applications-top5-lastmonth'
],
function (Collection, Applications) {
  describe("ApplicationsDetailLastWeek", function() {
    describe("queryParams", function() {
      it("requires a grouping criterion", function() {
        expect(function () {
          var collection = new Collection([], {});
        }).toThrow();
      });
      
      it("requests date for previous month with licence name when grouping by licence", function() {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        setupMoment('2013-03-13 06:45:00', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-02-01T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-01T00:00:00');
        expect(params.group_by).toEqual('licenceUrlSlug');
        expect(params.collect).toEqual('licenceName');
      });
      
      it("requests date for previous month with authority name when grouping by authority", function() {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        setupMoment('2013-03-13 06:45:00', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-02-01T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-01T00:00:00');
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.collect).toEqual('authorityName');
      });
    });
  });
});
