define([
  'extensions/views/single-stat'
],
function (SingleStatView) {
  var TimePeriodView = SingleStatView.extend({

    changeOnSelected: true,
    valueTag: '',

    getPeriod: function () {
      return this.period || this.collection.query.get('period') || 'week';
    },

    getValue: function () {
      var numPeriods = this.collection.at(0).get('values').length;
      return [
        'Last',
        numPeriods,
        this.pluralise(this.getPeriod(), numPeriods)
      ].join(' ');
    },

    getValueSelected: function (selection) {
      var model = selection.selectedModel;
      if (_.isArray(model) && model.length) {
        model = model[0];
      }
      return this.formatPeriod(model, this.getPeriod());
    }
  });

  return TimePeriodView;
});
