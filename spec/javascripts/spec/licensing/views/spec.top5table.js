define([
  'licensing/views/top5table',
  'extensions/collection'
],
function (Table, Collection) {
  describe("Top5 Table", function () {
    describe("render", function () {
      
      var el, collection, table;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        collection = new Collection([
          { licenceName: 'Authority 1', _count: 1 },
          { licenceName: 'Authority 2', _count: 3 },
          { licenceName: 'Authority 3', _count: 2 }
        ]);
      });

      afterEach(function() {
        el.remove();
      });

      it("displays licence name when available", function () {
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(0)').text()).toEqual('Authority 2');
        expect(el.find('.body tr:eq(1) td:eq(0)').text()).toEqual('Authority 3');
        expect(el.find('.body tr:eq(2) td:eq(0)').text()).toEqual('Authority 1');
      });
      
      it("displays authority name when available", function () {
        collection = new Collection([
          { authorityName: 'Licence 1', _count: 1 },
          { authorityName: 'Licence 2', _count: 3 },
          { authorityName: 'Licence 3', _count: 2 }
        ]);
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(0)').text()).toEqual('Licence 2');
        expect(el.find('.body tr:eq(1) td:eq(0)').text()).toEqual('Licence 3');
        expect(el.find('.body tr:eq(2) td:eq(0)').text()).toEqual('Licence 1');
      });
      
      it("sorts by count descending", function () {
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(1)').text()).toEqual('3');
        expect(el.find('.body tr:eq(1) td:eq(1)').text()).toEqual('2');
        expect(el.find('.body tr:eq(2) td:eq(1)').text()).toEqual('1');
      });
      
      it("displays a custom title for first column", function () {
        table = new Table({
          el: el,
          collection: collection,
          title: 'Test Title'
        });
        table.render();
        expect(el.find('th:eq(0)').text()).toEqual('Test Title');
      });
    });
  });
});
