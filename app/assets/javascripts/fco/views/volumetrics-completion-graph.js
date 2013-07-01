define([
  'require',
  './volumetrics-submissions-graph'
],
function (require, VolumetricsSubmissionsGraph) {
  var VolumetricsCompletionGraph = VolumetricsSubmissionsGraph.extend({
    minYDomainExtent: 1,
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        {
          view: this.sharedComponents.yaxis,
          options: {
            ticks: 3,
            tickFormat: function () {
              return function (d) {
                return Math.round(100 * d) + '%';
              };
            }
          }
        },
        {
          view: this.sharedComponents.stack,
          options: { drawCursorLine: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return VolumetricsCompletionGraph;
});
