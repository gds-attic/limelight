define([
  'require',
  './timeseries-graph',
  'extensions/views/graph/linelabel',
  './line'
],
function (require, TimeseriesGraph, LineLabel, Line) {
  var MultiTimeseriesGraph = TimeseriesGraph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: LineLabel },
        { view: Line },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    }
    
  });
  
  return MultiTimeseriesGraph;
});
