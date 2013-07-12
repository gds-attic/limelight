define([
  'extensions/views/timeseries-graph/timeseries-graph',
  'extensions/collections/collection',
  'moment'
],
function (Graph, Collection, moment) {
  
  describe("TimeseriesGraph", function() {
    
    var collection, graph;
    beforeEach(function() {
      collection = new Collection([
        {
          id: 'total',
          title: 'Total applications',
          values: new Collection([
            {
              _start_at: moment('2013-01-14').startOf('day'),
              _end_at: moment('2013-01-21').startOf('day'),
              _count: 123,
              alternativeValue: 444
            },
            {
              _start_at: moment('2013-01-21').startOf('day'),
              _end_at: moment('2013-01-28').startOf('day'),
              _count: 569,
              alternativeValue: 333
            },
            {
              _start_at: moment('2013-01-28').startOf('day'),
              _end_at: moment('2013-02-04').startOf('day'),
              _count: 1024,
              alternativeValue: 222
            }
          ])
        },
        {
          id: 'other',
          title: 'Stuff',
          values: new Collection([
            {
              _start_at: moment('2013-01-14').startOf('day'),
              _end_at: moment('2013-01-21').startOf('day'),
              _count: 213,
              alternativeValue: 201
            },
            {
              _start_at: moment('2013-01-21').startOf('day'),
              _end_at: moment('2013-01-28').startOf('day'),
              _count: 391,
              alternativeValue: 129
            },
            {
              _start_at: moment('2013-01-28').startOf('day'),
              _end_at: moment('2013-02-04').startOf('day'),
              _count: 943,
              alternativeValue: 22
            }
          ])
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
      it("scales domain to a minimum value of 6 to avoid extreme line jumps on graph and duplicate y axis values", function () {
        collection.at(0).get('values').each(function (model) { model.set('_count', 1); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 1); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);
        
        collection.at(0).get('values').each(function (model) { model.set('_count', 2); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 2); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);
        
        collection.at(0).get('values').each(function (model) { model.set('_count', 5); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 5); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);
      });
      
      it("scales domain from 0 to nice value above max value by default", function() {
        expect(graph.calcYScale().domain()).toEqual([0, 1200]);
      });

      it("scales domain from 0 to nice value above max value by default when an alternative value attribute is used", function () {
        graph.valueAttr = 'alternativeValue';
        expect(graph.calcYScale().domain()).toEqual([0, 500]);
      });
      
      it("scales domain from 0 to nice value above maximum sum of point in time", function() {
        graph.YScaleFunction = 'calcYSeriesSum';
        expect(graph.calcYScale().domain()).toEqual([0, 2000]);
      });

      it("scales domain from 0 to nice value above maximum sum of point in time when an alternative value attribute is used", function () {
        graph.valueAttr = 'alternativeValue';
        graph.YScaleFunction = 'calcYSeriesSum';
        expect(graph.calcYScale().domain()).toEqual([0, 700]);
      });
      
      it("scales range to inner height", function() {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });

      it("sets the tickValues correctly", function() {
        expect(graph.calcYScale().tickValues)
            .toEqual([0, 200, 400, 600, 800, 1000, 1200])
      })

    });

  });
  
});
