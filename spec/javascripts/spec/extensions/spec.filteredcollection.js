define([
  'extensions/collections/filteredcollection',
  'extensions/collections/collection'
],
function (FilteredCollection, Collection) {
  describe("initialize", function () {
    it("creates an internal collection for filtered elements", function () {
      var collection = new FilteredCollection([
        { title: 'one' }, { title: 'two' }
      ]);
      expect(collection.filtered instanceof Collection).toBe(true);
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0)).toEqual(collection.at(0));
      expect(collection.filtered.at(1)).toEqual(collection.at(1));
    });
    
    it("sets the default filter attribute to 'title'", function () {
      var collection = new FilteredCollection();
      expect(collection.filterAttr).toEqual('title');
    });
    
    it("sets a custom filter attribute", function () {
      var collection = new FilteredCollection([], {
        filterAttr: 'foo'
      });
      expect(collection.filterAttr).toEqual('foo');
    });
  });
  
  describe("applyFilter", function () {
    
    var collection;
    beforeEach(function() {
      collection = new FilteredCollection([
        { title: 'AAaa', foo: 'C' },
        { title: 'BBbb', foo: 'D' },
        { title: 'aabb', foo: 'E' }
      ]);
    });
    
    it("resets the internal filtered collection to elements that match the search term", function () {
      collection.applyFilter('bb');
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0).get('title')).toEqual('BBbb');
      expect(collection.filtered.at(1).get('title')).toEqual('aabb');
    });
    
    it("keeps all elements when using an empty string", function () {
      collection.applyFilter('');
      expect(collection.filtered.length).toEqual(3);
      expect(collection.filtered.at(0).get('title')).toEqual('AAaa');
      expect(collection.filtered.at(1).get('title')).toEqual('BBbb');
      expect(collection.filtered.at(2).get('title')).toEqual('aabb');
    });
    
    it("is case insensitive", function () {
      collection.applyFilter('BB');
      expect(collection.filtered.length).toEqual(2);
      expect(collection.filtered.at(0).get('title')).toEqual('BBbb');
      expect(collection.filtered.at(1).get('title')).toEqual('aabb');
    });
    
    it("filters by a custom attribute", function () {
      collection.filterAttr = 'foo';
      collection.applyFilter('D');
      expect(collection.filtered.length).toEqual(1);
      expect(collection.filtered.at(0).get('title')).toEqual('BBbb');
    });
    
    it("allows multiple items with identical filter names", function () {
      collection.add({ title: 'AAaa' });
      collection.applyFilter('AAaa');
      expect(collection.filtered.length).toEqual(2);
    });
    
  });
  
});
