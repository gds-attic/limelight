define([
  'extensions/views/graph/xaxis'
],
function (XAxis) {
  describe("XAxis", function () {
    describe("onChangeSelected", function () {
      var el, wrapper;
      beforeEach(function() {
        el = $('<div></div>').appendTo($('body'));
        wrapper = XAxis.prototype.d3.select(el[0]).append('svg').append('g');
      });
      
      afterEach(function() {
        el.remove();
      });
      
      it("marks item as selected", function () {
        var view = new XAxis({
          collection: {
            on: jasmine.createSpy()
          },
          wrapper: wrapper,
          getScale: function () {
            return view.d3.scale.linear()
          },
          tickFormat: jasmine.createSpy().andReturn('foo'),
          graph: {
            innerWidth: 100,
            innerHeight: 100
          },
          tickValues: [2,4,6]
        });
        spyOn(view.d3.svg, "axis").andCallThrough();
        
        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(3);

        view.onChangeSelected(null, null, null, 1);
        expect(d3.select(ticks[0]).attr('class')).not.toMatch('selected');
        expect(d3.select(ticks[1]).attr('class')).toMatch('selected');
        expect(d3.select(ticks[2]).attr('class')).not.toMatch('selected');

        view.onChangeSelected(null, null, null, 2);
        expect(d3.select(ticks[0]).attr('class')).not.toMatch('selected');
        expect(d3.select(ticks[1]).attr('class')).not.toMatch('selected');
        expect(d3.select(ticks[2]).attr('class')).toMatch('selected');
      });
    });
  });
});

