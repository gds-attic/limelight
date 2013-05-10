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
      
      it("listens to selection changes in all groups", function () {
        var group0 = new Group({
          values: [
            { a: 'one' },
            { a: 'two' }
          ]
        }, { parse: true });
        var group1 = new Group({
          values: [
            { a: 'three' },
            { a: 'four' }
          ]
        }, { parse: true });
        spyOn(GraphCollection.prototype, "onGroupChangeSelected");
        var collection = new GraphCollection();
        collection.reset([ group0, group1 ]);
        
        group0.get('values').selectItem(1);
        expect(collection.onGroupChangeSelected).toHaveBeenCalledWith(
          group0, 0, group0.get('values').at(1), 1
        );
        
        group1.get('values').selectItem(0);
        expect(collection.onGroupChangeSelected).toHaveBeenCalledWith(
          group1, 1, group1.get('values').at(0), 0
        );
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
    
    describe("selectItem", function () {
      
      var collection, spy;
      beforeEach(function() {
        spy = jasmine.createSpy();
        var group0 = new Group({
          values: [
            { a: 'one' },
            { a: 'two' }
          ]
        }, { parse: true });
        var group1 = new Group({
          values: [
            { a: 'three' },
            { a: 'four' }
          ]
        }, { parse: true });
        collection = new GraphCollection();
        collection.on('change:selected', spy);
        collection.reset([ group0, group1 ]);
      });
      
      it("selects a group", function () {
        collection.selectItem(1);
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(collection.at(0).get('values').selectedItem).toBeFalsy();
        expect(collection.at(1).get('values').selectedItem).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);
      });
      
      it("selects an item in a group and unselects all other groups", function () {
        collection.selectItem(1, 1);
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(collection.at(0).get('values').selectedItem).toBeFalsy();
        expect(collection.at(1).get('values').selectedItem).toBe(collection.at(1).get('values').at(1))
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        
        collection.selectItem(0, 0);
        expect(collection.selectedItem).toBe(collection.at(0));
        expect(collection.selectedIndex).toEqual(0);
        expect(collection.at(0).get('values').selectedItem).toBe(collection.at(0).get('values').at(0))
        expect(collection.at(1).get('values').selectedItem).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
      });
      
      it("unselects group and item", function () {
        collection.selectItem(1, 1);
        collection.selectItem(null);
        expect(collection.selectedItem).toBe(null);
        expect(collection.selectedIndex).toBe(null);
        expect(collection.at(0).get('values').selectedItem).toBeFalsy();
        expect(collection.at(1).get('values').selectedItem).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(null, null, null, null);
      });
      
      it("unselects item but keeps group", function () {
        collection.selectItem(1, 1);
        collection.selectItem(1, null);
        expect(collection.selectedItem).toBe(collection.at(1));
        expect(collection.selectedIndex).toEqual(1);
        expect(collection.at(0).get('values').selectedItem).toBeFalsy();
        expect(collection.at(1).get('values').selectedItem).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(collection.at(1), 1, null, null);
      });
      
    });
  });
});
