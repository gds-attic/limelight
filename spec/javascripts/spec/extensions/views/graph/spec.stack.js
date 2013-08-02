define([
  'extensions/views/graph/stack',
  'extensions/collections/collection'
],
function (Stack, Collection) {
  describe("Stack component", function () {
    var el, wrapper, collection, layers;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Stack.prototype.d3.select(el[0]).append('svg').append('g');
      collection = new Collection([
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


      var stack = Stack.prototype.d3.layout.stack()
        .values(function (group) {
          return group.get('values').models;
        })
        .y(function (model, index) {
          return model.get('b') + index;
        });
      layers = stack(collection.models.slice().reverse());
    });
    
    afterEach(function() {
      el.remove();
    });
    
    describe("render", function() {
      
      it("renders a stack consisting of a stroked path and a filled path for each item in the collection", function() {
        
        var view = new Stack({
          interactive: false,
          wrapper: wrapper,
          collection: collection,
          scales: {
            y: function (x) {
              return x * 2;
            }
          },
          graph: {
            layers: layers
          },
          x: function (group, groupIndex, model, index) {
            return model.get('a') + index;
          },
          y: function (group, groupIndex, model, index) {
            return model.y + model.y0;
          },
          y0: function (group, groupIndex, model, index) {
            return model.y0;
          }
        });
        view.render();
        
        var group1 = wrapper.selectAll('g.group:nth-child(1)');
        expect(group1.selectAll('path.line').attr('d')).toEqual('M1,6L5,14L9,22');
        expect(group1.selectAll('path.stack').attr('d')).toEqual('M1,6L5,14L9,22L9,0L5,0L1,0Z');
        var group2 = wrapper.selectAll('g.group:nth-child(2)');
        expect(group2.selectAll('path.line').attr('d')).toEqual('M1,10L5,26L9,42');
        expect(group2.selectAll('path.stack').attr('d')).toEqual('M1,10L5,26L9,42L9,22L5,14L1,6Z');
      });

    });

    describe("onHover", function () {

      var view;
      beforeEach(function() {
        view = new Stack({
          interactive: false,
          wrapper: wrapper,
          collection: collection,
          scales: {
            y: function (x) {
              return x * 2;
            }
          },
          graph: {
            layers: layers
          },
          x: function (group, groupIndex, model, index) {
            return model.get('a') + index;
          },
          y: function (group, groupIndex, model, index) {
            return model.y + model.y0;
          },
          y0: function (group, groupIndex, model, index) {
            return model.y0;
          }
        });
        view.render();

        spyOn(collection, "selectItem");
      });

      it("selects the group the user is hovering over and the closest model in that group", function () {
        view.onHover({ x: 1, y: 3 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 0]);
        view.onHover({ x: 1, y: 4 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([1, 0]);
      });

      it("selects the first group and the closest model in that group when the user hovers above the topmost area", function () {
        view.onHover({ x: 1, y: -200 });
        expect(collection.selectItem).toHaveBeenCalledWith(0, 0);
      });

      it("selects the last group and the closest model in that group when the user hovers below the bottommost area", function () {
        view.onHover({ x: 1, y: 200 });
        expect(collection.selectItem).toHaveBeenCalledWith(1, 0);
      });

      it("optionally toggles selection when the new item is the currently selected item", function () {
        view.collection.selectedIndex = 0;
        view.collection.selectedItem = view.collection.at(0);
        view.collection.at(0).get('values').selectItem(2);
        view.onHover({ x: 7, y: 8, toggle: true });
        expect(collection.selectItem.mostRecentCall.args).toEqual([null, null]);
      });
    });
  });
});
