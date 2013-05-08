define([
  'extensions/collections/graphcollection',
  'extensions/collections/collection',
  'extensions/models/group'
],
function (GraphCollection, Collection, Group) {
  
  describe("GraphCollection", function() {
    
    describe("initialize", function() {
      
      it("uses Group models", function () {
        expect(GraphCollection.prototype.model).toBe(Group);
      });
    });
    
    describe("parse", function () {
      it("assigns constituent collections as 'values' attribute", function () {
        var collection = new GraphCollection([], {});
        collection.collectionInstances = [
          new Collection([ { foo: 'bar' } ]),
          new Collection([ { foo: 'baz' } ])
        ];
        collection.reset(collection.parse(), { parse: true });
        expect(collection.at(0).get('values').at(0).get('foo')).toEqual('bar');
        expect(collection.at(1).get('values').at(0).get('foo')).toEqual('baz');
      });
    });
  });
});
