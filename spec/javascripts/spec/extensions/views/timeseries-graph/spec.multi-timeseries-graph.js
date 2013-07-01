define([
  'extensions/views/timeseries-graph/multi-timeseries-graph',
  'extensions/collections/collection',
  'moment'
],
function (Graph, Collection, moment) {
  
  describe("MultiTimeseriesGraph", function() {
    
    var collection, graph, el;
    beforeEach(function() {
      el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
      
      collection = new Collection([
        {
          id: 'total',
          title: 'Total applications',
          values: new Collection([
            {
              _start_at: moment('2013-01-14').startOf('day'),
              _end_at: moment('2013-01-21').startOf('day'),
              _count: 90,
              alternativeValue: 444
            },
            {
              _start_at: moment('2013-01-21').startOf('day'),
              _end_at: moment('2013-01-28').startOf('day'),
              _count: 100,
              alternativeValue: 333
            },
            {
              _start_at: moment('2013-01-28').startOf('day'),
              _end_at: moment('2013-02-04').startOf('day'),
              _count: 114,
              alternativeValue: 222
            }
          ])
        },
        {
          id: 'westminster',
          title: 'Westminster',
          values: new Collection([
            {
              _start_at: moment('2013-01-14').startOf('day'),
              _end_at: moment('2013-01-21').startOf('day'),
              _count: 1,
              alternativeValue: 100
            },
            {
              _start_at: moment('2013-01-21').startOf('day'),
              _end_at: moment('2013-01-28').startOf('day'),
              _count: 6,
              alternativeValue: 99
            },
            {
              _start_at: moment('2013-01-28').startOf('day'),
              _end_at: moment('2013-02-04').startOf('day'),
              _count: 11,
              alternativeValue: 98
            }
          ])
        },
        {
          id: 'croydon',
          title: 'Croydon',
          values: new Collection([
            {
              _start_at: moment('2013-01-14').startOf('day'),
              _end_at: moment('2013-01-21').startOf('day'),
              _count: 2,
              alternativeValue: 80
            },
            {
              _start_at: moment('2013-01-21').startOf('day'),
              _end_at: moment('2013-01-28').startOf('day'),
              _count: 7,
              alternativeValue: 87
            },
            {
              _start_at: moment('2013-01-28').startOf('day'),
              _end_at: moment('2013-02-04').startOf('day'),
              _count: 12,
              alternativeValue: 23
            }
          ])
        }
      ]);
      collection.getCurrentSelection = jasmine.createSpy().andReturn({});
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
      
      it("scales domain from 0 to nice value above max value when an alternative value attribute is used", function () {
        graph.valueAttr = 'alternativeValue';
        expect(graph.calcYScale().domain()).toEqual([0, 500]);
      });
      
      it("scales range to inner height", function() {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });

      it("sets the tickValues correctly", function() {
          expect(graph.calcYScale().tickValues)
              .toEqual([0, 20, 40, 60, 80, 100, 120])
      });
   });
    
    describe("render", function() {
      it("renders lines for each time series", function() {
        graph.render();
        expect(graph.el.find('path.line').length).toEqual(3);
      });
    });
    
  });
  
});
