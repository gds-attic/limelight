define([
  'extensions/graph/component'
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
      
      this.collection.each(function (group, index) {
        this.renderLine(group, index);
      }, this);
    },
    
    /**
     * Renders an SVG path consisting of line segments between data points.
     * @param {Model} [group=undefined] Model for timeseries
     * @param {Number} [index=undefined] Index of this timeseries
     */
    renderLine: function (group, index) {
      
      var timeseries = group.get('values');
      
      var line = d3.svg.line();
      line.x(_.bind(this.x, this, group, this.collection))
      line.y(_.bind(this.y, this, group, this.collection));

      var path = this.wrapper.append("path")
        .attr("d", line(timeseries.models));
      
      if (this.classed) {
        var classed = this.classed;
        if (_.isFunction(classed)) {
          classed = classed(group, index)
        }
        path.attr('class', classed);
      }
    }
  });

  return Line;
});
