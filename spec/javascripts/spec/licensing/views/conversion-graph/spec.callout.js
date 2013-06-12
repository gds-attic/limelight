define([
  'licensing/views/conversion-graph/callout',
  'extensions/collections/collection',
  'extensions/models/model',
  'moment'
],
function (ConversionCallout, Collection, Model, moment) {
  describe("ConversionCallout", function () {

    describe("rendering", function () {
      var d3 = ConversionCallout.prototype.d3;

      var el, wrapper, collection, view;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = d3.select(el[0]).append('svg').append('g');
        collection = new Collection([
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:12 },
              { title: 'Stage 2', uniqueEvents:15 },
              { title: 'Stage 3', uniqueEvents:18 }
            ])
          }
        ]);
        collection.at(0).get('values').query = new Model({
          start_at: moment('2013-06-11'),
          end_at: moment('2013-06-18')
        });
        view = new ConversionCallout({
          wrapper:wrapper,
          collection:collection,
          graph: {
            scaleFactor: jasmine.createSpy().andReturn(1)
          },
          margin: {
            top: 10,
            right: 20,
            bottom: 30,
            left: 40
          },
          scales:{
            x: function (v) {
              return v * 20;
            }
          }
        });
      });

      afterEach(function () {
        el.remove();
      });

      it("positions an arrow element to point to the currently selected model", function () {
        view.render();
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('40px');
        expect(view.$el.find('h3')).toHaveHtml('<span class="date">11 – 17 Jun 2013</span> Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>12</dd>');
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('60px');
        expect(view.$el.find('h3')).toHaveHtml('<span class="date">11 – 17 Jun 2013</span> Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>15</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('80px');
        expect(view.$el.find('h3')).toHaveHtml('<span class="date">11 – 17 Jun 2013</span> Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>18</dd>');
      });
    });

  });
});
