define([
  'extensions/views/timeseries-graph/timeseries-graph'
],
function (TimeseriesGraph) {
  var VolumetricsGraph = TimeseriesGraph.extend({
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        {
          view: this.sharedComponents.yaxis,
          options: {
            ticks: 3
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

  return VolumetricsGraph;
});
