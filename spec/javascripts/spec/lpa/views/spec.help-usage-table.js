define([
  'lpa/views/help-usage-table',
  'extensions/collections/collection'
],
  function (Table, Collection) {
    describe("Help usage table", function () {
      describe("render", function () {

        var collection;
        beforeEach(function() {
          collection = new Collection([
            { count: 1230000, description: 'abc' },
            { count: 4560, description: 'def' },
            { count: 789, description: 'fgh' },
          ]);
        });

        it("displays usage sorted by count descending", function () {
          var table = new Table({
            collection: collection
          });
          jasmine.renderView(table, function () {
            expect(table.$el.find('.head tr:eq(0) th:eq(0)')).toHaveText('Description');
            expect(table.$el.find('.head tr:eq(0) th:eq(1)')).toHaveText('Usage last week');
            expect(table.$el.find('.head tr:eq(0) th:eq(1)')).toHaveClass('descending');

            expect(table.$el.find('.body tr:eq(0) td:eq(0)')).toHaveText('Abc');
            expect(table.$el.find('.body tr:eq(1) td:eq(0)')).toHaveText('Def');
            expect(table.$el.find('.body tr:eq(2) td:eq(0)')).toHaveText('Fgh');

            expect(table.$el.find('.body tr:eq(0) td:eq(1)')).toHaveText('1.23m');
            expect(table.$el.find('.body tr:eq(1) td:eq(1)')).toHaveText('4.56k');
            expect(table.$el.find('.body tr:eq(2) td:eq(1)')).toHaveText('0.79k');
          });
        });
      });

      describe("sanitization", function() {
        var collection;
        beforeEach(function() {
          collection = new Collection([
            { count: 1, description: 'capital' },
            { count: 1, description: 'multiple-words' },
            { count: 1, description: 'with-lpa-in-capitals' },
            { count: 1, description: '2-with-numbers-42' },
            { count: 1, description: 'have-lpa-in-word-like-alpaca' },
            { count: 1, description: 'lpa-at-start' },
            { count: 1, description: 'ending-in-lpa' }
          ]);
        });

        it("sanitizes description", function () {
          var table = new Table({
            collection: collection
          });
          jasmine.renderView(table, function () {
            expect(table.$el.find('.body tr:eq(0) td:eq(0)')).toHaveText('Capital');
            expect(table.$el.find('.body tr:eq(1) td:eq(0)')).toHaveText('Multiple words');
            expect(table.$el.find('.body tr:eq(2) td:eq(0)')).toHaveText('With LPA in capitals');
            expect(table.$el.find('.body tr:eq(3) td:eq(0)')).toHaveText('2 with numbers 42');
            expect(table.$el.find('.body tr:eq(4) td:eq(0)')).toHaveText('Have LPA in word like alpaca');
            expect(table.$el.find('.body tr:eq(5) td:eq(0)')).toHaveText('LPA at start');
            expect(table.$el.find('.body tr:eq(6) td:eq(0)')).toHaveText('Ending in LPA');
          });
        });
      });
    });
  });
