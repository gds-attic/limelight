define([
  'extensions/views/graph/stack',
  'extensions/collections/collection'
],
function (Stack, Collection) {
  describe("render", function() {
    
    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Stack.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("renders a stack consisting of a stroked path and a filled path for each item in the collection", function() {
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
            { a: 1, b: 3},
            { a: 4, b: 6},
            { a: 7, b: 9}
          ])
        }
      ]);
      
      var view = new Stack({
        wrapper: wrapper,
        collection: collection,
        scales: {
          y: function (x) {
            return x * 2;
          }
        },
        x: function (model, index) {
          return model.get('a') + index;
        },
        yStack: function (model, index) {
          return model.get('b') + index;
        }
      });
      view.render();
      
      var group1 = wrapper.selectAll('g.group:nth-child(1)');
      expect(group1.selectAll('path.line').attr('d')).toEqual('M1,4L5,12L9,20');
      expect(group1.selectAll('path.stack').attr('d')).toEqual('M1,4L5,12L9,20L9,0L5,0L1,0Z');
      var group2 = wrapper.selectAll('g.group:nth-child(2)');
      expect(group2.selectAll('path.line').attr('d')).toEqual('M1,10L5,26L9,42');
      expect(group2.selectAll('path.stack').attr('d')).toEqual('M1,10L5,26L9,42L9,20L5,12L1,4Z');
    });
    
  });
});
