define([
  'extensions/graph/linelabel'
],
function (LineLabel) {
  var ApplicationsLineLabel = LineLabel.extend({
    
    maxTextWidth: 160,
    
    enter: function (selection) {
      selection.each(function (metaModel) {
        var that = d3.select(this);
        if (metaModel.get('id') === 'total') {
          that.append('text').attr('class', 'total');
        } else {
          that.append('text').attr('class', 'text1');
          that.append('text').attr('class', 'text2');
        }
      });
    },
    update: function (selection) {
      selection.each(function (metaModel) {
        var that = d3.select(this);
        if (metaModel.get('id') === 'total') {
          that.selectAll("text.total")
            .text(metaModel.get('title'))
            .attr('transform', 'translate(0, 6)');
        } else if (metaModel.get('subTitle')) {
          that.selectAll("text.text1")
            .text(metaModel.get('title'))
            .attr('transform', 'translate(0, 0)');
          that.selectAll("text.text2")
            .text('(' + metaModel.get('subTitle') + ')')
            .attr('transform', 'translate(0, 15)');
        } else {
          that.selectAll("text.text1")
            .text(metaModel.get('title'))
            .attr('transform', 'translate(0, 4)');
        }
      });
    }
  });
  
  return ApplicationsLineLabel;
});
