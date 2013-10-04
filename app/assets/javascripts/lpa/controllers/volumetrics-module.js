define([
  'extensions/collections/graphcollection',
  'extensions/collections/volumetrics',
  'extensions/views/volumetrics/completion-graph',
  'extensions/views/volumetrics/number'
],
function (GraphCollection, 
          VolumetricsCollection,
          VolumetricsCompletionGraph, 
          VolumetricsNumberView) {
  return function () {

    var serviceName = $("#wrapper").data("service-name");

    if (!$('.lte-ie8').length) {
      if ($('#lpa-completion').length) {

        var volumetricsCollection = new VolumetricsCollection([], {
          serviceName: serviceName,
          startMatcher: /user\/login/,
          endMatcher: /register\/confirmation/,
          matchingAttribute: "eventLabel"
        });

        var volumetricsCompletion = new GraphCollection();
        volumetricsCollection.on('reset', function () {
          volumetricsCompletion.reset([volumetricsCollection.completionSeries()]);
        });

        var volumetricsCompletionNumber = new VolumetricsNumberView({
          collection:volumetricsCompletion,
          el:$('#lpa-completion-selected'),
          valueAttr: 'totalCompletion',
          selectionValueAttr: 'completion',
          formatValue: function (value) {
            return this.formatPercentage(value);
          }
        });

        var volumetricsCompletionGraph = new VolumetricsCompletionGraph({
          el:$('#lpa-completion'),
          collection:volumetricsCompletion,
          valueAttr:'completion'
        });

        volumetricsCollection.fetch();

      }
    }
  }
});
