define([
  'extensions/collections/graphcollection',
  'fco/collections/volumetrics',
  'fco/views/volumetrics-submissions-graph',
  'fco/views/volumetrics-submissions-number',
  'fco/views/volumetrics-completion-graph',
  'fco/views/volumetrics-completion-number'
],
function (GraphCollection, VolumetricsCollection,
  VolumetricsSubmissionsGraph, VolumetricsSubmissionsNumberView,
  VolumetricsCompletionGraph, VolumetricsCompletionNumberView) {

  return function (serviceName) {
    var volumetricsCollection = new VolumetricsCollection([], {
      serviceName: serviceName
    });

    var volumetricsSubmissions = new GraphCollection();
    volumetricsCollection.on('reset', function () {
      volumetricsSubmissions.reset([volumetricsCollection.applicationsSeries()]);
    });

    var volumetricsCompletion = new GraphCollection();
    volumetricsCollection.on('reset', function () {
      volumetricsCompletion.reset([volumetricsCollection.completionSeries()]);
    });

    var relayed = false;
    volumetricsSubmissions.on('change:selected', function (group, groupIndex, model, index) {
      if (relayed) {
        relayed = false;
      } else {
        relayed = true;
        volumetricsCompletion.selectItem(groupIndex, index);
      }
    });
    volumetricsCompletion.on('change:selected', function (group, groupIndex, model, index) {
      if (relayed) {
        relayed = false;
      } else {
        relayed = true;
        volumetricsSubmissions.selectItem(groupIndex, index);
      }
    });

    var volumetricsSubmissionsNumber = new VolumetricsSubmissionsNumberView({
      collection:volumetricsSubmissions,
      el:$('#volumetrics-submissions-selected')
    });

    var volumetricsSubmissionsGraph = new VolumetricsSubmissionsGraph({
      el:$('#volumetrics-submissions'),
      collection:volumetricsSubmissions,
      valueAttr:'uniqueEvents'
    });

    var volumetricsCompletionNumber = new VolumetricsCompletionNumberView({
      collection:volumetricsCompletion,
      el:$('#volumetrics-completion-selected')
    });

    var volumetricsCompletionGraph = new VolumetricsCompletionGraph({
      el:$('#volumetrics-completion'),
      collection:volumetricsCompletion,
      valueAttr:'completion'
    });

    volumetricsCollection.fetch();
  };
  
});
