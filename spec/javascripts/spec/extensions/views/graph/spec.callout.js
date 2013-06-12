define([
  'extensions/views/graph/callout',
  'extensions/models/model'
],
function (Callout, Model) {
  describe("Callout Component", function () {
    
    describe("render", function () {
      it("renders the callout element", function () {
        
      });
    });
    
    describe("onChangeSelected", function () {
      
      var callout, model;
      beforeEach(function() {
        
        model = new Model({
          a: 20,
          b: 30,
          c: 'foo'
        })
        callout = new Callout({
          collection: { on: jasmine.createSpy() },
          graph: {
            scaleFactor: jasmine.createSpy()
          },
          margin: {
            left: 10,
            top: 20
          },
          x: function (model, index) {
            return model.get('a');
          },
          y: function (model, index) {
            return model.get('b');
          },
          renderContent: function (el, group, groupIndex, model, index) {
            el.html(model.get('c'));
          }
        });
        spyOn(callout, "renderContent").andCallThrough();
        callout.render();
      });
      
      it("hides when only a group but no item is selected", function () {
        callout.onChangeSelected('group', 1, null, null);
        expect(callout.calloutEl).toHaveClass('performance-hidden');
        expect(callout.renderContent).not.toHaveBeenCalled();
      });
      
      it("renders a callout at the correct position when graph is not scaled", function () {
        callout.graph.scaleFactor.andReturn(1);
        callout.onChangeSelected('group', 1, model, 2);
        expect(callout.renderContent).toHaveBeenCalledWith(
          callout.calloutEl, 'group', 1, model, 2
        );
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl).toHaveText('foo');
        expect(callout.calloutEl.css('left')).toEqual('37px'); // left margin + result of x() + offsetX
        expect(callout.calloutEl.css('top')).toEqual('57px'); // right margin + result of y() + offsetY
      });
      
      it("renders a callout at the correct position when graph is scaled", function () {
        callout.graph.scaleFactor.andReturn(.5);
        callout.onChangeSelected('group', 1, model, 2);
        expect(callout.renderContent).toHaveBeenCalledWith(
          callout.calloutEl, 'group', 1, model, 2
        );
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl).toHaveText('foo');
        expect(callout.calloutEl.css('left')).toEqual('22px'); // (left margin + result of x()) * scaleFactor + offsetX
        expect(callout.calloutEl.css('top')).toEqual('32px'); // (right margin + result of y()) * scaleFactor + offsetY
      });
    });
    
    
    describe("applyPivot", function() {

      var params, box, basePos;
      beforeEach(function() {
        basePos = {
          x: 400,
          y: 400
        }

        params = {
          content:'test',
          callback: jasmine.createSpy()
        };

        box = new Callout({
          collection: { on: jasmine.createSpy() },
          calloutEl: {
            width: jasmine.createSpy().andReturn(30),
            height: jasmine.createSpy().andReturn(20)
          }
        });
      });

      it("aligns the callout to the bottom left corner", function() {
        var pivot = {
          horizontal: 'left',
          vertical: 'bottom',
          el: box.calloutEl
        };
        var pos = box.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(400);
        expect(pos.y).toEqual(380);
      });

      it("aligns the callout to the top right corner", function() {
        var pivot = {
          horizontal: 'right',
          vertical: 'top',
          el: box.calloutEl
        };
        var pos = box.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(370);
        expect(pos.y).toEqual(400);
      });

      it("aligns the callout to the bottom left corner with offset", function() {
        var pivot = {
          horizontal: 'left',
          vertical: 'bottom',
          xOffset: 13,
          yOffset: 12,
          el: box.calloutEl
        };
        var pos = box.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(413);
        expect(pos.y).toEqual(392);
      });

      it("aligns the callout to the top right corner with offset", function() {
        var pivot = {
          horizontal: 'right',
          vertical: 'top',
          xOffset: 13,
          yOffset: 12,
          el: box.calloutEl
        };
        var pos = box.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(383);
        expect(pos.y).toEqual(412);
      });

      describe("contrain to bounds", function() {
        var pivot;
        beforeEach(function() {
          pivot = {
            horizontal: 'left',
            vertical: 'bottom',
            xOffset: 13,
            yOffset: 12,
            constrainToBounds: true,
            el: box.calloutEl
          };
        });

        it("reverses horizontal direction if it overflows the bounds element", function() {
          var bounds = {
            width: 442,
            height: 500
          };
          var pos = box.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(357);
          expect(pos.y).toEqual(392);
        });

        it("does not reverse horizontal direction if it does not overflow the bounds element", function() {
          var bounds = {
            width: 443,
            height: 500
          };
          var pos = box.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(392);
        });

        it("reverses vertical direction if it overflows the bounds element", function() {
          var bounds = {
            width: 443,
            height: 403
          };
          var pos = box.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(388);
        });

        it("does not reverse vertical direction if it does overflow the bounds element", function() {
          var bounds = {
            width: 443,
            height: 448
          };
          var pos = box.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(392);
        });
      });

    });

    describe("positionToFraction", function() {

      var positionToFraction = Callout.prototype.positionToFraction;

      it("converts logical CSS positions to fractions", function() {
        expect(positionToFraction('top')).toEqual(0);
        expect(positionToFraction('left')).toEqual(0);
        expect(positionToFraction('centre')).toEqual(.5);
        expect(positionToFraction('center')).toEqual(.5);
        expect(positionToFraction('middle')).toEqual(.5);
        expect(positionToFraction('bottom')).toEqual(1);
        expect(positionToFraction('right')).toEqual(1);
        expect(positionToFraction('foo')).toBe(null);
      });

      it("converts percentage values to fractions", function() {
        expect(positionToFraction('0%')).toEqual(0);
        expect(positionToFraction('50%')).toEqual(.5);
        expect(positionToFraction('100%')).toEqual(1);
        expect(positionToFraction('11%')).toEqual(.11);
      });

      it("limits the range of percentages to fractions", function() {
        expect(positionToFraction('-30%')).toEqual(0);
        expect(positionToFraction('101%')).toEqual(1);
      });

      it("limits the range of numbers to fractions", function() {
        expect(positionToFraction(-1)).toEqual(0);
        expect(positionToFraction(1.3)).toEqual(1);
      });

      it("leaves fractions untouched", function() {
        expect(positionToFraction(0)).toEqual(0);
        expect(positionToFraction(.4)).toEqual(.4);
        expect(positionToFraction(.8)).toEqual(.8);
        expect(positionToFraction(1)).toEqual(1);
      });
    });


    describe("offsetFromTopLeft", function() {
      var box, el;
      beforeEach(function() {

        box = new Callout({
          collection: { on: jasmine.createSpy() }
        });
        el = {
          width: jasmine.createSpy().andReturn(400),
          height: jasmine.createSpy().andReturn(300)
        }
        spyOn(box, "positionToFraction").andCallThrough();
      });

      it("returns the offset from the top left corner", function() {
        var point = box.offsetFromTopLeft(el, 'left', 'top');
        expect(point.x).toEqual(0);
        expect(point.y).toEqual(0);

        expect(box.positionToFraction).toHaveBeenCalledWith('left');
        expect(box.positionToFraction).toHaveBeenCalledWith('top');

        point = box.offsetFromTopLeft(el, 'centre', 'centre');
        expect(point.x).toEqual(200);
        expect(point.y).toEqual(150);

        point = box.offsetFromTopLeft(el, 'right', 'bottom');
        expect(point.x).toEqual(400);
        expect(point.y).toEqual(300);

      });
    });

  });
});
