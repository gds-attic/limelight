define([
  'extensions/views/graph/component'
],
function (Component) {
  var Line = Component.extend({

    interactive: true,
    
    drawCursorLine: false,
    
    x: function (group, groupIndex, model, index) {
      var xPos = this.graph.getXPos(groupIndex, index);
      return Math.floor(this.scales.x(xPos)) + 0.5;
    },
    
    y: function (group, groupIndex, model, index) {
      var yPos = this.graph.getYPos(groupIndex, index);
      return this.scales.y(yPos);
    },

    /**
     * Renders a line for each group in the collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var selection = this.componentWrapper.selectAll('g.group')
          .data(this.collection.models);
      selection.exit().remove();
      
      var enterSelection = selection.enter();
      var enterGroup = enterSelection.append('g').attr('class', 'group')
          .append('path');
        
      var that = this;
      var line = d3.svg.line();
      
      var groups = [];
      selection.each(function (group, groupIndex) {
        var groupSelection = d3.select(this);
        groups.push(groupSelection);
        var path = groupSelection.select('path');
        line.x(function (model, index) {
          return that.x.call(that, group, groupIndex, model, index);
        });
        line.y(function (model, index) {
          return that.y.call(that, group, groupIndex, model, index);
        });
        path.attr('d', line(group.get('values').models));
        path.attr('class', 'line line' + groupIndex + ' ' + group.get('id'));
      });
      
      for (var i = groups.length - 1; i >= 0; i--){
        this.moveToFront(groups[i]);
      };

      var currentSelection = this.collection.getCurrentSelection();
      this.onChangeSelected(
        currentSelection.selectedGroup,
        currentSelection.selectedGroupIndex,
        currentSelection.selectedModel,
        currentSelection.selectedModelIndex
      );
    },
    
    lineClassed: function (group, index) {
      return 'line line' + index + ' ' + group.get('id');
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      this.componentWrapper.selectAll('.selectedIndicator').remove();
      this.collection.each(function (group, groupIndex) {
        var selected = (groupIndexSelected === groupIndex);
        var line = this.componentWrapper.select('path.line' + groupIndex);
        line.classed('selected', selected);
        if (selected) {
          var group = line.node().parentNode;
          group.parentNode.appendChild(group);
        }
      }, this);
      if (modelSelected) {
        var x = this.x(groupSelected, groupIndexSelected, modelSelected, indexSelected);
        if (this.drawCursorLine) {
          this.renderCursorLine(x);
        }
        this.componentWrapper.append('circle').attr({
          'class': 'selectedIndicator line' + groupIndexSelected,
          cx: x,
          cy: this.y(groupSelected, groupIndexSelected, modelSelected, indexSelected),
          r: 4
        });

        if (isNaN(this.y(groupSelected, groupIndexSelected, modelSelected, indexSelected))) {
          console.log(groupSelected, groupIndexSelected, modelSelected, indexSelected);
        }
      }
    },

    renderCursorLine: function (x) {
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine',
        x1: x,
        y1: 0,
        x2: x,
        y2: this.graph.innerHeight
      });
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine ascender',
        x1: x,
        y1: -this.margin.top,
        x2: x,
        y2: 0
      });
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine descender',
        x1: x,
        y1: this.graph.innerHeight,
        x2: x,
        y2: this.graph.innerHeight + this.margin.bottom
      });
    },

    /**
     * Calculates the `distance` of a group to a given point, then picks the
     * closest point in the group.
     */
    getDistanceAndClosestModel: function (group, groupIndex, point) {
      var values = group.get('values');
      var leftIndex, rightIndex, left, right;
      
      right = values.find(function (model, index) {
        rightIndex = index;
        return this.x(group, groupIndex, model, index) >= point.x;
      }, this);
      
      if (!right) {
        leftIndex = rightIndex;
        left = right = values.last();
      } else if (rightIndex === 0) {
        leftIndex = rightIndex;
        left = right;
      } else {
        leftIndex = rightIndex - 1;
        left = values.at(leftIndex);
      }
      
      var distLeft = Math.abs(point.x - this.x(group, groupIndex, left, leftIndex));
      var distRight = Math.abs(this.x(group, groupIndex, right, rightIndex) - point.x);
      var weight = distLeft / (distLeft + distRight) || 0;
      var bestIndex = values.indexOf(distLeft < distRight ? left : right);

      var leftY = this.y(group, groupIndex, left, leftIndex);
      var rightY = this.y(group, groupIndex, right, rightIndex);
      var y = this.d3.interpolate(leftY, rightY)(weight);
      var diff = point.y - y;
      var dist = Math.abs(diff);

      var bestIndex = values.indexOf(distLeft < distRight ? left : right);

      return {
        dist: dist,
        diff: diff,
        index: bestIndex
      };
    },
    
    /**
     * Selects an item for a given position.
     * For each group, the algorithm interpolates between points to find the
     * distance of the line to the current position and then picks the closest
     * point of the closest group.
     * There is a bias against changing group to make it easier for users to
     * follow a specific group.
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
      
      var bestDist = Infinity,
          bestModelIndex,
          bestGroupIndex,
          selectedDist,
          selectedIndex = this.collection.selectedIndex;
      
      // Find closest point of closest group
      this.collection.each(function (group, groupIndex) {
        var result = this.getDistanceAndClosestModel(group, groupIndex, point)
        if (result.dist < bestDist) {
          // found new best solution
          bestDist = result.dist;
          bestGroupIndex = groupIndex;
          bestModelIndex = result.index;
        }
        if (groupIndex === selectedIndex) {
          selectedDist = result.dist;
          selectedModelIndex = result.index;
        }
      }, this);
      
      // Selection bias - only switch between groups when new group is
      // significantly closer than currently selected group.
      var biasThreshold = 15;
      if (selectedIndex != null && bestGroupIndex !== selectedIndex
          && selectedDist < biasThreshold) {
        this.selectItem(selectedIndex, selectedModelIndex, e.toggle);
      } else {
        this.selectItem(bestGroupIndex, bestModelIndex, e.toggle);
      }
    }
  });

  return Line;
});
