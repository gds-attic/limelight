define([
  'licensing/collections/applications-top5-lastweek'
],
function (Collection, Applications) {

  beforeEach(function() {
    this.addMatchers({
      toHaveStartAndEndDatesMatching: function(startDate, endDate) {
        return this.actual.start_at.format('YYYY-MM-DDTHH:mm:ss') === startDate &&
               this.actual.end_at.format('YYYY-MM-DDTHH:mm:ss') === endDate;
      },
      toBeDescendingWithCollectAndGroupedBy: function(groupBy, collect) {
        return this.actual.sort_by === '_count:descending' &&
               this.actual.group_by === groupBy &&
               this.actual.collect === collect;
      }
    });
  });

  describe("ApplicationsTop5LastWeek", function() {
    describe("queryParams", function() {
      it("requires a grouping criterion", function() {
        expect(function () {
          var collection = new Collection([], {});
        }).toThrow();
      });
      
      it("requests date for previous week with licence name when grouping by licence", function() {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        setupMoment('2013-03-13 06:45:00', collection);

        var params = collection.queryParams();

        expect(params).toHaveStartAndEndDatesMatching('2013-03-04T00:00:00', '2013-03-11T00:00:00');
        expect(params).toBeDescendingWithCollectAndGroupedBy('licenceUrlSlug', 'licenceName');
      });

      it("requests date for previous week with authority name when grouping by authority", function() {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        setupMoment('2013-03-13 06:45:00', collection);
      
        var params = collection.queryParams();
        expect(params).toHaveStartAndEndDatesMatching('2013-03-04T00:00:00', '2013-03-11T00:00:00');
        expect(params).toBeDescendingWithCollectAndGroupedBy('authorityUrlSlug', 'authorityName');
      });

      it("requests date for a week during BST time", function() {
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
