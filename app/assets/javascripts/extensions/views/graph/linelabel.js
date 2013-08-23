define([
  'extensions/views/graph/component'
],
function (Component) {

  var LineLabel = Component.extend({
    
    offset: 20,
    linePaddingInner: 4,
    linePaddingOuter: 4,
    overlapLabelTop: 0,
    overlapLabelBottom: 20,
    
    showSquare: true,
    squareSize: 11,
    squarePadding: 4,
    
    classed: 'labels',

    interactive: function (e) {
      return e.slice % 3 === 2;
    },
    
    /**
     * Renders labels for current collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var left = this.graph.innerWidth + this.offset;
      this.componentWrapper
        .classed(this.classed, true)
        .attr('transform', 'translate(' + left + ', 0)');
      
      var selection = this.componentWrapper.selectAll('g.label')
          .data(this.collection.models);
      selection.exit().remove();
          
      var enterSelection = selection.enter().append('g').attr('class', 'label');
      enterSelection.append('line');
      if (this.showSquare) {
        enterSelection.append('rect');
      }
      this.enter(enterSelection);
      
      this.update(selection);
      this.setLabelPositions(selection);
      this.updateLines(selection);
      if (this.showSquare) {
        this.updateSquares(selection);
      }

      this.renderLinks();
    },

    /**
     * Links are displayed above hover element and intercept events.
     * Replicates hover functionality for link areas.
     */
    events: function () {
      if (!this.attachLinks) {
        return;
      }

      var eventName = this.modernizr.touch ? 'touchstart' : 'mousemove';
      var events = {};
      events[eventName + ' .label-link'] = function (e) {
        var target = $(e.target);
        var index = target.parent().find('.label-link').index(target);
        this.collection.selectItem(index);

        if (!this.bodyListener) {
          this.bodyListener = true;
          var that = this;
          $('body').one(eventName, function () {
            that.bodyListener = false;
            that.collection.selectItem(null, null);
          });
        }

        return false;
      };

      return events;
    },

    renderLinks: function () {
      if (!this.attachLinks) {
        return;
      }
      var wrapper = this.d3.select(this.$el[0]);
      var selection = wrapper.selectAll('a.label-link')
        .data(this.collection.models);
      selection.enter().append('a')
        .attr('class', 'label-link')

      var positions = this.positions;
      var that = this;
      selection
        .attr('href', function (model, index) {
          return model.get('href');
        })
        .attr('style', function (model, index) {
          return [
            'left: ', that.margin.left + that.graph.innerWidth, 'px; ',
            'width: ', that.margin.right, 'px; ',
            'top: ', that.margin.top + positions[index].min, 'px; ',
            'height: ', positions[index].size, 'px; '
          ].join('')
        });
    },

    /**
     * Positions labels as close as possible to y position of last data point
     * @param {Selection} selection d3 selection to operate on
     */
    setLabelPositions: function (selection) {
      
      // labels are positioned in relation to last data point
      var maxModelIndex = this.collection.at(0).get('values').length - 1;

      // prepare 'positions' array
      var positions = [];
      var graph = this.graph;
      var scale = this.scales.y;
      selection.each(function (group, groupIndex) {
        var y = scale(graph.getYPos.call(graph, groupIndex, maxModelIndex));
        var size = d3.select(this).select('text').node().getBBox().height;
        
        positions.push({
          ideal: y,
          size: size,
          id: group.get('id')
        });
      });
      
      // optimise positions
      positions = this.positions = this.calcPositions(positions, {
        min: this.overlapLabelTop,
        max: this.graph.innerHeight + this.overlapLabelBottom
      });
      
      // apply optimised positions
      selection.attr("transform", function (group, index) {
        var x = 0;
        var yLabel = Math.floor(positions[index].min) + .5;
        group.set('yLabel', yLabel);
        return "translate(" + x + ", " + yLabel + ")";
      });
    },
    
    /**
     * Creates label content elements.
     * @param {Selection} selection d3 selection to operate on
     */
    enter: function (selection) {
      selection.each(function (model) {
        d3.select(this).append('text');
      });
    },
    
    /**
     * Sets label content.
     * @param {Selection} selection d3 selection to operate on
     */
    update: function (selection) {
      var showSquare = this.showSquare;
      var xOffset = 0;
      if (showSquare) {
        xOffset += this.squareSize + this.squarePadding;
      }
      selection.each(function (model, i) {
        var selection = d3.select(this)
        selection.selectAll("text")
            .text(_.unescape(model.get('title')))
            .attr('transform', 'translate(' + xOffset + ', 6)');
      });

      var truncateWidth = this.margin.right - this.offset - xOffset;
      this.truncateWithEllipsis(selection, truncateWidth);
    },
    
    updateSquares: function (selection) {
      var squareSize = this.squareSize;
      selection.each(function (model, i) {
        d3.select(this).selectAll('rect')
          .attr('class', model.get('id') + ' square' + i)
          .attr('x', 0)
          .attr('y', -squareSize / 2)
          .attr('width', squareSize)
          .attr('height', squareSize);
      });
    },
    
    /**
     * Draws line from y position of last item to label
     * @param {Selection} selection d3 selection to operate on
     */
    updateLines: function (selection) {
      var positions = this.positions;
      var that = this;
      selection.each(function (group, groupIndex) {
        var position = positions[groupIndex];
        d3.select(this).select('line')
          .attr('x1', -that.offset + that.linePaddingInner)
          .attr('x2', -that.linePaddingOuter)
          .attr('y1', function(group, index) {
            return position.ideal - position.min;
          })
          .attr('y2', function(group) {
            return 0;
          })
          .classed('crisp', function () {
            return position.ideal - position.min == 0;
          });
      });
    },
    
    /**
     * Truncates label texts to fit within defined width.
     * @param {Selection} selection d3 selection to operate on
     * @param {Number} maxWidth Width to truncate text elements to
     * @param {String} [ellipsis=…] Symbol to use for truncation
     */
    truncateWithEllipsis: function (selection, maxWidth, ellipsis) {
      ellipsis = ellipsis || '…';
      
      selection.selectAll('text').each(function (metaModel) {
        var text = d3.select(this);
        if (this.getBBox().width <= maxWidth) {
          // text fits already, nothing to do
          return;
        }
        
        // truncate with ellipsis until text fits
        var original = text.text();
        var truncated;
        for (var i = original.length; i >= 0; i--){
          if (original.slice(i-1, i) === ' ') {
            // do not leave trailing space
            continue;
          }
          truncated = original.slice(0, i) + ellipsis;
          text.text(truncated);
          if (this.getBBox().width <= maxWidth) {
            break;
          };
        };
      })
    },
    
    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      var labels = this.componentWrapper.selectAll('g.label');
      labels.classed('selected', function (group, groupIndex) {
        return groupIndexSelected === groupIndex;
      });
    },
    
    onHover: function (e) {
      var y = e.y;
      var bestIndex, bestDistance = Infinity;
      this.collection.each(function (group, index) {
        var distance = Math.abs(group.get('yLabel') - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      if (e.toggle && bestIndex == this.collection.selectedIndex) {
        this.collection.selectItem(null);
      } else {
        this.collection.selectItem(bestIndex);
      }
    },
    
    /**
     * Optimises non-overlapping placement of items by trying to minimise the
     * sum of squared distances of each item to their "ideal" position.
     * Each item entry requires two properties:
     *  - ideal: the position the item is ideally placed at
     *  - size: the size of the item, e.g. width or height
     * @param {Array} items Items to be placed
     * @param {Object} [bounds=undefined] Defines bounds that the labels must stay within
     * @param {Number} [bounds.min=undefined] Lower boundary
     * @param {Number} [bounds.max=undefined] Upper boundary
     * @returns {Array} Item placement solution. Each entry contains a 'min' property defining the item's positions.
     */
    calcPositions: function (items, bounds) {
      
      var sumSize = _.reduce(items, function(memo, item){
        return memo + item.size;
      }, 0);

      
      // check if everything fits
      if (bounds) {
        var availableSpace = bounds.max - bounds.min;
        if (sumSize > availableSpace) {
          // doesn't fit - overlap is necessary
          var overlapFactor = availableSpace / sumSize;
          _.each(items, function (item) {
            item.size *= overlapFactor;
          });
          sumSize = availableSpace;
        }
      }
      
      if (bounds) {
        // set boundaries for each item
        var sizeUsed = 0, sizeAvailable = bounds.max - bounds.min - sumSize;
        _.each(items, function (item) {
          item.absoluteLowestMin = bounds.min + sizeUsed;
          item.absoluteHighestMin = item.absoluteLowestMin + sizeAvailable;
          sizeUsed += item.size;
        });
      }
      
      // calculate initial solution
      var curMax = 0, sumSquareDist = 0;
      
      var bestSolution = _.map(items, function (item, index) {
        
        item = _.extend({}, item);
        item.index = index;
        item.min = Math.max(curMax, item.ideal);
        if (item.absoluteLowestMin != null) {
          item.min = Math.max(item.min, item.absoluteLowestMin);
        }
        if (item.absoluteHighestMin != null) {
          item.min = Math.min(item.min, item.absoluteHighestMin);
        }
        curMax = item.max = item.min + item.size;
        item.dist = item.min - item.ideal;
        item.squareDist = Math.pow(item.dist, 2);
        sumSquareDist += item.squareDist;
        
        return item;
      });
      bestSolution.sumSquareDist = sumSquareDist;
      
      var calcSolution = function (items, indexToOptimise) {
        
        var solution = [];
        
        // move anchor element a bit closer to ideal
        var anchor = _.extend({}, items[indexToOptimise]);
        var targetDist = anchor.dist * .9;
        
        anchor.min = anchor.ideal + targetDist; 
        if (anchor.absoluteLowestMin != null) {
          anchor.min = Math.max(anchor.min, anchor.absoluteLowestMin);
        }
        if (anchor.absoluteHighestMin != null) {
          anchor.min = Math.min(anchor.min, anchor.absoluteHighestMin);
        }
        anchor.dist = anchor.min - anchor.ideal;
        var curMin = anchor.min;
        var curMax = anchor.max = anchor.min + anchor.size;
        
        anchor.squareDist = Math.pow(anchor.dist, 2);
        var sumSquareDist = anchor.squareDist;
        solution[anchor.index] = anchor;
        
        // nudge previous elements upwards
        for (var i = indexToOptimise - 1; i >= 0; i--) {
          var item = _.extend({}, items[i]);
          item.max = Math.min(item.max, curMin);
          curMin = item.min = item.max - item.size;
          item.dist = item.min - item.ideal;
          item.squareDist = Math.pow(item.dist, 2);
          sumSquareDist += item.squareDist;
          solution[i] = item;
        };
        
        // nudge following elements downwards
        for (var i = indexToOptimise + 1; i < items.length; i++) {
          var item = _.extend({}, items[i]);
          item.min = Math.max(item.min, curMax);
          curMax = item.max = item.min + item.size;
          item.dist = item.min - item.ideal;
          item.squareDist = Math.pow(item.dist, 2);
          sumSquareDist += item.squareDist;
          solution[i] = item;
        };
        
        solution.sumSquareDist = sumSquareDist;
        
        return solution;
      };
      
      var doIterate = true;
      var maxIterations = 100;
      var threshold = 1;
      for (var iteration = 0; doIterate && iteration < maxIterations; iteration++) {
        doIterate = false;
        var itemsBySquareDist = _.sortBy(bestSolution, function (item) {
          return -item.squareDist;
        });
        
        for (var i = 0, ni = itemsBySquareDist.length; i < ni && !doIterate; i++) {
          var item = itemsBySquareDist[i];
          var solution = calcSolution(bestSolution, item.index);
          var diff = bestSolution.sumSquareDist - solution.sumSquareDist;
          if (diff > threshold) {
            // new best solution found
            bestSolution = solution;
            // result has not converged yet, continue search
            doIterate = true;
          }
        };
      };
      
      return bestSolution;
    }
  });

  return LineLabel;
});
