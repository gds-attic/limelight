define([
  'extensions/graph/stack'
],
function (Stack) {
  var ApplicationsStack = Stack.extend({
    x: function (model) {
      var x = this.moment(model.get('_end_at')).subtract(1, 'days');
      return this.scales.x(x.toDate());
    },
    
    yStack: function (model) {
      return model.get('_count');
    }
  });
  
  return ApplicationsStack;
});
