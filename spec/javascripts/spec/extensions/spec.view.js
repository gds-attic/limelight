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
      })
    });
  });
});
