define([
  'extensions/collections/multicollection',
  'extensions/collections/collection'
],
function (MultiCollection, Collection) {
  
  describe("MultiCollection", function() {
    
    describe("initialize", function() {
      it("creates instances of constituent collections with default options", function() {
        var Part1 = Collection.extend({});
        var Part2 = Collection.extend({});
        var collection = new MultiCollection([], {
          collections: [Part1, Part2]
        });
        expect(collection.collectionInstances[0] instanceof Part1).toBe(true);
        expect(collection.collectionInstances[1] instanceof Part2).toBe(true);
      });

      it("creates instances of constituent collections with custom options", function() {
        var Part1 = Collection.extend({});
        var Part2 = Collection.extend({});
        var collection = new MultiCollection([], {
          collections: [
            {
              collection: Part1,
              options: {
                foo: 'bar'
              }
            },
            {
              collection: Part2,
              options: {
                foo: 'baz'
              }
            }
          ]
        });
        expect(collection.collectionInstances[0] instanceof Part1).toBe(true);
        expect(collection.collectionInstances[1] instanceof Part2).toBe(true);
        expect(collection.collectionInstances[0].options.foo).toEqual('bar');
        expect(collection.collectionInstances[1].options.foo).toEqual('baz');
      });
    });
    
    describe("fetch", function() {
      var collection, part1, part2;
      beforeEach(function() {
        collection = new MultiCollection();
        var Part1Collection = Collection.extend({
          queryParams: {part: 'one'},
          fetch: jasmine.createSpy(),
          on: jasmine.createSpy()
        });
        var Part2Collection = Collection.extend({
          queryParams: {part: 'two'},
          fetch: jasmine.createSpy(),
          on: jasmine.createSpy()
        });
        part1 = new Part1Collection();
        part2 = new Part2Collection();
        collection.collectionInstances = [part1, part2];
        spyOn(collection, "parse");
      });
      
      it("propagates shared query parameters to all collections", function () {
        collection.query.set('foo', 'bar');
        expect(part1.query.attributes).toEqual({ foo: 'bar', part: 'one' });
        expect(part2.query.attributes).toEqual({ foo: 'bar', part: 'two' });
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
      });
      
      it("fetches data for all collections", function() {
        collection.fetch();
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
      });
      
      it("parses data once all collections have fetched successfully", function() {
        collection.fetch();
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
        expect(collection.parse).not.toHaveBeenCalled();
        
        part2.fetch.argsForCall[0][0].success();
        expect(collection.parse).not.toHaveBeenCalled();
        
        part1.fetch.argsForCall[0][0].success();
        expect(collection.parse).toHaveBeenCalled();
      });
      
      it("fails as soon as a request fails", function() {
        var onError1 = jasmine.createSpy();
        var onError2 = jasmine.createSpy();
        
        collection.fetch({
          error: onError1
        });
        collection.on('error', onError2);
        
        expect(part2.on.argsForCall[0][0]).toEqual('error');
        var onErrorListener = part2.on.argsForCall[0][1];
        
        expect(part1.fetch).toHaveBeenCalled();
        expect(part2.fetch).toHaveBeenCalled();
        expect(onError1).not.toHaveBeenCalled();
        expect(onError2).not.toHaveBeenCalled();
        
        // part 2 fails - the error is escalated immediately
        onErrorListener.call(collection);
        expect(collection.parse).not.toHaveBeenCalled();
        expect(onError1).toHaveBeenCalled();
        expect(onError2).toHaveBeenCalled();
        
        // part 1 returns successfully - parse is still not called
        part1.fetch.argsForCall[0][0].success();
        expect(collection.parse).not.toHaveBeenCalled();
      });
      
    });
    
  });
  
});
