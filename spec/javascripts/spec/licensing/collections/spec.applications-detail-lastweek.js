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
      
      it("requests data grouped by authority without a filter", function() {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        setupMoment('2013-03-13 06:15:45', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.collect).toEqual('authorityName');
        expect(params.filter_by).not.toBeDefined();
      });
      
      it("requests data grouped by licence without a filter", function() {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        setupMoment('2013-03-13 06:15:45', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('licenceUrlSlug');
        expect(params.collect).toEqual('licenceName');
        expect(params.filter_by).not.toBeDefined();
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
    
    describe("comparators", function () {
      describe("group", function () {
        it("re-sorts data by authority sort name", function () {
          var collection = new Collection([], {
            groupBy: 'authorityUrlSlug'
          });
          collection.reset([
            { authorityUrlSlug: 'authority1', authoritySortName: 'sort B', licenceUrlSlug: 'licence3' },
            { authorityUrlSlug: 'authority2', authoritySortName: 'sort C', licenceUrlSlug: 'licence1' },
            { authorityUrlSlug: 'authority3', authoritySortName: 'sort A', licenceUrlSlug: 'licence2' },
          ]);
          
          // when grouping by authorityUrlSlug, it should sort by authoritySortName
          collection.sortByAttr('group', true);
          expect(collection.at(0).get('authorityUrlSlug')).toEqual('authority2');
          expect(collection.at(1).get('authorityUrlSlug')).toEqual('authority1');
          expect(collection.at(2).get('authorityUrlSlug')).toEqual('authority3');
          
          // when grouping by licenceUrlSlug, it should sort by licenceUrlSlug
          collection.groupBy = 'licenceUrlSlug';
          collection.sortByAttr('group', true);
          expect(collection.at(0).get('authorityUrlSlug')).toEqual('authority1');
          expect(collection.at(1).get('authorityUrlSlug')).toEqual('authority3');
          expect(collection.at(2).get('authorityUrlSlug')).toEqual('authority2');
        });
      });
    });
  });
});
