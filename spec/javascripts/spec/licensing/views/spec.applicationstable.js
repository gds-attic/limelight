define([
  'licensing/views/applicationstable',
  'extensions/collections/collection'
],
function (Table, Collection) {
  describe("Applications Table", function () {
    describe("render", function () {
      
      var el, collection, table;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        collection = new Collection([
          { name: 'Authority 1', sortName: 'sortB', url: '/url1', _count: 1 },
          { name: 'Authority 2', sortName: 'sortC', url: '/url2', _count: 3 },
          { name: 'Authority 3', sortName: 'sortA', url: '/url3', _count: 2 }
        ]);
        spyOn(collection, "sortByAttr").andCallThrough();
      });

      afterEach(function() {
        el.remove();
      });

      it("displays link to entity detail page", function () {
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
      
      it("sorts by count descending by default", function () {
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        expect(el.find('.body tr:eq(0) td:eq(1)').text()).toEqual('3');
        expect(el.find('.body tr:eq(1) td:eq(1)').text()).toEqual('2');
        expect(el.find('.body tr:eq(2) td:eq(1)').text()).toEqual('1');
        expect(collection.sortByAttr).toHaveBeenCalledWith('_count', true, { silent: true });
      });
    });
  });
});
