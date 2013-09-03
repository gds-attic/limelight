define([
  'extensions/views/single-stat'
],
function (SingleStatView) {
  var CompletionNumberView = SingleStatView.extend({

    changeOnSelected: true,

    getValue: function () {
      return this.formatPercentage(this.collection.at(0).get('totalCompletion'));
    },

    getLabel: function () {
      return 'last ' + this.collection.at(0).get('weeksWithData') + ' weeks';
    },

    getValueSelected: function (selection) {
      return this.formatPercentage(selection.selectedModel.get('completion'));
    },

    getLabelSelected: function (selection) {
      return this.formatPeriod(selection.selectedModel, 'week');
    }
  });

  return CompletionNumberView;
});
