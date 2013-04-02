define([
  'require',
  './applicationsgraph',
  './linelabel',
],
function (require, ApplicationsGraph, LineLabel) {
  var ApplicationsPerLicenceGraph = ApplicationsGraph.extend({
    
    margin: {
      top: 20,
      bottom: 50,
      left: 60,
      right: 200
    },
    
    components: function () {
      var components = ApplicationsGraph.prototype.components.apply(this, arguments);
      components.push({
        view: LineLabel
      });
      return components;
    }
    
  });
  
  return ApplicationsPerLicenceGraph;
});
