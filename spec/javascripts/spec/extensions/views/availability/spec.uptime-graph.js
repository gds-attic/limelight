define([
  'extensions/views/availability/uptime-graph',
  'extensions/collections/collection',
  'moment'
],
function (UptimeGraph, Collection, moment) {
  describe("UptimeGraph", function () {

    var graph;
    beforeEach(function() {
      var start = moment.utc('2013-03-13T00:00:00');
      var end = moment.utc('2013-03-14T00:00:00');
      var values = [];
      for (var date = start.clone(); +date < +end; date.add(1, 'hours')) {
        values.push({
          _timestamp: date.clone()
        });
      }

      var collection = new Collection([{
        values: new Collection(values)
      }]);

      spyOn(UptimeGraph.prototype, "prepareGraphArea");
      graph = new UptimeGraph({
        collection: collection
      });
      graph.innerWidth = 444;
      graph.innerHeight = 333;
    });

    describe("calcXScale", function() {
      it("scales domain from first timestamp to last timestamp", function() {
        var domain = graph.calcXScale().domain();
        expect(moment(domain[0]).format()).toEqual('2013-03-13T00:00:00+00:00');
        expect(moment(domain[1]).format()).toEqual('2013-03-13T23:00:00+00:00');
      });
      
      it("scales range to inner width", function() {
        expect(graph.calcXScale().range()).toEqual([0, 444]);
      });
    });

  });
});
