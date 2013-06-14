define([
  'extensions/collections/collection'
], function(Collection) {
  var ApplicationsConversionCollection = Collection.extend({
    
    serviceName: 'licensing',
    apiName: 'journey',

    queryId: 'applications-conversion',

    steps: [
      'licensingUserJourney:downloadFormPage',
      'licensingUserJourney:submitApplicationPage',
      'licensingUserJourney:end'
    ],
    
    stepTitles: {
      'licensingUserJourney:downloadFormPage': 'Download form',
      'licensingUserJourney:submitApplicationPage': 'Submit application',
      'licensingUserJourney:end': 'Done'
    },

    queryParams: function() {
      var monthsAgo = this.options.monthsAgo || 0;
      var at_midnight = this.moment().startOf('month').subtract(monthsAgo, 'months');
      var query = {
        start_at: at_midnight.clone().subtract(1, 'months'),
        end_at: at_midnight,
        filter_by: "dataType:licensing_overview_journey"
      };

      return query;
    },
    
    parse: function (response) {
      var titles = this.stepTitles;
      var order = this.steps;
      
      var data = [];
      var maxVal = -Infinity;
      _.each(response.data, function (step) {
        if (!_.contains(order, step.eventCategory)) {
          return;
        }
        step.title = titles[step.eventCategory];
        maxVal = Math.max(maxVal, step.uniqueEvents);
        data.push(step);
      });

      _.each(data, function (step) {
        step.uniqueEventsNormalised = step.uniqueEvents / maxVal;
      });
      
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

  return ApplicationsConversionCollection;
});
