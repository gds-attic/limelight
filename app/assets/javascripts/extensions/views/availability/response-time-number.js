define([
  'extensions/views/single-stat'
],
function (SingleStatView) {
  var ResponeTimeNumberView = SingleStatView.extend({

    changeOnSelected: true,

    getValue: function () {
      var responseTime = Math.round(this.collection.getAverageResponseTime());
      return responseTime + 'ms';
    },

    getLabel: function () {
      return 'mean for the last 24 hours';
    },

    getValueSelected: function (selection) {
      return selection.selectedModel.get('avgresponse') + 'ms';
    },

    getLabelSelected: function (selection) {
      var model = selection.selectedModel;
      var start = model.get('_start_at');
      var end = model.get('_end_at');

      return [
        start.format('ha'),
        ' to ',
        end.format('ha'),
        ',<br>',
        start.format('D MMMM YYYY')
      ].join('');
    }
  });

  return ResponeTimeNumberView;
});
