define([
  'require',
  './applicationsgraph',
  './linelabel',
  'extensions/graph/line'
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
      return this.axisComponents().concat([
        {
          view: Line,
          options: {
            lineClassed: function (group, index) {
              return 'line line' + index + ' ' + group.get('id');
            },
            x: function (group, collection, point) {
              // display data points on sundays
              var x = this.moment(point.get('_end_at')).subtract(1, 'days');
              return this.scales.x(x.toDate());
            },
            y: function (group, collection, point) {
              return this.scales.y(point.get('_count'));
            }
          }
        },
        {
          view: LineLabel
        }
      ]);
    }
    
  });
  
  return ApplicationsPerLicenceGraph;
});
