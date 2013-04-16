define([
  'extensions/graph/component'
],
function (Component) {
  var LineLabel = Component.extend({
    
    offset: 20,
    linePaddingInner: 4,
    linePaddingOuter: 4,
    overlapLabelTop: 0,
    overlapLabelBottom: 30,
    
    maxTextWidth: null,
    showSquare: false,
    squareSize: 11,
    squarePadding: 4,
    
    /**
     * Renders labels for current collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var left = this.innerWidth + this.offset;
      this.group = this.wrapper.append('g')
        .attr('class', 'labels')
        .attr('transform', 'translate(' + left + ', 0)');
      
      var selection = this.group.selectAll('g')
          .data(this.collection.models);
          
      var enterSelection = selection.enter().append('g')
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
      
      if (this.maxTextWidth) {
        this.truncateWithEllipsis(selection, this.maxTextWidth);
      }
    },
    
    /**
     * Positions labels as close as possible to y position of last data point
     * @param {Selection} selection d3 selection to operate on
     */
    setLabelPositions: function (selection) {
      
      // labels are positioned in relation to last data point
      var model = this.collection.last();
      
      // prepare 'positions' array
      var yScale = this.scales.y;
      var positions = [];
      selection.each(function (group) {
        var value = group.get('values').last().get('_count');
        var y = yScale(value);
        group.set('y', y);
        
        positions.push({
          ideal: y,
          size: this.getBBox().height,
          id: group.get('id')
        });
      });
      
      // optimise positions
      positions = this.calcPositions(positions, {
        min: this.overlapLabelTop,
        max: this.innerHeight + this.overlapLabelBottom
      });
      
      // apply optimised positions
      selection.attr("transform", function (metaModel, index) {
        var value = model.get(metaModel.get('id'));
        var x = 0;
        var yLabel = positions[index].min;
        metaModel.set('yLabel', yLabel);
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
            .text(model.get('title'))
            .attr('transform', 'translate(' + xOffset + ', 6)');
      });
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
      selection.selectAll("line")
        .attr('x1', -this.offset + this.linePaddingInner)
        .attr('x2', -this.linePaddingOuter)
        .attr('y1', function(metaModel) {
          return metaModel.get('y') - metaModel.get('yLabel');
        })
        .attr('y2', function(metaModel) {
          return 0;
        })
        .classed('crisp', function (metaModel) {
          return metaModel.get('y') - metaModel.get('yLabel') == 0;
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
      if (bounds && sumSize > bounds.max - bounds.min) {
        // no solution possible
        // TODO: what to do?
        return items;
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
