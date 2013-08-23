define([
  'require',
  'extensions/views/timeseries-graph/timeseries-graph'
],
function (require, TimeseriesGraph) {
  var VehicleLicensingGraph = TimeseriesGraph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        {
          view: this.sharedComponents.linelabel,
          options: {
            attachLinks: this.options.lineLabelLinks
          }
        },
        {
          view: this.sharedComponents.stack,
          options: {
            interactive: function (e) {
              return e.slice % 3 !== 2;
            }
          }
        },
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
