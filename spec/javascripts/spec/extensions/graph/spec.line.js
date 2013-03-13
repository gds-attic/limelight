define([
  'extensions/graph/line'
],
function (Line) {
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
      
      var collection = {
        models: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
          { a: 5, b: 6 }
        ]
      };
      
      var view = new Line({
        wrapper: wrapper,
        collection: collection,
        x: function (model) {
          return model.a;
        },
        y: function (model) {
          return model.b;
        }
      });
      view.render();
      
      expect(wrapper.select('path').attr('d')).toEqual('M1,2L3,4L5,6');
    });
    
  });
});
