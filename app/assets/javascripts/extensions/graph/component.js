define([
  'extensions/view',
  'd3loader!'
],
function (View, d3) {
  
  var Component = View.extend({
    
    d3: d3,
    
    initialize: function (options) {
      _.extend(this, options);
      View.prototype.initialize.apply(this, arguments);
    }
    
  });

  return Component;
});
