define([
  'extensions/views/view',
  'd3loader!'
],
function (View, d3) {
  
  var Component = View.extend({
    
    d3: d3,
    
    initialize: function (options) {
      _.extend(this, options);
      View.prototype.initialize.apply(this, arguments);
    },
    
    render: function () {
      View.prototype.render.apply(this, arguments);
      
      if (!this.componentWrapper) {
        var componentWrapper = this.componentWrapper = this.wrapper.append('g');
        if (this.classed){
          componentWrapper.classed(this.classed, true);
        }
      }
    }
    
  });

  return Component;
});
