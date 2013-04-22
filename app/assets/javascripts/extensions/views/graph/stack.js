define([
  'extensions/views/graph/component'
],
function (Component) {
  var Stack = Component.extend({
    
    stackValues: function (group) {
      return group.get('values').models;
    },
    
    /**
     * Calculates x position for model.
     * Not implemented; override in configuration or subclass
     */
    x: function (model) {
      throw('No x calculation defined.');
    },
    
    /**
     * Accessor to retrieve value for y dimension from model.
     * Not implemented; override in configuration or subclass
     */
    yStack: function (model) {
      throw('No yStack calculation defined.');
    },
    
    y0: function (model) {
      return this.scales.y(model.y0);
    },
    
    y: function(model) {
      return this.scales.y(model.y0 + model.y);
    },
    
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var stack = this.d3.layout.stack()
        .values(this.stackValues)
        .y(_.bind(this.yStack, this));
      var layers = stack(this.collection.models);
      
      var getX = _.bind(this.x, this);
      var getY = _.bind(this.y, this);
      var area = d3.svg.area()
        .x(getX)
        .y0(_.bind(this.y0, this))
        .y1(getY);
        
      var line = d3.svg.line()
        .x(getX)
        .y(getY);
      
      
      var selection = this.componentWrapper.selectAll('g')
          .data(layers);
      
      var enterSelection = selection.enter().append('g');
      enterSelection.append("path")
          .attr("class", function (group, index) {
            return 'stack stack' + index + ' ' + group.get('id');
          })
          .attr("d", function(group) {
            return area(group.get('values').models);
          });
      enterSelection.append("path")
          .attr("class", function (group, index) {
            return 'line line' + index + ' ' + group.get('id');
          })
          .attr("d", function(group) {
            return line(group.get('values').models);
          })
    }
  });

  return Stack;
});
