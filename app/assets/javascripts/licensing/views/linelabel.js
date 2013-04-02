define([
  'extensions/graph/linelabel'
],
function (LineLabel) {
  var ApplicationsLineLabel = LineLabel.extend({
    
    maxTextWidth: 160,
    
    enter: function (selection) {
      selection.each(function (group) {
        var that = d3.select(this);
        if (group.get('id') === 'total') {
          that.append('text').attr('class', 'total');
        } else {
          that.append('text').attr('class', 'text1');
          that.append('text').attr('class', 'text2');
        }
      });
    },
    update: function (selection) {
      selection.each(function (group) {
        var that = d3.select(this);
        if (group.get('id') === 'total') {
          that.selectAll("text.total")
            .text(group.get('title'))
            .attr('transform', 'translate(0, 6)');
        } else if (group.get('subTitle')) {
          that.selectAll("text.text1")
            .text(group.get('title'))
            .attr('transform', 'translate(0, 0)');
          that.selectAll("text.text2")
            .text('(' + group.get('subTitle') + ')')
            .attr('transform', 'translate(0, 15)');
        } else {
          that.selectAll("text.text1")
            .text(group.get('title'))
            .attr('transform', 'translate(0, 4)');
        }
      });
    }
  });
  
  return ApplicationsLineLabel;
});
