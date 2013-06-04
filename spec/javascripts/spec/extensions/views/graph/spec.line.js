define([
  'extensions/views/graph/line',
  'extensions/collections/collection'
],
function (Line, Collection) {
  
  describe("Line Component", function () {
    var el, wrapper, collection;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Line.prototype.d3.select(el[0]).append('svg').append('g');
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
            { a: 1, b: 3, c: 3},
            { a: 4, b: 6, c: 6},
            { a: 7, b: 9, c: 9}
          ])
        }
      ]);
      collection.getCurrentSelection = jasmine.createSpy().andReturn({
        selectedGroup: collection.at(0),
        selectedGroupIndex: 0,
        selectedModel: { a: 1 },
        selectedModelIndex: 2,
      });
      spyOn(Line.prototype, "onChangeSelected");
    });

    afterEach(function() {
      el.remove();
    });

    describe("render", function() {

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

      it("renders paths for each group in the collection in reverse order with sections for each point in the timeseries", function() {
        var view = new Line({
          wrapper: wrapper,
          collection: collection,
          x: function (model, index, group, groupIndex) {
            return model.get('a') + index;
          },
          y: function (model, index, group, groupIndex) {
            var attr = group.get('testAttr');
            return model.get(attr) + index;
          }
        });
        view.render();

        expect(wrapper.select('g.group:nth-child(1) path').attr('d')).toEqual('M1,3L5,7L9,11');
        expect(wrapper.select('g.group:nth-child(2) path').attr('d')).toEqual('M1,2L5,6L9,10');
      });

      it("highlights the current selection", function () {
        var view = new Line({
          wrapper: wrapper,
          collection: collection,
          x: function (model, index, group, groupIndex) {
            return model.get('a') + index;
          },
          y: function (model, index, group, groupIndex) {
            var attr = group.get('testAttr');
            return model.get(attr) + index;
          }
        });

        view.render();

        expect(view.onChangeSelected).toHaveBeenCalledWith(
          collection.at(0), 0, { a: 1 }, 2
        );
      });
    });

    describe("onChangeSelected", function () {

      var view;
      beforeEach(function() {
        view = new Line({
          wrapper: wrapper,
          collection: collection,
          x: function (model, index, group, groupIndex) {
            return model.get('a') + index;
          },
          y: function (model, index, group, groupIndex) {
            var attr = group.get('testAttr');
            return model.get(attr) + index;
          }
        });

        view.render();
      });

      it("highlights the selected group", function () {
        view.onChangeSelected.originalValue.call(view, collection.at(1), 1, null, null);
        expect(view.componentWrapper.select('path.line0').attr('class').indexOf('selected')).toBe(-1);
        expect(view.componentWrapper.select('path.line1').attr('class').indexOf('selected')).not.toBe(-1);
        expect(view.componentWrapper.selectAll('.selectedIndicator')[0].length).toEqual(0);
        view.onChangeSelected.originalValue.call(view, collection.at(0), 0, null, null);
        expect(view.componentWrapper.select('path.line0').attr('class').indexOf('selected')).not.toBe(-1);
        expect(view.componentWrapper.select('path.line1').attr('class').indexOf('selected')).toBe(-1);
      });

      it("renders a selection indicator on the selected item", function () {
        view.onChangeSelected.originalValue.call(view, collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.componentWrapper.select('path.line1').attr('class').indexOf('selected')).not.toBe(-1);
        expect(view.componentWrapper.selectAll('.selectedIndicator')[0].length).toEqual(1);
        expect(view.componentWrapper.selectAll('.selectedIndicator').attr('cx')).toEqual('5');
        expect(view.componentWrapper.selectAll('.selectedIndicator').attr('cy')).toEqual('7');
      });
    });

    describe("getDistanceAndClosestModel", function () {
      var view;
      beforeEach(function() {
        view = new Line({
          wrapper: wrapper,
          collection: collection,
          x: function (model) {
            return model.get('a');
          },
          y: function (model) {
            return model.get('b');
          }
        });
      });

      it("calculates distance to an interpolated position between points and picks closest model", function () {
        var res = view.getDistanceAndClosestModel(collection.at(0), {
          x: 2.5,
          y: 10
        });
        expect(res.dist).toEqual(6.5);
        expect(res.index).toEqual(1);

        var res = view.getDistanceAndClosestModel(collection.at(0), {
          x: 7,
          y: 8
        });
        expect(res.dist).toEqual(0);
        expect(res.index).toEqual(2);
      });
    });

    describe("onHover", function () {

      var view;
      beforeEach(function() {
        view = new Line({
          wrapper: wrapper,
          collection: collection,
          x: function (model) {
            return model.get('a');
          },
          y: function (model) {
            return model.get('b');
          }
        });
        spyOn(collection, "selectItem");
      });

      it("selects the closest item in the closest group", function () {
        view.onHover({
          x: 7,
          y: 8
        });
        expect(collection.selectItem).toHaveBeenCalledWith(0, 2);
      });

      it("keeps the current group when possible", function () {
        view.collection.selectedIndex = 1;
        view.onHover({
          x: 7,
          y: 8
        });
        expect(collection.selectItem).toHaveBeenCalledWith(1, 2);
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
