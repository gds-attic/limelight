define([
  'require',
  './stack'
],
function(require, StackComponent) {
  var BarComponent = StackComponent.extend({
    
    align: 'centre',
    
    classed: 'bar',
    
    renderContent: function (selection) {
      
      var getY0 = _.bind(this.y0, this);
      
      var enterSelection = selection.enter().append('g').attr('class', 'group');
      
      var that = this;
      selection.each(function (group, groupIndex) {
        var segmentSelection = that.d3.select(this).selectAll('g.segment')
            .data(group.get('values').models);
        var enterSegmentSelection = segmentSelection.enter().append('g').attr('class', 'segment');

        enterSegmentSelection.append('rect');
        enterSegmentSelection.append('line');
        if (that.text) {
          enterSegmentSelection.append('text');
        }
        
        segmentSelection.each(function (model, i) {
          that.updateSegment.call(that, groupIndex, d3.select(this), model, i);
        }, this);
      });
    },
    
    updateSegment: function (groupIndex, segment, model, i) {
      var x = this.x(model, i);
      var y = this.y(model, i);
      var y0 = this.y0(model, i);
      var width = this.barWidth(model, i);

      var xLeft = x;
      var align = this.align;
      if (align === 'right') {
        xLeft -= width;
      } else if (align !== 'left') {
        xLeft -= width / 2;
      }
      
      segment.select('rect').attr({
        'class': 'stack' + groupIndex,
        x: xLeft,
        y: y,
        width: width,
        height: y0 - y
      });

      segment.select('line').attr({
        'class': 'line' + groupIndex,
        x1: xLeft,
        y1: y,
        x2: xLeft + width,
        y2: y,
      });

      if (this.text) {
        segment.select('text').attr({
          'class': 'text' + groupIndex,
          x: x,
          y: y
        }).text(this.text(model, i));
      }
    }
  });

  return BarComponent;
});