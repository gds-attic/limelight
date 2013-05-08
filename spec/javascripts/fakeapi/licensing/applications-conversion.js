define([
  'require',
  '../response',
  '../random',
  'lodash'
], function(require, Response, Random, _) {
  var FunnelResponse = Response.extend({

    initialize: function() {
      this.rnd = new Random(1);
    },

    url: /\/licensing\/?.*\?(.*)/,

    queryId: 'applications-conversion',

    getData: function(query) {
      var maxValue = 1e4;
      var values = _.map(this.steps, function(stepSlug) {
        // monotonically but randomly decreasing value
        maxValue = Math.floor(this.rnd(0, maxValue));
        return {
          stepUrlSlug: stepSlug,
          events: maxValue
        };
      }, this);

      return _.shuffle(values);
    },

    steps: [
      "apply_1", "apply_2", "apply_3"
    ]
  });

  return FunnelResponse;
});