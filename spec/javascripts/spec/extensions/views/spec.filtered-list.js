define([
  'extensions/collections/filteredcollection',
  'extensions/views/filtered-list'
],
function (Collection, Filter) {
  describe("CollectionFilter", function () {
    
    var view, collection, listEl;
    beforeEach(function() {
      var el1 = $('<li></li>');
      var el2 = $('<li></li>');
      var el3 = $('<li></li>');
      listEl = $('<dl><dt>One</dt><dd><ol></ol></dd><dt>Two</dt><dd><ol></ol></dd></dl>');
      listEl.find('ol:eq(0)').append(el1, el2);
      listEl.find('ol:eq(1)').append(el3);
      collection = new Collection([
        { id: 'AAaa', el: el1 },
        { id: 'BBbb', el: el2 },
        { id: 'aabb', el: el3 }
      ]);
      view = new Filter({
        collection: collection,
        el: listEl
      });
    });
    
    it("hides elements that are not in the filtered collection", function () {
      collection.filtered.reset([ collection.at(0) ]);
      expect(collection.at(0).get('el')).not.toHaveClass('performance-hidden');
      expect(collection.at(1).get('el')).toHaveClass('performance-hidden');
      expect(collection.at(2).get('el')).toHaveClass('performance-hidden');
    });
    
    it("hides groups when all elements are hidden", function () {
      jasmine.renderView(view, function () {
        collection.filtered.reset([ collection.at(0) ]);
        expect(listEl.find('dt:eq(0)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(0)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dt:eq(1)')).toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(1)')).toHaveClass('performance-hidden');
        
        collection.filtered.reset([ collection.at(2) ]);
        expect(listEl.find('dt:eq(0)')).toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(0)')).toHaveClass('performance-hidden');
        expect(listEl.find('dt:eq(1)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(1)')).not.toHaveClass('performance-hidden');
      });
    });
  });
});
