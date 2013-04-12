define([
  'licensing/collections/applications-top5-lastweek'
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
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('licenceUrlSlug');
        expect(params.collect).toEqual('licenceName');
        expect(params.sort_by).toEqual('_count:descending');
      });
      
      it("requests date for previous month with authority name when grouping by authority", function() {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        setupMoment('2013-03-13 06:45:00', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.group_by).toEqual('authorityUrlSlug');
        expect(params.collect).toEqual('authorityName');
        expect(params.sort_by).toEqual('_count:descending');
      });
      
    });
    
    describe("parse", function () {
      it("reads name and slug when grouping by authority when additional data is available", function () {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        var response = {
          data: [
            {
              authorityUrlSlug: 'slug1',
              authorityName: ['Slug 1']
            },
            {
              authorityUrlSlug: 'slug2',
              authorityName: ['Slug 2']
            }
          ]
        };
        
        expect(collection.parse(response)).toEqual([
          {
            slug: 'slug1',
            name: 'Slug 1',
            url: '/performance/licensing/authorities/slug1'
          },
          {
            slug: 'slug2',
            name: 'Slug 2',
            url: '/performance/licensing/authorities/slug2'
          }
        ]);
      });
      
      it("reads name and slug when grouping by authority when additional data is not available", function () {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        
        var response = {
          data: [
            {authorityUrlSlug: 'slug1'},
            {authorityUrlSlug: 'slug2'}
          ]
        };
        
        expect(collection.parse(response)).toEqual([
          {
            slug: 'slug1',
            name: 'slug1',
            url: '/performance/licensing/authorities/slug1'
          },
          {
            slug: 'slug2',
            name: 'slug2',
            url: '/performance/licensing/authorities/slug2'
          }
        ]);
      });
      
      it("reads name and slug when grouping by licence when additional data is available", function () {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        var response = {
          data: [
            {
              licenceUrlSlug: 'slug1',
              licenceName: ['Slug 1']
            },
            {
              licenceUrlSlug: 'slug2',
              licenceName: ['Slug 2']
            }
          ]
        };
        
        expect(collection.parse(response)).toEqual([
          {
            slug: 'slug1',
            name: 'Slug 1',
            url: '/performance/licensing/licences/slug1'
          },
          {
            slug: 'slug2',
            name: 'Slug 2',
            url: '/performance/licensing/licences/slug2'
          }
        ]);
      });
      
      it("reads name and slug when grouping by licence when additional data is not available", function () {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        
        var response = {
          data: [
            {licenceUrlSlug: 'slug1'},
            {licenceUrlSlug: 'slug2'}
          ]
        };
        
        expect(collection.parse(response)).toEqual([
          {
            slug: 'slug1',
            name: 'slug1',
            url: '/performance/licensing/licences/slug1'
          },
          {
            slug: 'slug2',
            name: 'slug2',
            url: '/performance/licensing/licences/slug2'
          }
        ]);
      });
    });
  });
});
