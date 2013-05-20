define([
  'extensions/views/filter',
  'extensions/collections/filteredcollection'
],
function (Filter, Collection) {
  
  describe("initialize", function () {
    var collection;
    beforeEach(function() {
      collection = {
        filtered: {
          on: jasmine.createSpy()
        }
      };
    });
    
    it("listens to reset events of the filtered collection", function () {
      var view = new Filter({
        collection: collection
      });
      
      expect(collection.filtered.on).toHaveBeenCalledWith('reset', view.hideShowElements, view);
    });
  });
  
  describe("hideShowElements", function () {
    var view, collection, countEl, listEl;
    beforeEach(function() {
      countEl = $('<div>');
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
        listEl: listEl,
        countEl: countEl
      });
    });
    
    it("hides elements that are not in the filtered collection", function () {
      collection.filtered.reset([ collection.at(0) ], { silent: true });
      view.hideShowElements();
      expect(collection.at(0).get('el')).not.toHaveClass('performance-hidden');
      expect(collection.at(1).get('el')).toHaveClass('performance-hidden');
      expect(collection.at(2).get('el')).toHaveClass('performance-hidden');
    });
    
    it("hides groups when all elements are hidden", function () {
      jasmine.renderView(view, function () {
        collection.filtered.reset([ collection.at(0) ], { silent: true });
        view.hideShowElements();
        expect(listEl.find('dt:eq(0)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(0)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dt:eq(1)')).toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(1)')).toHaveClass('performance-hidden');
        
        collection.filtered.reset([ collection.at(2) ], { silent: true });
        view.hideShowElements();
        expect(listEl.find('dt:eq(0)')).toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(0)')).toHaveClass('performance-hidden');
        expect(listEl.find('dt:eq(1)')).not.toHaveClass('performance-hidden');
        expect(listEl.find('dd:eq(1)')).not.toHaveClass('performance-hidden');
      });
    });
    
    it("updates the element count", function () {
      collection.filtered.reset([ collection.at(0) ], { silent: true });
      view.hideShowElements();
      expect(countEl).toHaveText('1');
    });
  });
  
  describe("render", function () {
    var collection;
    beforeEach(function() {
      collection = {
        filtered: {
          on: jasmine.createSpy()
        }
      };
    });
    
    it("populates the wrapper element with an input element", function () {
      var view = new Filter({
        collection: collection
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('input').prop('placeholder')).toBeFalsy();
        expect(view.$el.find('label')).not.toExist();
      });
    });
    
    it("populates the wrapper element with an input element and a label", function () {
      var view = new Filter({
        collection: collection,
        label: 'test label'
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('label')).toExist();
        expect(view.$el.find('label')).toHaveText('test label');
      });
    });
    
    it("populates the wrapper element with an input element and a placeholder message", function () {
      var view = new Filter({
        collection: collection,
        placeholder: 'test placeholder'
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('input')).toHaveProp('placeholder', 'test placeholder');
      });
    });
    
  });
  
  describe("events", function () {
    var collection;
    beforeEach(function() {
      collection = {
        filtered: {
          on: jasmine.createSpy()
        }
      };
    });
    
    it("listens to keyup events", function () {
      spyOn(Filter.prototype, "onKeyUp");
      var view = new Filter({
        collection: collection
      });
      jasmine.renderView(view, function () {
        view.$el.find('input').trigger('keyup');
      });
      expect(view.onKeyUp).toHaveBeenCalled();
    });
  });
  
  describe("onKeyUp", function () {
    
    var escapeKey = 27;
    
    var view, collection;
    beforeEach(function() {
      collection = new Collection([
        { id: 'AAaa', el: $('<div>') },
        { id: 'BBbb', el: $('<div>') },
        { id: 'aabb', el: $('<div>') }
      ]);
      spyOn(collection, "applyFilter");
      view = new Filter({
        collection: collection
      });
    });
    
    it("delegates filtering to the colection", function () {
      jasmine.renderView(view, function () {
        view.inputEl.val('foo');
        view.onKeyUp({});
        expect(collection.applyFilter).toHaveBeenCalledWith('foo');
      });
    });
    
    it("resets the search term on escape", function () {
      jasmine.renderView(view, function () {
        view.inputEl.val('foo');
        view.onKeyUp({
          keyCode: escapeKey
        });
        expect(collection.applyFilter).toHaveBeenCalledWith('');
        expect(view.inputEl.val()).toEqual('');
      });
    });
    
    it("blurs on escape when the search term was empty", function () {
      jasmine.renderView(view, function () {
        spyOn(view.inputEl, "blur").andCallThrough();
        view.inputEl.val('');
        view.onKeyUp({
          keyCode: escapeKey
        });
        expect(collection.applyFilter).not.toHaveBeenCalled();
        expect(view.inputEl.val()).toEqual('');
        expect(view.inputEl.blur).toHaveBeenCalled();
      });
    });
  });
});
