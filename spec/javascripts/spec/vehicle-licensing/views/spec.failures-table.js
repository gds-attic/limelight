define([
  'vehicle-licensing/views/failures-table',
  'extensions/collections/collection'
],
function (Table, Collection) {
  describe("Top5 Table", function () {
    describe("render", function () {
      
      var collection;
      beforeEach(function() {
        collection = new Collection([
          { count: 52, fraction: 0.5, change: 20, description: 'Foo' },
          { count: 2213, fraction: 0.3, change: null, description: 'Bar' },
          { count: 1, fraction: 0.1, change: -4199, description: 'Baz' }
        ]);
      });

      it("displays failures sorted by count descending", function () {
        var table = new Table({
          collection: collection
        });
        jasmine.renderView(table, function () {
          expect(table.$el.find('.head tr:eq(0) th:eq(0)')).toHaveText('Description');
          expect(table.$el.find('.head tr:eq(0) th:eq(1)')).toHaveText('Occurrences last week');
          expect(table.$el.find('.head tr:eq(0) th:eq(1)')).toHaveClass('descending');
          expect(table.$el.find('.head tr:eq(0) th:eq(2)')).toHaveText('Percentage of total errors');
          expect(table.$el.find('.head tr:eq(0) th:eq(3)')).toHaveText('Difference from week before');

          expect(table.$el.find('.body tr:eq(0) td:eq(0)')).toHaveText('Bar');
          expect(table.$el.find('.body tr:eq(1) td:eq(0)')).toHaveText('Foo');
          expect(table.$el.find('.body tr:eq(2) td:eq(0)')).toHaveText('Baz');

          expect(table.$el.find('.body tr:eq(0) td:eq(1)')).toHaveText('2.21k');
          expect(table.$el.find('.body tr:eq(0) td:eq(2)')).toHaveText('30%');
          expect(table.$el.find('.body tr:eq(0) td:eq(3)')).toHaveText('-');

          expect(table.$el.find('.body tr:eq(1) td:eq(1)')).toHaveText('52');
          expect(table.$el.find('.body tr:eq(1) td:eq(2)')).toHaveText('50%');
          expect(table.$el.find('.body tr:eq(1) td:eq(3)')).toHaveText('+20');
        });
      });
    });
  });
});
