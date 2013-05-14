define([
  'extensions/views/graph/component'
],
function (Component) {
  var Line = Component.extend({
    
    // Not implemented; override in configuration or subclass
    x: function (model) {
      throw('No x calculation defined.');
    },
    
    // Not implemented; override in configuration or subclass
    y: function (model) {
      throw('No y calculation defined.');
    },
    
    /**
     * Renders a line for each group in the collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var models = this.collection.models;
      for (var i = models.length - 1; i >= 0; i--){
        this.renderLine(models[i], i);
      };
    },
    
    /**
     * Renders an SVG path consisting of line segments between data points.
     * @param {Model} [group=undefined] Model for timeseries
     * @param {Number} [groupIndex=undefined] Index of this timeseries
     */
    renderLine: function (group, groupIndex) {
      
      var timeseries = group.get('values');
      
      var line = d3.svg.line();
      var that = this;
      line.x(function (model, index) {
        return that.x.call(that, model, index, group, groupIndex);
      });
      line.y(function (model, index) {
        return that.y.call(that, model, index, group, groupIndex);
      });

      var path = this.componentWrapper.append("path")
        .attr("d", line(timeseries.models));
      
      if (this.lineClassed) {
        var classed = this.lineClassed;
        if (_.isFunction(classed)) {
          classed = classed(group, groupIndex)
        }
        path.attr('class', classed);
      }
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
          line.node().parentNode.appendChild(line.node());
        }
      }, this);
      if (modelSelected) {
        this.componentWrapper.append('circle').attr({
          'class': 'selectedIndicator line' + groupIndexSelected,
          cx: this.x(modelSelected, indexSelected, groupSelected, groupIndexSelected),
          cy: this.y(modelSelected, indexSelected, groupSelected, groupIndexSelected),
          r: 4
        });
      }
    },
    
    /**
     * Calculates the `distance` of a group to a given point, then picks the
     * closest point in the group.
     */
    getDistanceAndClosestModel: function (group, point) {
      var values = group.get('values');
      var lastIndex, left, right;
      
      right = values.find(function (model, index) {
        lastIndex = index;
        return this.x(model) >= point.x;
      }, this);
      
      if (!right) {
        left = right = values.last();
      } else if (lastIndex === 0) {
        left = right;
      } else {
        left = values.at(lastIndex - 1);
      }
      
      var distLeft = Math.abs(point.x - this.x(left));
      var distRight = Math.abs(this.x(right) - point.x);
      var weight = distLeft / (distLeft + distRight);
      
      var y = this.d3.interpolate(this.y(left), this.y(right))(weight);
      var dist = Math.abs(point.y - y);
      
      var bestIndex = values.indexOf(distLeft < distRight ? left : right);
      
      return {
        dist: dist,
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
        var result = this.getDistanceAndClosestModel(group, point)
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
    },
    
    selectItem: function (groupIndex, index, toggle) {
      if (toggle && groupIndex === this.collection.selectedIndex
          && index === this.collection.selectedItem.get('values').selectedIndex) {
        this.collection.selectItem(null, null);
      } else {
        this.collection.selectItem(groupIndex, index);
      }
    }
  });

  return Line;
});
