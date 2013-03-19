define([
  'licensing/views/applicationsperlicencegraph',
  'extensions/collection',
  'moment'
],
function (Graph, Collection, moment) {
  
  describe("Per Licence Applications Graph", function() {
    
    var collection, graph, el;
    beforeEach(function() {
      el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
      
      collection = new Collection([
        {
          _start_at: moment('2013-01-14').startOf('day'),
          _end_at: moment('2013-01-21').startOf('day'),
          total:      90,
          westminster: 1,
          croydon:     2,
          wandsworth:  3,
          lambeth:     4,
          bristol:     5
        },
        {
          _start_at: moment('2013-01-21').startOf('day'),
          _end_at: moment('2013-01-28').startOf('day'),
          total:     100,
          westminster: 6,
          croydon:     7,
          wandsworth:  8,
          lambeth:     9,
          bristol:    10
        },
        {
          _start_at: moment('2013-01-28').startOf('day'),
          _end_at: moment('2013-02-04').startOf('day'),
          total:      114,
          westminster: 11,
          croydon:     12,
          wandsworth:  13,
          lambeth:     14,
          bristol:     15
        }
      ]);
      collection.meta = new Collection([
        { id: 'total', title: 'Total' },
        { id: 'westminster', title: 'Westminster' },
        { id: 'croydon', title: 'Croydon' },
        { id: 'wandsworth', title: 'Wandsworth' },
        { id: 'lambeth', title: 'Lambeth' },
        { id: 'bristol', title: 'Bristol' }
      ]);
      // spyOn(Graph.prototype, "prepareGraphArea");
      graph = new Graph({
        el: el,
        collection: collection
      });
      graph.innerWidth = 444;
      graph.innerHeight = 333;
    });
    
    afterEach(function() {
      el.remove();
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
        expect(graph.calcYScale().domain()).toEqual([0, 120]);
      });
      
      it("scales range to inner height", function() {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });
    });
    
    describe("render", function() {
      it("renders lines for each time series", function() {
        graph.render();
        expect(graph.el.find('path.line').length).toEqual(6);
      });
    });
    
  });
  
});
