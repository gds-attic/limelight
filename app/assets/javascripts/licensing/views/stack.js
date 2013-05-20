define([
  'extensions/views/graph/stack'
],
function (Stack) {
  var ApplicationsStack = Stack.extend({
    
    interactive: true,
    
    configs: {
      week: {
        x: function (model, index) {
          // display data points on sundays
          var x = this.moment(model.get('_end_at')).subtract(1, 'days');
          return this.scales.x(x.toDate());
        }
      },
      month: {
        x: function (model, index) {
          return this.scales.x(index);
        }
      }
    },
    
    yStack: function (model) {
      return model.get('_count');
    }
  });
  
  return ApplicationsStack;
});
