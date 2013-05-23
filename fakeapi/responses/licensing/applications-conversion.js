define([
  'require',
  '../response',
  '../random',
  'lodash'
], function(require, Response, Random, _) {
  var FunnelResponse = Response.extend({

    initialize: function() {
      this.rnd = new Random();
    },

    url: /\/licensing\/?.*\?(.*)/,

    queryId: 'applications-conversion',

    getData: function(query) {
      var maxValue = 1e4;
      var values = _.map(this.steps, function (category) {
        // monotonically but randomly decreasing value
        maxValue = Math.floor(this.rnd(0, maxValue));
        return {
          eventCategory: category,
          uniqueEvents: maxValue
        };
      }, this);

      return _.shuffle(values);
    },

    steps: [
      'licensingUserJourney:downloadFormPage',
      'licensingUserJourney:submitApplicationPage',
      'licensingUserJourney:feeInfoPage',
      'licensingUserJourney:end'
    ]
  });

  return FunnelResponse;
});