define([
  'licensing/collections/all-entities'
],
function (Collection, Applications) {
  describe("AllEntitiesCollection", function() {
    describe("queryParams", function() {
      it("requires a grouping criterion", function() {
        expect(function () {
          var collection = new Collection([], {});
        }).toThrow();
      });
      
      it("requests data grouped by authority", function() {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        var params = collection.queryParams();
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.collect).toEqual('authorityName');
        expect(params.filter_by).not.toBeDefined();
      });
      
      it("requests data grouped by licence", function() {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        var params = collection.queryParams();
        expect(params.group_by).toEqual('licenceUrlSlug');
        expect(params.collect).toEqual('licenceName');
        expect(params.filter_by).not.toBeDefined();
      });
    });
  });
});
