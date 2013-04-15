define([
  'licensing/views/applicationstable',
  'extensions/collection'
],
function (Table, Collection) {
  describe("Licence Applications Table", function () {
    describe("render", function () {
      
      var el, collection, table;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        collection = new Collection([
          { authorityName: 'Authority 1', authoritySortName: 'sortB', licenceName: 'Licence 1', _count: 1 },
          { authorityName: 'Authority 2', authoritySortName: 'sortC', licenceName: 'Licence 2', _count: 3 },
          { authorityName: 'Authority 3', authoritySortName: 'sortA', licenceName: 'Licence 3', _count: 2 }
        ]);
        
      });

      afterEach(function() {
        el.remove();
      });

      it("displays concatenation of licence name and authority name when available", function () {
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(0)').text()).toEqual('Licence 2 – Authority 2');
        expect(el.find('.body tr:eq(1) td:eq(0)').text()).toEqual('Licence 3 – Authority 3');
        expect(el.find('.body tr:eq(2) td:eq(0)').text()).toEqual('Licence 1 – Authority 1');
      });
      
      it("displays concatenation authority name only when licence name is not available", function () {
        delete collection.at(0).attributes.licenceName;
        delete collection.at(2).attributes.licenceName;
        
        table = new Table({
          el: el,
          collection: collection
        });
        table.render();
        
        expect(el.find('.body tr:eq(0) td:eq(0)').text()).toEqual('Licence 2 – Authority 2');
        expect(el.find('.body tr:eq(1) td:eq(0)').text()).toEqual('Authority 3');
        expect(el.find('.body tr:eq(2) td:eq(0)').text()).toEqual('Authority 1');
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
        expect(el.find('.head tr:eq(0) th:eq(1)').hasClass('descending')).toBe(true);
      });
    });
  });
});
