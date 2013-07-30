define([
  'require',
  './timeseries-graph',
  'extensions/views/graph/linelabel'
],
function (require, TimeseriesGraph, LineLabel) {
  var MultiTimeseriesGraph = TimeseriesGraph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: LineLabel },
        { view: this.sharedComponents.line },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    }
    
  });
  
  return MultiTimeseriesGraph;
});
