define([
  'extensions/views/availability/tooltip',
  'extensions/models/model'
],
function (Tooltip, Model) {

  describe("Tooltip", function () {

    describe("onChangeSelected", function () {
      var el, tooltip, wrapper, model;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = Tooltip.prototype.d3.select(el[0]).append('svg').append('g');

        tooltip = new Tooltip({
          el: el,
          wrapper: wrapper,
          collection: { on: jasmine.createSpy() },
          graph: {
            valueAttr: "modelValue"
          },
          constrainToBounds: false,
          x: function (model, index) {
            return 110;
          },
          y: function (model, index) {
            return 120;
          },
          textWidth: function() {
            return 100;
          }
        });

        model = new Model({
          modelValue: "Tooltip Text"
        });
      });

      afterEach(function () {
        el.remove();
      });

      it("renders a tooltip at the position with offsets", function () {
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-text').text()).toEqual("Tooltip Text");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("Tooltip Text");
        expect(wrapper.select('text.tooltip-text').attr('transform')).toEqual("translate(3, 102)");
        expect(wrapper.select('text.tooltip-stroke').attr('transform')).toEqual("translate(3, 102)");
      });

      it("hides the tooltip when unselected", function () {
        tooltip.render();

        tooltip.onChangeSelected(null, null, model, 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).not.toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).not.toBeFalsy();

        tooltip.onChangeSelected(null, null, null, null);
        expect(wrapper.select('text.tooltip-text')[0][0]).toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).toBeFalsy();
      });

    });

  });

});