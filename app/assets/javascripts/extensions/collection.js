define([
  'jquery',
  'backbone',
  'extensions/model',
  'moment'
],
function ($, Backbone, Model, moment) {
  
  // get base URL for Backdrop instance (with trailing slash if missing)
  var baseUrl = $('#wrapper').data('backdrop-url');
  if (baseUrl) {
    baseUrl = baseUrl.replace(/\/?$/, '/');
  }
  
  var Collection = Backbone.Collection.extend({
    
    moment: moment,
    
    model: Model,
    
    /**
     * Defines location of Backdrop service
     */
    baseUrl: baseUrl,
    
    defaultDateFormat: Model.prototype.defaultDateFormat,
    
    initialize: function (models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.initialize.apply(this, arguments);
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
    },
    
    fetch: function (options) {
      options = _.extend({
        queryId: this.queryId
      }, options);
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    
    /**
     * Constructs a Backdrop query for the current environment
     */
    url: function() {
      // add query parameters
      var params = _.extend({}, this.prop('queryParams'));
      
      // convert date parameters
      _.each(params, function (value, key) {
        if (this.moment.isMoment(value)) {
          params[key] = value.format(this.defaultDateFormat);
        }
      });

      return this.baseUrl + 'performance/' + this.queryUrl + '/api?' + $.param(params, true);
    },
    
    /**
     * Sets a new attribute-specific comparator to sort by and then re-sorts.
     * This will trigger a reset event.
     * Uses custom comparator if one is defined for attribute,
     * otherwise uses default comparator.
     * @param {String} attr attribute to sort by
     * @param {Boolean} [descending=false] Sort descending when true, ascending when false
     */
    sortByAttr: function (attr, descending) {
      var comparators = this.prop('comparators');
      if (comparators && comparators[attr]) {
        // use custom comparator
        this.comparator = comparators[attr].call(this, attr, descending);
      } else {
        this.comparator = this.defaultComparator.call(this, attr, descending)
      }
      this.sortDescending = Boolean(descending);
      this.sortAttr = attr;
      this.sort();
    },
    
    /**
     * Returns a general purpose comparator function that will sort collection
     * by an attribute. Sorts numbers or strings alphabetically.
     * @param {String} attr attribute to sort by
     * @param {Boolean} [descending=false] Sort descending when true, ascending when false
     * @returns {Function} Function that can be used as collection comparator
     */
    defaultComparator: function (attr, descending) {
      return function (a, b) {
        var aVal = a.get(attr);
        var bVal = b.get(attr);

        var res = 0;
        
        // special cases - nulls are always lower than an actual value
        if (aVal == null && bVal == null) {
          // no point comparing two null values,
          // allow fallback to other comparator
          return null;
        }
        else if (bVal == null) {
          return -1;
        }
        else if (aVal == null) {
          return 1;
        }
        
        // normal sort behaviour, sorts by numbers or alphabetically
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
        }
        if (typeof bVal === 'string') {
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) {
          res = -1;
        } else if (aVal > bVal) {
          res = 1;
        }
        if (descending) {
            res *= -1;
        }
        return res;
      };
    }
    
  });

  return Collection;
});
