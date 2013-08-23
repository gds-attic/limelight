define([
    'backbone',
    'moment',
    'modernizr'
],
function (Backbone, moment, Modernizr) {
    var View = Backbone.View.extend({
      
      moment: moment,
      modernizr: Modernizr,
    
      initialize: function (options) {
        _.extend(this, options);
        Backbone.View.prototype.initialize.apply(this, arguments);
      },
      
      keys: {
        escape: 27
      },
      
      magnitudes: {
          million:  {value: 1e6, threshold: 499500, suffix:"m"},
          thousand: {value: 1e3, threshold: 499.5,  suffix:"k"},
          unit:     {value: 1,   threshold: 0,      suffix:""}
      },

      magnitudeFor: function (value) {
          if (value >= 1e6) return this.magnitudes.million;
          if (value >= 1e3) return this.magnitudes.thousand;
          return this.magnitudes.unit;
      },

      format: function (value, magnitude, decimalPlaces) {
          return (value / magnitude.value).toFixed(decimalPlaces || 0).toString() + magnitude.suffix;
      },

      /**
       * Returns a number formatting function whose actual format depends on the values passed as argument.
       * The formatter can then be used to format all the number in the series applying the same format, regardless of the
       * individual values. This is especially useful for graph axes, where a homogeneous formatting of the labels is
       * required.
       *
       * @param values
       * @return {Function}
       */
      numberListFormatter: function (values) {
        function isAnExactMultipleOf(magnitude) {
          return function(n) { return n % magnitude === 0; };
        }

        var max = values.reduce(function(a,b) {return a > b ? a : b});
        var magnitude = this.magnitudeFor(max);
        var decimalPlaces;
        if (max === magnitude.value) {
          decimalPlaces = 1;
        } else {
          decimalPlaces = values.every(isAnExactMultipleOf(magnitude.value))? 0 : 1;
        }
        
        var format = this.format;
        return function(value) {
          if (value === 0) return "0";
          return format(value, magnitude, decimalPlaces);
        };
      },

      /**
       * Returns an object describing evenly spaced, nice tick values given an extent and a minimum tick count.
       * The returned object will include the values, extent and step of the ticks.
       * The extent may be extended to include the next nice tick value.
       *
       * @param extent
       * @param minimumTickCount
       * @return {Object}
       */
      calculateLinearTicks: function(extent, minimumTickCount) {
        if (extent[0] >= extent[1]) {
          throw new Error("Upper bound must be larger than lower.");
        }
        var targetTickCount = minimumTickCount - 1,
            span = extent[1] - extent[0],
            step = Math.pow(10, Math.floor(Math.log(span / targetTickCount) / Math.LN10)),
            err = targetTickCount / span * step;

        // Filter ticks to get closer to the desired count.
        if (err <= .15) step *= 10;
        else if (err <= .35) step *= 5;
        else if (err <= .75) step *= 2;

        // Round start and stop values to step interval.
        var first = Math.floor(extent[0] / step) * step,
            last = Math.ceil(extent[1] / step) * step,
            lastInclusive = last + step / 2;

        return {
          values:d3.range.apply(d3, [first, lastInclusive, step]),
          extent:[first, last],
          step:step
        };
      },

      /**
       * Format a number according to its magnitude.
       *
       * Numbers are rendered with a suffix indicating the magnitude
       * and with at least 3 total digits.
       *
       * Examples:
       *
       * formatNumericLabel(    123) -> 123
       * formatNumericLabel(   1234) -> 1.23k
       * formatNumericLabel(  12345) -> 12.3k
       * formatNumericLabel( 123456) -> 123k
       * formatNumericLabel(1234567) -> 1.23m
       *
       * This function is more complicated than one would think it need be for
       * two reasons:
       * - numbers in javascript are represented as IEEE 745 floating point, and
       *   therefore they have approximation issues that make unpredictable the
       *   rounding of limit numbers; this could be ignored, making the algorithm
       *   simpler, if that level of accuracy is not required
       * - numbers below 1000 show only meaningful decimal digits, while numbers
       *   above 1000 always show the decimal digits; ex: 1 -> 1; 1000 -> 1.00k
       *
       * If we can relax these two reasons, the algorithm can become much simpler.
       * See for example View.prototype.format for a simpler alternative.
       */
      formatNumericLabel: function(value) {
        if (value === 0) return "0";

        var magnitudeOf = function(number) {
          if (Math.abs(number) >= 499500) return View.prototype.magnitudes.million;
          if (Math.abs(number) >= 499.5) return View.prototype.magnitudes.thousand;
          return View.prototype.magnitudes.unit;
        }

        var decimalDigits = function(number, magnitude) {
          if (Math.abs(number) < magnitude.value * 10) return 2
          if (Math.abs(number) < magnitude.value * 100) return 1
          return 0;
        }

        var magnitude = magnitudeOf(value);
        var digits = decimalDigits(value, magnitude);
        var roundingFactor = Math.pow(10, digits);

        var roundedValue = Math.round(value * roundingFactor / magnitude.value) / roundingFactor;

        if (magnitude === View.prototype.magnitudes.unit) {
          // Why are we formatting decimal digits differently for numbers below 1000?
          return roundedValue.toString() + magnitude.suffix;
        }
        return roundedValue.toFixed(digits) + magnitude.suffix;
      },

      formatPercentage: function (fraction, numDecimals) {
        if (isNaN(fraction) || !_.isNumber(fraction)) {
          return fraction;
        }
        numDecimals = numDecimals || 0;
        return (100 * fraction).toFixed(numDecimals) + '%';
      },
      
      /**
       * Convenience method, gets object property or method result. The method
       * is passed no arguments and is executed in the object context.
       * @param {String} prop Name of object property or method.
       * @param {Object} [obj=this] Object to inspect.
       */
      prop: function(prop, obj) {
        obj = obj || this;
        return _.isFunction(obj[prop]) ? obj[prop].call(obj) : obj[prop];
      }
    });
    
    return View;
});
