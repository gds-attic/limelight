define([
  'licensing/views/applicationsgraph',
  'extensions/collection',
  'moment'
],
function (Graph, Collection, moment) {
  
  describe("Total Applications Graph", function() {
    
    var collection, graph;
    beforeEach(function() {
      collection = new Collection([
        {
          _start_at: moment('2013-01-14').startOf('day'),
          _end_at: moment('2013-01-21').startOf('day'),
          _count: 123
        },
        {
          _start_at: moment('2013-01-21').startOf('day'),
          _end_at: moment('2013-01-28').startOf('day'),
          _count: 124
        },
        {
          _start_at: moment('2013-01-28').startOf('day'),
          _end_at: moment('2013-02-04').startOf('day'),
          _count: 41
        }
      ]);
      spyOn(Graph.prototype, "prepareGraphArea");
      graph = new Graph({
        collection: collection
      });
      graph.innerWidth = 444;
      graph.innerHeight = 333;
    });
    
    describe("calcXScale", function() {
      it("scales domain from first Sunday to last Sunday", function() {
        var domain = graph.calcXScale().domain();
        expect(moment(domain[0]).format('YYYY-MM-DD')).toEqual('2013-01-20');
        expect(moment(domain[1]).format('YYYY-MM-DD')).toEqual('2013-02-03');
      });
      
      it("scales range to inner width", function() {
        expect(graph.calcXScale().range()).toEqual([0, 444]);
      });
    });
    
    describe("calcYScale", function() {
      it("scales domain from 0 to nice value above max value", function() {
        expect(graph.calcYScale().domain()).toEqual([0, 130]);
      });
      
      it("scales range to inner height", function() {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });
    });
    
  });
  
});
