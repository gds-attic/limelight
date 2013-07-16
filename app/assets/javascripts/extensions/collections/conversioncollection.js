define([
  'extensions/collections/collection'
], function(Collection) {
  var ConversionCollection = Collection.extend({

    queryParams: function() {
      var weeksAgo = this.options.weeksAgo || 0;
      var today = this.moment();
      if (today.day() === 0) {
        weeksAgo += 1;
      }
      var startOfWeek = today.day(1).startOf('day').subtract(weeksAgo, 'weeks');
      
      return {
        start_at: startOfWeek.clone().subtract(1, 'weeks'),
        end_at: startOfWeek
      };
    },
    
    parse: function (response) {
      var titles = this.stepTitles;
      
      var data = _.map(this.steps, function (eventCategory) {
        return _.extend({
          title: titles[eventCategory],
          eventCategory: eventCategory,
          uniqueEvents: 0,
          uniqueEventsNormalised: 0
        }, _.find(response.data, function (responseStep) {
          return responseStep.eventCategory === eventCategory;
        }));
      });

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

    comparator: function(step1, step2) {
      var index1 = _.indexOf(this.steps, step1.get('eventCategory'));
      var index2 = _.indexOf(this.steps, step2.get('eventCategory'));

      if (index1 == -1 && index2 == -1) {
        return this.compare(
          step1.get('eventCategory').toLowerCase(),
          step2.get('eventCategory').toLowerCase()
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
