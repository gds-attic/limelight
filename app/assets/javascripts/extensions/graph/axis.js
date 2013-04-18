define([
  'extensions/graph/component'
],
function (Component) {
  var Axis = Component.extend({
    
    position: 'bottom',
    tickPadding: 0,
    orient: 'bottom',
    classed: null,
    
    // Not implemented; override in configuration or subclass
    getScale: function () {
      throw('No scale defined.');
    },
    
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var scale = this.getScale();
      
      var axis = this.d3.svg.axis()
        .scale(scale)
        .orient(this.orient)
        .tickPadding(this.tickPadding);
      
      _.each(['ticks', 'tickValues', 'tickFormat'], function (id) {
        if (this[id]) {
          axis[id](_.isFunction(this[id]) ? this[id]() : this[id]);
        }
      }, this);
      
      this.componentWrapper
        .attr("transform", this.getTransform())
        .call(axis);
    },
    
    getTransform: function () {
      var offsetX = this.offsetX || 0;
      var offsetY = this.offsetY || 0;
      
      if (this.position == 'right') {
        offsetX += this.innerWidth;
      } else if (this.position === 'bottom') {
        offsetY += this.innerHeight;
      }
      
      return "translate(" + offsetX + "," + offsetY + ")";
    }

  });

  return Axis;
});
