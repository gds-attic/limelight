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
    
    it("renders paths for each group in the collection with sections for each point in the timeseries", function() {
      var collection = new Collection([
        {
          testAttr: 'b',
          values: new Collection([
            { a: 1, b: 2},
            { a: 4, b: 5},
            { a: 7, b: 8}
          ])
        },
        {
          testAttr: 'c',
          values: new Collection([
            { a: 1, c: 3},
            { a: 4, c: 6},
            { a: 7, c: 9}
          ])
        }
      ]);
      
      var view = new Line({
        wrapper: wrapper,
        collection: collection,
        x: function (group, collection, point, index) {
          return point.get('a') + index;
        },
        y: function (group, collection, point, index) {
          var attr = group.get('testAttr');
          return point.get(attr) + index;
        }
      });
      view.render();
      
      var paths = wrapper.selectAll('path');
      expect(wrapper.selectAll('path:nth-child(1)').attr('d')).toEqual('M1,2L5,6L9,10');
      expect(wrapper.selectAll('path:nth-child(2)').attr('d')).toEqual('M1,3L5,7L9,11');
    });
    
  });
});
