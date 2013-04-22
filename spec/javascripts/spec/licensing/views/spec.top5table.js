define([
  'licensing/views/top5table',
  'extensions/collections/collection'
],
function (Table, Collection) {
  describe("Top5 Table", function () {
    describe("render", function () {
      
      var el, collection, table;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        collection = new Collection([
          { slug: 'authority1', name: 'Authority 1', url: '/url1', _count: 1 },
          { slug: 'authority2', name: 'Authority 2', url: '/url2', _count: 3 },
          { slug: 'authority3', name: 'Authority 3', url: '/url3', _count: 2 }
        ]);
      });

      afterEach(function() {
        el.remove();
      });

      it("displays link to licence page", function () {
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(0) a').text()).toEqual('Authority 2');
        expect(el.find('.body tr:eq(0) td:eq(0) a').prop('href')).toMatch('/url2');
        expect(el.find('.body tr:eq(1) td:eq(0) a').text()).toEqual('Authority 3');
        expect(el.find('.body tr:eq(1) td:eq(0) a').prop('href')).toMatch('/url3');
        expect(el.find('.body tr:eq(2) td:eq(0) a').text()).toEqual('Authority 1');
        expect(el.find('.body tr:eq(2) td:eq(0) a').prop('href')).toMatch('/url1');
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
