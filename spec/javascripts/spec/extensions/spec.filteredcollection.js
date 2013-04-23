define([
  'extensions/collections/filteredcollection',
  'extensions/collections/collection'
],
function (FilteredCollection, Collection) {
  describe("initialize", function () {
    it("creates an internal collection for filtered elements", function () {
      var collection = new FilteredCollection([
        { id: 'one' }, { id: 'two' }
      ]);
      expect(collection.filtered instanceof Collection).toBe(true);
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0)).toEqual(collection.at(0));
      expect(collection.filtered.at(1)).toEqual(collection.at(1));
    });
  });
  
  describe("applyFilter", function () {
    
    var collection;
    beforeEach(function() {
      collection = new FilteredCollection([
        { id: 'AAaa' },
        { id: 'BBbb' },
        { id: 'aabb' }
      ]);
    });
    
    it("resets the internal filtered collection to elements that match the search term", function () {
      collection.applyFilter('bb');
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0).get('id')).toEqual('BBbb');
      expect(collection.filtered.at(1).get('id')).toEqual('aabb');
    });
    
    it("keeps all elements when using an empty string", function () {
      collection.applyFilter('');
      expect(collection.filtered.length).toEqual(3);
      expect(collection.filtered.at(0).get('id')).toEqual('AAaa');
      expect(collection.filtered.at(1).get('id')).toEqual('BBbb');
      expect(collection.filtered.at(2).get('id')).toEqual('aabb');
    });
    
    it("is case insensitive", function () {
      collection.applyFilter('BB');
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0).get('id')).toEqual('BBbb');
      expect(collection.filtered.at(1).get('id')).toEqual('aabb');
    });
  });
});
