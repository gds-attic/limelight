define([
    'backbone',
    'moment'
],
function (Backbone, moment) {
    var View = Backbone.View.extend({
      
      moment: moment,
      
      magnitudes: {
          million:  {value: 1e6, suffix:"m"},
          thousand: {value: 1e3, suffix:"k"},
          unit:     {value: 1, suffix:""}
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
        function isAnExactMultipleOf(value) {
          return function(n) { return n % value === 0; };
        }

        var max = values.reduce(function(a,b) {return a > b ? a : b});
        var magnitude = this.magnitudeFor(max);
        var decimalPlaces = values.every(isAnExactMultipleOf(magnitude.value))? 0 : 1;
        
        var format = this.format;
        return function(value) {
          if (value === 0) return "0";
          return format(value, magnitude, decimalPlaces);
        };
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
