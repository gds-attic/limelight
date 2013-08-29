define([
  'require',
  './volumetrics-completion-number'
],
function (require, CompletionNumberView) {
  var SubmissionsNumberView = CompletionNumberView.extend({

    getValue: function () {
      return this.formatNumericLabel(this.collection.at(0).get('mean'));
    },

    getLabel: function () {
      return [
        'mean per week over the last',
        this.collection.at(0).get('weeksWithData'),
        'weeks'
      ].join(' ');
    },

    getValueSelected: function (selection) {
      return this.formatNumericLabel(
        selection.selectedModel.get('uniqueEvents')
      );
    }
  });

  return SubmissionsNumberView;
});
