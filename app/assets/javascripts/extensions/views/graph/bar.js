define([
  'require',
  './stack'
],
function(require, StackComponent) {
  var BarComponent = StackComponent.extend({
    
    align: 'centre',
    
    classed: 'bar',
    
    offsetText: -8,
    
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

    getStrokeWidth: function (selection) {
      return this.graph.pxToValue($(selection.node()).css('stroke-width'));
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
      
      var xRect = xLeft;
      var yRect = y;
      var yRect0 = y0;
      var widthRect = width;

      if (this.strokeAlign === 'inner') {
        var strokeWidth = this.getStrokeWidth(segment.select('rect'));
        xRect += strokeWidth / 2;
        yRect += strokeWidth / 2;
        yRect0 -= strokeWidth / 2;
        widthRect -= strokeWidth;
      }

      segment.select('rect').attr({
        'class': 'stack' + groupIndex,
        x: xRect,
        y: yRect,
        width: widthRect,
        height: yRect0 - yRect
      });

      segment.select('line').attr({
        'class': 'line' + groupIndex,
        x1: xLeft,
        y1: y,
        x2: xLeft + width,
        y2: y
      });

      if (this.text) {
        segment.select('text').attr({
          'class': 'text' + groupIndex,
          x: x,
          y: y + this.offsetText
        }).text(this.text(model, i));
      }
    },
    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      this.componentWrapper.selectAll('g.segment').classed('selected', false);

      if (indexSelected == null) {
        return;
      }

      var group = d3.select(this.componentWrapper.selectAll('g.group')[0][groupIndexSelected]);
      var segment = d3.select(group.selectAll('g.segment')[0][indexSelected]);
      segment.classed('selected', true);
    }

  });

  return BarComponent;
});