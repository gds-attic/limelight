define([
  'extensions/views/conversion-graph/callout',
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
          },
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:21 },
              { title: 'Stage 2', uniqueEvents:24 },
              { title: 'Stage 3', uniqueEvents:27 }
            ])
          }
        ]);
        collection.at(0).get('values').query = new Model({
          start_at: moment('2013-05-27'),
          end_at: moment('2013-06-03')
        });
        collection.at(1).get('values').query = new Model({
          start_at: moment('2013-06-03'),
          end_at: moment('2013-06-10')
        });
        view = new ConversionCallout({
          wrapper:wrapper,
          collection:collection,
          blockMarginFraction: 0.2,
          barMarginFraction: 0.2,
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

      it("creates a callout with information about the currently selected item", function () {
        view.render();
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May – 2 Jun 2013</span> Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>12</dd>');
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May – 2 Jun 2013</span> Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>15</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May – 2 Jun 2013</span> Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>18</dd>');
        
        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 – 9 Jun 2013</span> Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>21</dd>');
        
        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 – 9 Jun 2013</span> Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>24</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 – 9 Jun 2013</span> Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>27</dd>');
      });

      it("positions an arrow element to point to the currently selected model", function () {
        view.render();
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('45px');
        
        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('65px');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('85px');
        
        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('55px');
        
        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('75px');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('95px');
      });
    });

  });
});
