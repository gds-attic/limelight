define([
  'licensing/collections/all-entities-and-applications-lastweek'
],
function (Collection) {
  describe("AllEntitiesAndApplicationsLastWeekCollection", function() {
    // 
    describe("initialize", function () {
      it("requires a grouping criterion", function() {
        expect(function () {
          var collection = new Collection([], {});
        }).toThrow();
      });
      
      it("instantiates constituent collections with correct options", function () {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug',
          filterBy: {foo: 'bar'}
        });
        
        expect(collection.collectionInstances[0].groupBy).toEqual('authorityUrlSlug');
        expect(collection.collectionInstances[0].filterBy).toEqual({foo: 'bar'});
        expect(collection.collectionInstances[1].groupBy).toEqual('authorityUrlSlug');
        expect(collection.collectionInstances[1].filterBy).toEqual({foo: 'bar'});
      });
    });
    
    describe("parse", function () {
      
      it("augments list of authorities with count last week where available", function () {
        var collection = new Collection([], {
          groupBy: 'authorityUrlSlug'
        });
        var allEntities = collection.collectionInstances[0];
        var applicationsLastWeek = collection.collectionInstances[1];
        allEntities.reset([
          {
            slug: 'slug1',
            name: 'Name 1'
          },
          {
            slug: 'slug2',
            name: 'Name 2'
          },
          {
            slug: 'slug3',
            name: 'Name 3'
          }
        ]);
  
        applicationsLastWeek.reset([
          {
            authorityUrlSlug: 'slug1',
            _count: 1
          },
          {
            authorityUrlSlug: 'slug2',
            _count: 2
          }
        ], { parse: true });
        
        var result = collection.parse();
        expect(result[0].get('slug')).toEqual('slug1');
        expect(result[0].get('name')).toEqual('Name 1');
        expect(result[0].get('_count')).toEqual(1);
        expect(result[1].get('slug')).toEqual('slug2');
        expect(result[1].get('name')).toEqual('Name 2');
        expect(result[1].get('_count')).toEqual(2);
        expect(result[2].get('slug')).toEqual('slug3');
        expect(result[2].get('name')).toEqual('Name 3');
        expect(result[2].get('_count')).toEqual(0);
      });
      
      it("augments list of licences with count last week where available", function () {
        var collection = new Collection([], {
          groupBy: 'licenceUrlSlug'
        });
        var allEntities = collection.collectionInstances[0];
        var applicationsLastWeek = collection.collectionInstances[1];
        allEntities.reset([
          {
            slug: 'slug1',
            name: 'Name 1'
          },
          {
            slug: 'slug2',
            name: 'Name 2'
          },
          {
            slug: 'slug3',
            name: 'Name 3'
          }
        ]);
  
        applicationsLastWeek.reset([
          {
            licenceUrlSlug: 'slug1',
            _count: 1
          },
          {
            licenceUrlSlug: 'slug2',
            _count: 2
          }
        ], { parse: true });
        
        var result = collection.parse();
        expect(result[0].get('slug')).toEqual('slug1');
        expect(result[0].get('name')).toEqual('Name 1');
        expect(result[0].get('_count')).toEqual(1);
        expect(result[1].get('slug')).toEqual('slug2');
        expect(result[1].get('name')).toEqual('Name 2');
        expect(result[1].get('_count')).toEqual(2);
        expect(result[2].get('slug')).toEqual('slug3');
        expect(result[2].get('name')).toEqual('Name 3');
        expect(result[2].get('_count')).toEqual(0);
      });
    });
  });
});
