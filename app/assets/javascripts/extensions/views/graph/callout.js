define([
  'extensions/views/graph/component'
],
function (Component) {
  var Callout = Component.extend({
    
    events: {
      'mousemove': 'onMouseMove'
    },
    
    horizontal: 'left',
    vertical: 'top',
    xOffset: 7,
    yOffset: 7,
    constrainToBounds: true,
    
    render: function () {
      if (!this.calloutEl) {
        this.calloutEl = $('<div></div>').addClass('callout performance-hidden').appendTo(this.$el);
      }
    },
    
    onChangeSelected: function (group, groupIndex, model, index) {
      var el = this.calloutEl;
      if (!model) {
        el.addClass('performance-hidden');
        return;
      }
      this.renderContent(el, group, groupIndex, model, index);
      el.removeClass('performance-hidden');
      
      var scaleFactor = this.graph.scaleFactor();
      
      var basePos = {
        x: this.x(model, index) * scaleFactor,
        y: this.y(model, index) * scaleFactor
      };
      
      var pos = this.applyPivot(basePos, {
        horizontal: this.horizontal,
        vertical: this.vertical,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        constrainToBounds: this.constrainToBounds
      }, {
        width: this.innerWidth * scaleFactor,
        height: this.innerHeight * scaleFactor
      });
      
      el.css({
        left: pos.x + this.margin.left * scaleFactor,
        top: pos.y + this.margin.top * scaleFactor
      });
    },
    
    // Not implemented; override in configuration or subclass
    x: function (model, index) {
      throw('No x calculation defined.');
    },
    
    // Not implemented; override in configuration or subclass
    y: function (model, index) {
      throw('No y calculation defined.');
    },
    
    // Not implemented; override in configuration or subclass
    renderContent: function (el, group, groupIndex, model, index) {
      throw("No content defined for Callout");
    },
    
    onMouseMove: function (e) {
      return false;
    },
    
    /**
     * "Pivoting" aligns the Callout in relation to an element. Commonly, this
     * is the element that caused the Callout to appear. The "pivot point" is
     * the coordinate to which the callout is aligned to. The
     * "pivot direction" is where this point is on the Callout.
     * 
     * @param {Object} basePos Starting position for the Callout
     * @param {Object} pivot Information for the pivoting process
     * @param pivot.horizontal Horizontal position of the pivot point on the callout
     * @param pivot.vertical Vertical position of the pivot point on the callout
     * @param [pivot.xOffset=0] Additional horizontal offset to be applied to the pivot point
     * @param [pivot.yOffset=0] Additional vertical offset to be applied to the pivot point
     * @param {Boolean} [pivot.constrainToBounds=false] Reverse direction if the Callout overflows the "bounds" element
     * @param {Object} [bounds=null] Element whose bounding box the Callout should not overflow
     */
    applyPivot: function (basePos, pivot, bounds) {
    
      var el = this.calloutEl;
    
      pivot.xOffset = pivot.xOffset || 0;
      pivot.yOffset = pivot.yOffset || 0;
      var horizontal = pivot.horizontal;
      var vertical = pivot.vertical;
    
      // first, move into direction that was requested
      var pivotCorrection = this.offsetFromTopLeft(el, horizontal, vertical);
    
      var pos = {
        x: basePos.x + pivot.xOffset - pivotCorrection.x,
        y: basePos.y + pivot.yOffset - pivotCorrection.y
      };
      
      if (pivot.constrainToBounds) {
        // reverse directions if there are overlaps
        var overlap = false;
        if (pos.x < 0 || pos.x + el.width() > bounds.width) {
          horizontal = this.reversePositionToFraction(horizontal);
          pivot.xOffset *= -1;
          overlap = true;
        }
        if (pos.y < 0 || pos.y + el.height() > bounds.height) {
          vertical = this.reversePositionToFraction(vertical);
          pivot.yOffset *= -1;
          overlap = true;
        }
    
        if (overlap) {
          pivotCorrection = this.offsetFromTopLeft(el, horizontal, vertical);
          pos = {
            x: basePos.x + pivot.xOffset - pivotCorrection.x,
            y: basePos.y + pivot.yOffset - pivotCorrection.y
          };
        }
      }
    
      return pos;
    },
    
    reversePositionToFraction: function (pos) {
      return 1 - this.positionToFraction(pos);
    },
    
    positionToFraction: function (pos) {
      if (typeof pos == 'number') {
        return Math.min(Math.max(pos, 0), 1);
      }
    
      if (typeof pos == 'string') {
        // percentage value
        var matches = pos.match(/(-?\d+)\%/);
        if (matches) {
          var fraction = parseFloat(matches[1]) / 100;
          return Math.min(Math.max(fraction, 0), 1);
        }
    
        // match logical values
        var fraction = {
          top: 0,
          left: 0,
          centre: .5,
          center: .5,
          middle: .5,
          bottom: 1,
          right: 1
        }[pos];
    
        return (typeof fraction == 'undefined') ? null : fraction;
      }
    
      return null;
    },
    
    offsetFromTopLeft: function (el, horizontal, vertical) {
        var width = el.width();
        var height = el.height();
        return {
          x: width * this.positionToFraction(horizontal),
          y: height * this.positionToFraction(vertical)
        };
    }
    
  });

  return Callout;
});
