define([
  'require',
  'extensions/views/timeseries-graph/timeseries-graph',
  'extensions/views/graph/linelabel'
],
function (require, TimeseriesGraph, LineLabel, Callout) {
  var VehicleLicensingGraph = TimeseriesGraph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: LineLabel },
        { view: this.sharedComponents.stack },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    },

    getConfigNames: function () {
      return ['stack', 'week'];
    }
    
  });
  
  return VehicleLicensingGraph;
});
