define([
  'licensing/collections/all-entities-and-applications-lastweek'
],
function (Collection) {
  describe("Collection", function() {
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
            authorityUrlSlug: 'slug1',
            authorityName: 'Name 1'
          },
          {
            authorityUrlSlug: 'slug2',
            authorityName: 'Name 2'
          },
          {
            authorityUrlSlug: 'slug3',
            authorityName: 'Name 3'
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
        expect(result[0].get('authorityUrlSlug')).toEqual('slug1');
        expect(result[0].get('authorityName')).toEqual('Name 1');
        expect(result[0].get('_count')).toEqual(1);
        expect(result[1].get('authorityUrlSlug')).toEqual('slug2');
        expect(result[1].get('authorityName')).toEqual('Name 2');
        expect(result[1].get('_count')).toEqual(2);
        expect(result[2].get('authorityUrlSlug')).toEqual('slug3');
        expect(result[2].get('authorityName')).toEqual('Name 3');
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
            licenceUrlSlug: 'slug1',
            licenceName: 'Name 1'
          },
          {
            licenceUrlSlug: 'slug2',
            licenceName: 'Name 2'
          },
          {
            licenceUrlSlug: 'slug3',
            licenceName: 'Name 3'
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
        expect(result[0].get('licenceUrlSlug')).toEqual('slug1');
        expect(result[0].get('licenceName')).toEqual('Name 1');
        expect(result[0].get('_count')).toEqual(1);
        expect(result[1].get('licenceUrlSlug')).toEqual('slug2');
        expect(result[1].get('licenceName')).toEqual('Name 2');
        expect(result[1].get('_count')).toEqual(2);
        expect(result[2].get('licenceUrlSlug')).toEqual('slug3');
        expect(result[2].get('licenceName')).toEqual('Name 3');
        expect(result[2].get('_count')).toEqual(0);
      });
    });
  });
});
