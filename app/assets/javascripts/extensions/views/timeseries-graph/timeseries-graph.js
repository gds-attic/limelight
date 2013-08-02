define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var TimeseriesGraph = Graph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.stack },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    },

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period') || 'week'];
    }
  });
  
  return TimeseriesGraph;
});
