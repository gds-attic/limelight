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
    
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var line = d3.svg.line()
        .x(_.bind(this.x, this))
        .y(_.bind(this.y, this));

      var path = this.wrapper.append("path")
        .attr("d", line(this.collection.models));
        
      if (this.classed) {
        path.classed(this.classed, true);
      }
    }
  });

  return Line;
});
