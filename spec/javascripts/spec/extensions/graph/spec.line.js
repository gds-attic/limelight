define([
  'extensions/graph/line',
  'extensions/collection'
],
function (Line, Collection) {
  describe("render", function() {
    
    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Line.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("requires an 'x' definition", function() {
      expect(function () {
        var view = new Line({
          wrapper: wrapper,
          y: function () {}
        });
        view.render();
      }).toThrow();
    });
    
    it("requires an 'y' definition", function() {
      expect(function () {
        var view = new Line({
          wrapper: wrapper,
          x: function () {}
        });
        view.render();
      }).toThrow();
    });
    
    it("renders a path with sections for each model in the collection", function() {
      
      var collection = new Collection([
        { a: 1, b: 2 },
        { a: 3, b: 4 },
        { a: 5, b: 6 }
      ]);
      
      var view = new Line({
        wrapper: wrapper,
        collection: collection,
        x: function (model, index) {
          return model.get('a') + index;
        },
        y: function (model, index) {
          return model.get('b') + index;
        }
      });
      view.render();
      
      expect(wrapper.select('path').attr('d')).toEqual('M1,2L4,5L7,8');
    });
    
    it("renders paths for each model in the meta collection with sections for each model in the collection", function() {
      var collection = new Collection([
        { a: 1, b: 2, c: 3 },
        { a: 4, b: 5, c: 6 },
        { a: 7, b: 8, c: 9 }
      ]);
      
      collection.meta = new Collection([
        {
          testAttr: 'b'
        },
        {
          testAttr: 'c'
        }
      ]);
      
      var view = new Line({
        wrapper: wrapper,
        collection: collection,
        x: function (metaModel, model, index) {
          return model.get('a') + index;
        },
        y: function (metaModel, model, index) {
          var attr = metaModel.get('testAttr');
          return model.get(attr) + index;
        }
      });
      view.render();
      
      var paths = wrapper.selectAll('path');
      expect(wrapper.selectAll('path:nth-child(1)').attr('d')).toEqual('M1,2L5,6L9,10');
      expect(wrapper.selectAll('path:nth-child(2)').attr('d')).toEqual('M1,3L5,7L9,11');
    });
    
  });
});
