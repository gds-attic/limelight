define([
  'require',
  './response-time-number'
],
function (require, ResponseTimeNumberView) {
  var UptimeNumberView = ResponseTimeNumberView.extend({

    getValue: function () {
      return this.formatPercentage(this.collection.getFractionOfUptime());
    },

    getLabel: function () {
      return 'for the last 24 hours';
    },

    getValueSelected: function (selection) {
      var model = selection.selectedModel;
      return this.formatPercentage(model.get('uptimeFraction'));
    }
  });

  return UptimeNumberView;
});
