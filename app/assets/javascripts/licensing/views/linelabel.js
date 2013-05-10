define([
  'extensions/views/graph/linelabel'
],
function (LineLabel) {
  var ApplicationsLineLabel = LineLabel.extend({
    
    maxTextWidth: 160,
    showSquare: true,
    interactive: function (e) {
      return e.slice % 3 === 2;
    }
  });
  
  return ApplicationsLineLabel;
});
