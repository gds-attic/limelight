define([
  'extensions/views/timeseries-graph/xaxis',
  'extensions/collections/collection',
  'moment'
],
function (XAxis, Collection, moment) {
  describe("XAxisComponent", function () {

    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = XAxis.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });

    describe("'hour' configuration", function () {
      it("shows ticks at 6am, midday, 6pm and midnight", function () {

        var start = moment.utc('2013-03-13T00:00:00');
        var end = moment.utc('2013-03-14T00:00:00');
        var values = [];
        for (var date = start.clone(); +date < +end; date.add(1, 'hours')) {
          values.push({
            _end_at: date.clone()
          });
        }

        var collection = new Collection([{
          values: new Collection(values)
        }]);

        var view = new XAxis({
          collection: collection,
          wrapper: wrapper,
          getScale: function () {
            return view.d3.time.scale().domain([start.toDate(), end.toDate()]);
          },
          graph: {
            innerWidth: 0,
            innerHeight: 0
          }
        });
        view.applyConfig('hour');

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(4);
        expect(d3.select(ticks[0]).text()).toEqual('midnight');
        expect(d3.select(ticks[1]).text()).toEqual('6am');
        expect(d3.select(ticks[2]).text()).toEqual('midday');
        expect(d3.select(ticks[3]).text()).toEqual('6pm');
      });
    });

  });
});
