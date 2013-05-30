define([
  'require',
  './applicationsgraph',
  './linelabel',
  './line'
],
function (require, ApplicationsGraph, LineLabel, Line) {
  var ApplicationsPerLicenceGraph = ApplicationsGraph.extend({
    
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
