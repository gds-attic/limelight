define([
  'extensions/views/view',
  'backbone'
],
function (View, Backbone) {
  describe("View", function() {
    it("inherits from Backbone.View", function() {
      var view = new View();
      expect(view instanceof Backbone.View).toBe(true);
    });

    describe("numberListFormatter", function() {
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
        
        it("should format with decimals when the max value matches the magnitude", function() {
          var formatter = View.prototype.numberListFormatter([0, 1000]);
          expect(formatter(200)).toBe("0.2k");
          expect(formatter(400)).toBe("0.4k");
          expect(formatter(800)).toBe("0.8k");
          expect(formatter(1000)).toBe("1.0k");
        });
      });

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

    describe("calculateLinearTicks", function() {
      describe("extending the extent", function() {
        it("should extend the top limit beyond the max", function() {
          var ticks = View.prototype.calculateLinearTicks([0, 7000], 5);
          expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
          expect(ticks.extent).toEqual([0, 8000]);
          expect(ticks.step).toEqual(2000);
        });

        it("should extend the bottom limit beyond the minimum", function() {
          var ticks = View.prototype.calculateLinearTicks([10, 8000], 5);
          expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
          expect(ticks.extent).toEqual([0, 8000]);
          expect(ticks.step).toEqual(2000);
        });
      });

      describe("number of ticks", function() {
        var extent = [0, 61241];
        it("should increase the number of ticks if it allows nicer ticks", function() {
          var ticks = View.prototype.calculateLinearTicks(extent, 2);
          expect(ticks.values).toEqual([0, 50000, 100000]);
        });
        it("should not change the number of ticks if it does not need to", function() {
          var ticks = View.prototype.calculateLinearTicks(extent, 3);
          expect(ticks.values).toEqual([0, 50000, 100000]);
        });
        it("should decrease the number of ticks if it allows nicer ticks", function() {
          var extent = [0, 4000];
          var ticks = View.prototype.calculateLinearTicks(extent, 7);
          expect(ticks.values).toEqual([0, 1000, 2000, 3000, 4000])
        });
      });

      // Because this function is designed to work with various and overlapping
      describe("various ranges", function() {
        it("should return valid ticks for 0-5 with 20 ticks", function() {
          var ticks = View.prototype.calculateLinearTicks([0, 5], 20);
          expect(ticks.values).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5]);
          expect(ticks.extent).toEqual([0, 5]);
          expect(ticks.step).toEqual(0.2);
        });

        it("should return valid ticks for 0-1000 with 10 ticks", function() {
          var ticks = View.prototype.calculateLinearTicks([0, 1000], 10);
          expect(ticks.values).toEqual([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
          expect(ticks.extent).toEqual([0, 1000]);
          expect(ticks.step).toEqual(100);
        });

        it("should return valid ticks for 0-8000 with 9 ticks", function() {
          var ticks = View.prototype.calculateLinearTicks([0, 5000], 7);
          expect(ticks.values).toEqual([0, 1000, 2000, 3000, 4000, 5000]);
          expect(ticks.extent).toEqual([0, 5000]);
          expect(ticks.step).toEqual(1000);
        });

        it("should return valid ticks for 900k-1m with 5 ticks", function() {
          var ticks = View.prototype.calculateLinearTicks([9.5e5, 1e6], 5);
          expect(ticks.values).toEqual([950000, 960000, 970000, 980000, 990000, 1000000]);
          expect(ticks.extent).toEqual([950000, 1000000]);
          expect(ticks.step).toEqual(10000);
        });
      });

      describe("invalid argument handling", function() {
        it("should raise an exception if lower bound is > upper bound", function() {
          expect(function() { View.prototype.calculateLinearTicks([0, -1], 5)})
              .toThrow(new Error("Upper bound must be larger than lower."));
        });
        it("should raise an exception if lower bound is == upper bound", function() {
          expect(function() { View.prototype.calculateLinearTicks([0, 0], 5)})
              .toThrow(new Error("Upper bound must be larger than lower."));
        });
      });
    });

    describe("formatNumericLabel", function() {
      
      var formatNumericLabel = View.prototype.formatNumericLabel;
      
      it("should display entire numbers from 0 to 499", function() {
        expect(formatNumericLabel(0)).toBe('0');
        expect(formatNumericLabel(1)).toBe('1');
        expect(formatNumericLabel(9)).toBe('9');
        expect(formatNumericLabel(10)).toBe('10');
        expect(formatNumericLabel(77)).toBe('77');
        expect(formatNumericLabel(100)).toBe('100');
        expect(formatNumericLabel(398)).toBe('398');
        expect(formatNumericLabel(499)).toBe('499');
      });

      it("should display numbers from 500 to 499499 as fractions of 1k", function() {
        expect(formatNumericLabel(500)).toBe('0.50k');
        expect(formatNumericLabel(777)).toBe('0.78k');
        expect(formatNumericLabel(994)).toBe('0.99k');
        expect(formatNumericLabel(995)).toBe('1.00k');
        expect(formatNumericLabel(996)).toBe('1.00k');
        expect(formatNumericLabel(999)).toBe('1.00k');
        expect(formatNumericLabel(1000)).toBe('1.00k');
        expect(formatNumericLabel(1005)).toBe('1.01k');
        expect(formatNumericLabel(1006)).toBe('1.01k');
        expect(formatNumericLabel(100000)).toBe('100k');
        expect(formatNumericLabel(234568)).toBe('235k');
        expect(formatNumericLabel(499499)).toBe('499k');
      });

      it("should display numbers from 499500 and above as fractions of 1m", function() {
        expect(formatNumericLabel(499500)).toBe('0.50m');
        expect(formatNumericLabel(500000)).toBe('0.50m');
        expect(formatNumericLabel(777777)).toBe('0.78m');
        expect(formatNumericLabel(994499)).toBe('0.99m');
        expect(formatNumericLabel(994999)).toBe('0.99m');
        expect(formatNumericLabel(995000)).toBe('1.00m');
        expect(formatNumericLabel(995001)).toBe('1.00m');
        expect(formatNumericLabel(999900)).toBe('1.00m');
        expect(formatNumericLabel(1000000)).toBe('1.00m');
        expect(formatNumericLabel(1005000)).toBe('1.01m');
        expect(formatNumericLabel(1005001)).toBe('1.01m');
        expect(formatNumericLabel(100000000)).toBe('100m');
        expect(formatNumericLabel(234568234)).toBe('235m');
        expect(formatNumericLabel(499499499)).toBe('499m');
      });

      describe("generative tests", function() {
        var createTests = function(start, end, increment, format) {
          it("should correctly format numbers in the range " + start + "-" + end, function() {
            for (var i = start; i < end; i+=increment) {
              createExpectation(i, format(i));
            }
          })
        },
        createExpectation = function(i, expectation) {
          expect(formatNumericLabel(i)).toBe(expectation);
        };


        createTests(0,   20,   1, function(i) { return i.toString(); });
        createTests(500, 600,  1, function(i) { return "0." + Math.round(i / 10) + "k"; });
        createTests(980, 995,  1, function(i) { return "0." + Math.round(i / 10) + "k"; });
        createTests(995, 1000, 1, function(i) {
          var expected = "1." + (Math.round(i / 10) - 100);
          if (expected.length < 4) {
            expected += "0";
          }
          return expected + "k";
        });
        createTests(1000,   1100,    1,    function(i) { return (Math.round(i / 10) / 100).toPrecision(3) + "k"; });
        createTests(9400,   10000,   10,   function(i) { return (Math.round(i / 10) / 100).toPrecision(3) + "k"; });
        createTests(10000,  11500,   10,   function(i) { return (Math.round(i / 100) / 10).toPrecision(3) + "k"; });
        createTests(50450,  50500,   10,   function(i) { return (Math.round(i / 100) / 10).toPrecision(3) + "k"; });
        createTests(100000, 101000,  10,   function(i) { return Math.round(i / 1000).toPrecision(3) + "k"; });
        createTests(499000, 499500,  100,  function(i) { return Math.round(i / 1000).toPrecision(3) + "k"; });
        createTests(499500, 500000,  100,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
        createTests(504500, 506000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
        createTests(700000, 800000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
        createTests(994499, 995000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
        createTests(995000, 999999,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(3) + "m"; });
        createTests(999999, 1999999, 10000, function(i) { return (Math.round(i / 10000) / 100).toPrecision(3) + "m"; });
      });

      describe("rounding changes", function () {
        it("should now show millions to two decimal places", function () {
          expect(formatNumericLabel(1220000)).toBe("1.22m");
        });

        it("should show all millions to two decimal places", function () {
          expect(formatNumericLabel(1000000)).toBe("1.00m");
          expect(formatNumericLabel(1010000)).toBe("1.01m");
          expect(formatNumericLabel(9099000)).toBe("9.10m");
          expect(formatNumericLabel(1009900)).toBe("1.01m");
        })
      });
    });

    describe("formatPercentage", function () {
      var format = View.prototype.formatPercentage;

      it("formats a number as percentage string with no decimals", function () {
        expect(format(0.011)).toEqual('1%');
        expect(format(1)).toEqual('100%');
      });

      it("formats a number as percentage string with set number of decimals", function () {
        expect(format(0.011, 2)).toEqual('1.10%');
        expect(format(1, 2)).toEqual('100.00%');
      });

      it("does not try to format invalid inputs", function () {
        expect(format(null)).toBe(null);
        expect(format(undefined)).toBe(undefined);
        expect(isNaN(format(NaN))).toBe(true);
        expect(format('foo')).toBe('foo');
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
