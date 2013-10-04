define([
  'require',
  'extensions/views/graph/component',
  './timeperiod'
],
function (require, Component, TimePeriod) {

  var LineLabel = Component.extend({

    offset: 20,
    linePaddingInner: 4,
    linePaddingOuter: 4,
    overlapLabelTop: 0,
    overlapLabelBottom: 20,
    labelOffset: 6,

    showSquare: true,
    showValues: false,
    showValuesPercentage: false,
    showSummary: false,
    showTimePeriod: false,
    attachLinks: false,
    squareSize: 11,
    squarePadding: 4,
    summaryPadding: 6,

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

      this.renderLabels();
      this.renderSummary();
      this.renderTimePeriod();
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

    renderSummary: function () {

      this.summaryHeight = 0;

      if (!this.showSummary) {
        return;
      }

      var d = {
        title: 'Total'
      };

      if (this.showValues) {
        var attr = this.graph.valueAttr;

        var selected = this.collection.getCurrentSelection();
        if (selected.selectedModel) {
          d.value = this.collection.sum(attr, null, selected.selectedModelIndex);
        } else {
          d.value = this.collection.sum(attr);
        }

        if (this.showValuesPercentage) {
          d.fraction = 1;
        }
      }

      var selection = this.componentWrapper.selectAll('g.summary').data([d]);

      selection.exit().remove();
      var enterSelection = selection.enter().append('g').attr('class', 'summary');
      this.enter(enterSelection);

      this.updateLabelContent(selection, d);
      var translateY = this.overlapLabelTop - this.margin.top + this.labelOffset;
      selection.attr('transform', 'translate(0,' + translateY + ")");

      var bbox = selection.node().getBBox();
      var y = bbox.y + bbox.height;
      enterSelection.append('line').attr({
        'class': 'divider',
        x1: 0,
        x2: this.margin.right,
        y1: y,
        y2: y
      });

      this.summaryHeight = y + this.labelOffset + this.summaryPadding;
    },

    renderLabels: function () {
      var wrapper = this.d3.select(this.$el[0]);
      var that = this;

      var figcaption = wrapper.selectAll('figcaption').data(['one-figcaption']);
      figcaption.enter().append('figcaption').attr('class', 'legend');

      var labelWrapper = figcaption.selectAll('ol').data(['one-wrapper']);
      labelWrapper.enter().append('ol').attr('class', 'labels');

      var numLabels = this.collection.models.length;
      var selection = labelWrapper.selectAll('li')
        .data(this.collection.models);
      selection.enter().append('li')
        .attr('class', function (model, index) {
          return 'label' + index;
        });
        // do this after the lines have been rendered
        // .attr('style', function (model, index) {
        //   console.log(positions);
        //   return [
        //     // 'top:', that.margin.top + positions[index].min, 'px;',
        //     'left:', that.margin.left + that.graph.innerWidth, 'px;',
        //     // 'height:', positions[index].size, 'px;',
        //     'width:', that.margin.right, 'px;'
        //   ].join('');

      if (this.attachLinks) {
        //todo
      }

      selection.each(function(group, i) {
        that.setLabelContent.call(that, that.d3.select(this), group, i);
      });

      this.renderLines();
    },

    renderLines: function () {
      console.log("rendering lines...");
    },

    renderTimePeriod: function () {
      if (!this.showTimePeriod) {
        return;
      }

      if (!this.timePeriod) {
        var timePeriod = this.timePeriod = new TimePeriod({
          el: this.figcaption,
          collection: this.collection
        });
        timePeriod.render();
      }

      this.timePeriod.$el.width(
        this.margin.right - this.getXOffset() - this.offset
      );
    },

    configs: {
      'overlay': {
        getYIdeal: function (groupIndex, index) {
          return this.graph.getYPos(groupIndex, index);
        }
      },
      'stack': {
        getYIdeal: function (groupIndex, index) {
          var y = this.graph.getYPos(groupIndex, index);
          if (y === null) {
            return null;
          }
          var y0 = this.graph.getY0Pos(groupIndex, index);
          return (y + y0) / 2;
        }
      }
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
      var scale = this.scales.y;
      var that = this;
      selection.each(function (group, groupIndex) {
        var y;
        for (var index = maxModelIndex; index >= 0; index--) {
          y = that.getYIdeal.call(that, groupIndex, index);
          if (y !== null) {
            break;
          }
        }
        d3.select(this).selectAll('line').style('display', 'none');
        var size = this.getBBox().height;
        d3.select(this).selectAll('line').style('display', null);

        positions.push({
          ideal: scale(y),
          size: size,
          id: group.get('id')
        });
      });

      // optimise positions
      positions = this.positions = this.calcPositions(positions, {
        min: this.overlapLabelTop + this.summaryHeight,
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
        d3.select(this).append('text').attr('class', 'title');
      });
      if (this.showValues) {
        selection.append('text').attr('class', 'value');
      }
    },

    setLabelContent: function (selection, group, groupIndex) {
      var labelHTML = "<span class='label-title'>" + group.get('title') + "</span>";

      if (this.showValues) {
        var attr = this.graph.valueAttr,
            selected = this.collection.getCurrentSelection(),
            value = 0;

        if (selected.selectedModel) {
          value = this.collection.at(groupIndex, selected.selectedModelIndex).get(attr);
        } else {
          value = this.collection.sum(attr, groupIndex);
        }

        if (value === null) {
          labelHTML += "<span class='no-data'>(no data)</span>";
        } else {
          labelHTML += ("<span>" + this.formatNumericLabel(value) + "</span>");
        }

        if (this.showValuesPercentage) {
          var fraction = this.collection.fraction(
            attr, groupIndex, selected.selectedModelIndex
          );
          labelHTML += (" <span class='percentage'>(" + this.formatPercentage(fraction) + ")</span>");
        }
      }

      console.log(labelHTML);

      selection.html(labelHTML);
    },

    getXOffset: function () {
      if (this.showSquare) {
        return this.squareSize + this.squarePadding;
      } else {
        return 0;
      }
    },

    /**
     * Calculates height of SVG node
     * @param {Object} selection d3 selection or native SVG DOM node
     * @returns Height in pixels
     */
    getNodeHeight: function(selection){
      var node;
      // if it's a selection, get the node
      if (selection.node){
        node = selection.node();
      } else {
        node = selection;
      }
      return node.getBBox().height;
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
          }
        }
      });
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      this.render();
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
        }

        // nudge following elements downwards
        for (var i = indexToOptimise + 1; i < items.length; i++) {
          var item = _.extend({}, items[i]);
          item.min = Math.max(item.min, curMax);
          curMax = item.max = item.min + item.size;
          item.dist = item.min - item.ideal;
          item.squareDist = Math.pow(item.dist, 2);
          sumSquareDist += item.squareDist;
          solution[i] = item;
        }

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
        }
      }

      return bestSolution;
    }
  });

  return LineLabel;
});
