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
        { view: LineLabel, options: {
          y: function (group, groupIndex) {
            return this.scales.y(group.get('values').last().y0 + group.get('values').last().y);
          }
        } },
        { view: Callout },
        { view: this.sharedComponents.hover }
      ];
    },

    YScaleFunction: "calcYSeriesSum"
    
  });
  
  return LPATimeseriesGraph;
});
