define([
  'require',
  'extensions/views/timeseries-graph/timeseries-graph',
  'extensions/views/graph/linelabel',
  './callout'
],
function (require, TimeseriesGraph, LineLabel, Callout) {
  var LPATimeseriesGraph = TimeseriesGraph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.stack },
        { view: LineLabel },
        { view: Callout },
        { view: this.sharedComponents.hover }
      ];
    },

    getConfigNames: function () {
      return ['stack', 'week'];
    }
    
  });
  
  return LPATimeseriesGraph;
});
