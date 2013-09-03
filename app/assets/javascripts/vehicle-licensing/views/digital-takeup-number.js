define([
  'extensions/views/single-stat'
],
function (SingleStatView) {
  var DigitalTakeupNumberView = SingleStatView.extend({

    changeOnSelected: true,

    getValue: function () {
      return this.formatPercentage(this.collection.at(0).get('fraction'));
    },

    getLabel: function () {
      var numPeriods = this.collection.at(0).get('values').length;
      return [
        'last',
        numPeriods,
        this.pluralise(this.collection.query.get('period'), numPeriods)
      ].join(' ');
    },

    getValueSelected: function (selection) {
      return this.formatPercentage(selection.selectedModel.get('fraction'));
    },

    getLabelSelected: function (selection) {
      var model = selection.selectedModel;
      return this.formatPeriod(selection.selectedModel, 'month');
    }
  });

  return DigitalTakeupNumberView;
});
