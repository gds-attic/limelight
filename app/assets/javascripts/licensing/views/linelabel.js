define([
  'extensions/views/graph/linelabel'
],
function (LineLabel) {
  var ApplicationsLineLabel = LineLabel.extend({
    
    maxTextWidth: 160,
    showSquare: true
  });
  
  return ApplicationsLineLabel;
});
