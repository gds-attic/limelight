define([
  'extensions/views/graph/linelabel'
],
function (LineLabel) {
  var ApplicationsLineLabel = LineLabel.extend({
    
    showSquare: true,
    interactive: function (e) {
      return e.slice % 3 === 2;
    }
  });
  
  return ApplicationsLineLabel;
});
