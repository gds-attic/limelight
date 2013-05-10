define([
  'require',
  './applicationsgraph',
  './linelabel',
  './line'
],
function (require, ApplicationsGraph, LineLabel, Line) {
  var ApplicationsPerLicenceGraph = ApplicationsGraph.extend({
    
    margin: {
      top: 20,
      bottom: 40,
      left: 45,
      right: 200
    },
    
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
  
  return ApplicationsPerLicenceGraph;
});
