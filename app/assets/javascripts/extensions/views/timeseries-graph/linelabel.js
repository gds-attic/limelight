define([
  'extensions/views/graph/linelabel'
],
function (LineLabel) {
  var TimeseriesLineLabel = LineLabel.extend({
    
    showSquare: true,
    interactive: function (e) {
      return e.slice % 3 === 2;
    },

    y: function (group, groupIndex) {
      var value = group.get('values').last().get(this.graph.valueAttr);
      return this.scales.y(value);
    }
    
  });
  
  return TimeseriesLineLabel;
});
