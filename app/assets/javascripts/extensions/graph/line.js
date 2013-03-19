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
     * Renders one or more lines for current collection. Uses meta collection
     * if present to determine rendering order of lines.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      if (this.collection.meta) {
        // collection has meta information, let's use it
        this.collection.meta.each(function (metaModel, index) {
          this.renderLine(metaModel, index);
        }, this);
      } else {
        // render single line
        this.renderLine();
      }
    },
    
    /**
     * Renders an SVG path consisting of line segments between data points.
     * @param {Model} [metaModel=undefined] Additional meta data
     * @param {Number} [index=undefined] Index of this line when rendering multiple lines
     */
    renderLine: function (metaModel, index) {
      
      var line = d3.svg.line();
      if (metaModel) {
        line.x(_.bind(this.x, this, metaModel))
        line.y(_.bind(this.y, this, metaModel));
      } else {
        line.x(_.bind(this.x, this))
        line.y(_.bind(this.y, this));
      }

      var path = this.wrapper.append("path")
        .attr("d", line(this.collection.models));
        
      if (this.classed) {
        var classed = this.classed;
        if (_.isFunction(classed)) {
          classed = classed(metaModel, index)
        }
        path.attr('class', classed);
      }
    }
  });

  return Line;
});
