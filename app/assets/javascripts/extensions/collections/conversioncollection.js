define([
  'extensions/collections/collection'
], function(Collection) {
  var ConversionCollection = Collection.extend({

    initialize: function (models, options) {
      options = options || {};
      if (options.getStep) {
        this.getStep = options.getStep;
      }
      Collection.prototype.initialize.apply(this, arguments);
    },

    queryParams: function() {
      var weeksAgo = this.options.weeksAgo || 0;
      return this.lastWeekDateRangeParams(this.moment(), weeksAgo);
    },
    
    parse: function (response) {
      var titles = this.stepTitles;

      var data = _.map(this.steps, function (stepName) {
        return _.extend({
          title: titles[stepName],
          step: stepName,
          uniqueEvents: 0,
          uniqueEventsNormalised: 0
        }, _.find(response.data, function (responseStep) {
          return this.getStep(responseStep) === stepName;
        }, this));
      }, this);

      var maxVal = _.reduce(data, function (memo, step) {
        return Math.max(memo, step. uniqueEvents);
      }, 0);

      if (maxVal !== 0) {
        _.each(data, function (step) {
          step.uniqueEventsNormalised = step.uniqueEvents / maxVal;
        });
      }

      return data;
    },

    getStep: function(d) {
      return d.eventCategory;
    },

    comparator: function(step1, step2) {
      var index1 = _.indexOf(this.steps, step1.get('step'));
      var index2 = _.indexOf(this.steps, step2.get('step'));

      if (index1 == -1 && index2 == -1) {
        return this.compare(
          step1.get('step').toLowerCase(),
          step2.get('step').toLowerCase()
        );
      } else if (index1 == -1) {
        return 1;
      } else if (index2 == -1) {
        return -1;
      } else {
        return this.compare(index1, index2);
      }
    },

    compare: function(a, b) {
      if (a < b) {
        return -1;
      } else if(a > b) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  return ConversionCollection;
});
