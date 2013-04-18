define([
  'licensing/collections/applications-detail-lastweek'
],
function (Collection, Applications) {
  describe("ApplicationsDetailLastWeek", function() {
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
        
        setupMoment('2013-03-13 06:15:45', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('authorityUrlSlug');
      });
      
      it("requests data grouped by licence", function() {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        setupMoment('2013-03-13 06:15:45', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('licenceUrlSlug');
      });

      it("requests date for a month during BST time", function() {
        var collection = new Collection([], {
            groupBy: 'authorityUrlSlug'
        });

        setupMoment('2013-05-13 06:45:00', collection);

        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-06T00:00:00+0000');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-13T00:00:00+0000');
      });
    });
  });
});
