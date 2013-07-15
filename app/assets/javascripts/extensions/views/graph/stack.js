define([
  'require',
  './line',
  'extensions/views/graph/component'
],
function (require, Line, Component) {
  var Stack = Line.extend({

    reverseRenderOrder: true,
    
    stackValues: function (group) {
      return group.get('values').models;
    },
    
    /**
     * Calculates x position for model.
     * Not implemented; override in configuration or subclass
     */
    x: function (model) {
      throw('No x calculation defined.');
    },
    
    /**
     * Accessor to retrieve value for y dimension from model.
     * Not implemented; override in configuration or subclass
     */
    yStack: function (model) {
      throw('No yStack calculation defined.');
    },
    
    y0: function (model) {
      return this.scales.y(model.y0);
    },
    
    y: function(model) {
      return this.scales.y(model.y0 + model.y);
    },
    
    render: function () {
      Component.prototype.render.apply(this, arguments);

      var stack = this.d3.layout.stack()
        .values(this.stackValues)
        .y(_.bind(this.yStack, this));

      var layers;
      if (this.reverseRenderOrder) {
        layers = stack(this.collection.models.slice().reverse());
      } else {
        layers = stack(this.collection.models);
      }
      
      var groupStacks = this.componentWrapper.selectAll('g.stacks').data([0]);
      groupStacks.enter().append('g').attr('class', 'stacks');

      var groupLines = this.componentWrapper.selectAll('g.lines').data([0]);
      groupLines.enter().append('g').attr('class', 'lines');
      
      var selectionStacks = groupStacks.selectAll('g.group')
          .data(layers);
      selectionStacks.exit().remove();

      var selectionLines = groupLines.selectAll('g.group')
          .data(layers);
      selectionLines.exit().remove();

      this.renderContent(selectionStacks, selectionLines);
    },
    
    renderContent: function (selectionStacks, selectionLines) {
      var getX = _.bind(this.x, this);
      var getY = _.bind(this.y, this);
      var area = d3.svg.area()
        .x(getX)
        .y0(_.bind(this.y0, this))
        .y1(getY);
        
      var line = d3.svg.line()
        .x(getX)
        .y(getY);

      var maxGroupIndex = this.collection.length - 1;
      
      selectionStacks.enter().append("g").attr('class', 'group').append('path')
          .attr("class", function (group, index) {
            return 'stack stack' + (maxGroupIndex-index) + ' ' + group.get('id');
          });
      selectionStacks.select('path').attr("d", function(group, groupIndex) {
        return area(group.get('values').models);
      });

      selectionLines.enter().append("g").attr('class', 'group').append('path')
          .attr("class", function (group, index) {
            return 'line line' + (maxGroupIndex-index) + ' ' + group.get('id');
          });
      selectionLines.select('path').attr("d", function(group, groupIndex) {
        return line(group.get('values').models);
      });
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      Line.prototype.onChangeSelected.apply(this, arguments);
      this.collection.each(function (group, groupIndex) {
        var selected = (groupIndexSelected === groupIndex);
        var stack = this.componentWrapper.select('path.stack' + groupIndex);
        stack.classed('selected', selected);
      }, this);
    },

    /**
     * Selects the group the user is hovering over and the closest item in
     * that group.
     * When position is below the last area, the last area is selected.
     * When position is above the first area, the first area is selected.
     * @param {Object} e Hover event details
     * @param {Number} e.x Hover x position
     * @param {Number} e.y Hover y position
     * @param {Boolean} [e.toggle=false] Unselect if the new selection is the current selection
     */
    onHover: function (e) {
      var point = {
        x: e.x,
        y: e.y
      };
      
      var selectedGroupIndex, selectedItemIndex;
      for (var i = this.collection.models.length - 1; i >= 0; i--) {
        var group = this.collection.models[i];
        var distanceAndClosestModel = this.getDistanceAndClosestModel(group, point);

        if (distanceAndClosestModel.diff > 0 || i === 0) {
          selectedGroupIndex = i;
          selectedItemIndex = distanceAndClosestModel.index;
          break;
        }
      };

      this.selectItem(selectedGroupIndex, selectedItemIndex, e.toggle);
    },
  });

  return Stack;
});
