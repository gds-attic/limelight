define([
  'licensing/views/conversion-graph/headline',
  'extensions/models/model',
  'moment'
],
function (Headline, Model, moment) {
  describe("Headline View", function () {

    var collection;
    beforeEach(function() {
      collection = {
        on: jasmine.createSpy(),
        collectionInstances: [
          {
            query: new Model({
              start_at: moment('2013-03-01')
            })
          },
          {
            query: new Model({
              start_at: moment('2013-04-01')
            })
          }
        ]
      };
    });

    describe("initialize", function () {
      it("re-renders when the collection resets", function () {
        var view = new Headline({
          collection: collection
        });
        expect(collection.on).toHaveBeenCalledWith('reset', view.render, view);
      });
    });

    describe("render", function () {
      it("renders a headline string including the start dates of the queries for both items", function () {

        var view = new Headline({
          collection: collection
        });

        jasmine.renderView(view, function () {
          expect(view.$el).toHaveHtml('Percentages of unique visitors at common stages of licensing submissions in <span class="group0">March</span> compared with <span class="group1">April</span>');
        });
        
      });
    });

  });
});
