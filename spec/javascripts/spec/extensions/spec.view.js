define([
  'extensions/view',
  'backbone'
],
function (View, Backbone) {
  describe("View", function() {
    it("inherits from Backbone.View", function() {
      var view = new View();
      expect(view instanceof Backbone.View).toBe(true);
    });

    describe ("numberListFormatter", function() {
      describe("when all label are lower than 1000", function() {
        it("should format all labels as units", function() {
          var formatter = View.prototype.numberListFormatter([0, 50, 100, 150]);
          expect(formatter(50)).toBe("50");
        });
      });

      describe("when all label are lower than 1,000,000", function() {
        it("should format all labels as thousands", function() {
          var formatter = View.prototype.numberListFormatter([0, 1000, 2000, 3000]);
          expect(formatter(2000)).toBe("2k");
        });

        it("should format with decimals if any label requires it", function() {
          var formatter = View.prototype.numberListFormatter([0, 500, 1000, 1500]);
          expect(formatter(500)).toBe("0.5k");
          expect(formatter(1000)).toBe("1.0k");
          expect(formatter(1500)).toBe("1.5k");
        });
      })

      describe("when labels go over 1,000,000", function() {
        it("should format all labels as million", function() {
          var formatter = View.prototype.numberListFormatter([0, 1000000, 2000000, 3000000]);
          expect(formatter(2000000)).toBe("2m");
        });

        it("should format with decimals if any label requires it", function() {
          var formatter = View.prototype.numberListFormatter([0, 500000, 1000000, 1500000]);
          expect(formatter(500000)).toBe("0.5m");
          expect(formatter(1000000)).toBe("1.0m");
          expect(formatter(1500000)).toBe("1.5m");
        });
      });

      describe("when applied to zero", function() {
        it("should always format zero as '0'", function() {
          expect((View.prototype.numberListFormatter([0,      50,     100]))(0)).toEqual("0");
          expect((View.prototype.numberListFormatter([0,     500,    1000]))(0)).toEqual("0");
          expect((View.prototype.numberListFormatter([0,    1000,    2000]))(0)).toEqual("0");
          expect((View.prototype.numberListFormatter([0,  500000, 1000000]))(0)).toEqual("0");
          expect((View.prototype.numberListFormatter([0, 1000000, 2000000]))(0)).toEqual("0");
        });
      });

    });

    describe("prop", function() {
      it("retrieves an object property", function() {
        var view = new View();
        view.testProp = { foo: 'bar' };
        expect(view.prop('testProp')).toEqual({ foo: 'bar' });
      });
      
      it("retrieves an object method result", function() {
        var view = new View();
        view.otherProp = { foo: 'bar' };
        view.testProp = function () {
          return this.otherProp;
        };
        expect(view.prop('testProp')).toEqual({ foo: 'bar' });
      });
      
      it("retrieves property from another object", function() {
        var view = new View();
        var anotherObject = {
          testProp: { foo: 'bar' }
        };
        expect(view.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });
      
      it("retrieves method result from another object", function() {
        var view = new View();
        var anotherObject = {
          otherProp: { foo: 'bar' },
          testProp: function () {
            return this.otherProp;
          }
        };
        expect(view.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });
    });
  });
});
