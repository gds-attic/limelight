define([
  'require',
  './stackedbar'
],
function(require, StackedBar) {
  /**
   * Renders multiple data series as blocks of 'interleaved' bars. Each block
   * contains one value from each series.
   */
  var InterleavedBar = StackedBar.extend({
    
    blockMarginFraction: 0.2,
    barMarginFraction: 0.05,
    align: 'left',

    y0: function (model) {
      return this.scales.y(0);
    },
    y: function(model) {
      return this.scales.y(model.y);
    },

    x: function (model, index, group, groupIndex) {
      var blockWidth = this.blockWidth.apply(this, arguments);
      var blockMargin = this.blockMarginFraction * blockWidth / 2;

      var barWidth = this.barWidth.apply(this, arguments);
      var numBarSpaces = this.collection.length - 1;
      if (numBarSpaces > 0) {
        barWidth += this.barMarginFraction * blockWidth / numBarSpaces;
      }

      return blockMargin + blockWidth * index + barWidth * groupIndex;
    },
    
    barWidth: function (model, index, group, groupIndex) {
      var numGroups = this.collection.length;
      var numBarSpaces = numGroups - 1;
      var blockWidth = this.blockWidth.apply(this, arguments);

      var allBarMargins = this.barMarginFraction * blockWidth;
      var allBlockMargins = this.blockMarginFraction * blockWidth;

      return (blockWidth - allBlockMargins - allBarMargins) / numGroups;
    },

    /**
     * Selects an item for a given position. Searches for the bar whose
     * horizontal centre is closest to the current position.
     * @param {Object} e Hover event details
     * @param {Number} e.x Hover x position
     * @param {Number} e.y Hover y position
     * @param {Boolean} [e.toggle=false] Unselect if the new selection is the current selection
     */
    onHover: function (e) {
      var best = {
        dist: Infinity
      };

      this.collection.each(function (group, groupIndex) {
        group.get('values').each(function (model, index) {
          var barX = this.x(model, index, group, groupIndex);
          var barWidth = this.barWidth(model, index, group, groupIndex)
          var barCentre = barX + barWidth / 2;
          var dist = Math.abs(barCentre - e.x);
          var isNewBest = dist < best.dist;
          if (isNewBest) {
            best = {
              dist: dist,
              group: group,
              groupIndex: groupIndex,
              model: model,
              index: index
            };
          }
        }, this);
      }, this);
      
      this.selectItem(best.groupIndex, best.index, e.toggle);
    }
    
  });

  return InterleavedBar;
});