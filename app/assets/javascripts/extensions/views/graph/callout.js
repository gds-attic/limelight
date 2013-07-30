define([
  'extensions/views/graph/component',
  'extensions/mixins/pivot'
],
function (Component, Pivot) {
  var Callout = Component.extend({
    
    events: {
      'mousemove': 'onMouseMove'
    },
    
    horizontal: 'left',
    vertical: 'top',
    xOffset: 7,
    yOffset: 7,
    constrainToBounds: true,
    classed: 'callout',
    
    render: function () {
      if (!this.calloutEl) {
        this.calloutEl = $('<div></div>').addClass(this.classed + ' performance-hidden').appendTo(this.$el);
      }
    },

    getPivotingElement: function () {
      return this.calloutEl;
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
        x: this.x(model, index, group, groupIndex) * scaleFactor,
        y: this.y(model, index, group, groupIndex) * scaleFactor
      };
      
      var pivotingEl = this.getPivotingElement();

      var pos = this.applyPivot(basePos, {
        horizontal: this.horizontal,
        vertical: this.vertical,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        constrainToBounds: this.constrainToBounds,
        width: pivotingEl.width(),
        height: pivotingEl.height()
      }, {
        width: this.graph.innerWidth * scaleFactor,
        height: this.graph.innerHeight * scaleFactor
      });

      pivotingEl.css({
        left: pos.x + this.margin.left * scaleFactor,
        top: pos.y + this.margin.top * scaleFactor
      });
    },
    
    // Not implemented; override in configuration or subclass
    x: function (model, index, group, groupIndex) {
      throw('No x calculation defined.');
    },
    
    // Not implemented; override in configuration or subclass
    y: function (model, index, group, groupIndex) {
      throw('No y calculation defined.');
    },
    
    // Not implemented; override in configuration or subclass
    renderContent: function (el, group, groupIndex, model, index) {
      throw("No content defined for Callout");
    },
    
    onMouseMove: function (e) {
      return false;
    }

  });

  _.extend(Callout.prototype, Pivot);

  return Callout;
});
