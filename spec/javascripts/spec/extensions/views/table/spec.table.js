define([
  'extensions/views/table/table',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (Table, Collection, Model) {
  describe("Table", function() {
    
    describe("events", function () {
      var el, collection, table;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        var TestTable = Table.extend({
          columns: [
            {
              id: 'foo',
              title: 'Foo Title',
              sortable: true
            },
            {
              id: 'bar',
              title: 'Bar Title',
              className: 'barclass',
              sortable: true,
              defaultDescending: true
            }
          ]
        });

        collection = new Collection([
          { foo: 4, bar: 'one' },
          { foo: 2, bar: 'two' },
          { foo: 3, bar: 'three' }
        ]);
        
        spyOn(collection, "sortByAttr").andCallThrough();

        table = new TestTable({
          el: el,
          collection: collection
        });
        table.render();
      });

      afterEach(function() {
        el.remove();
      });

      it("re-sorts collection by column in default ascending direction", function () {
        el.find('th:eq(0)').click();
        expect(collection.sortByAttr).toHaveBeenCalledWith('foo', false);
      });
      
      it("re-sorts collection by column in default descending direction", function () {
        el.find('th:eq(1)').click();
        expect(collection.sortByAttr).toHaveBeenCalledWith('bar', true);
      });
      
      it("re-sorts collection by column and toggles direction when column is current sort column", function () {
        el.find('th:eq(0)').click();
        expect(collection.sortByAttr.argsForCall[0]).toEqual(['foo', false]);
        
        el.find('th:eq(0)').click();
        expect(collection.sortByAttr.argsForCall[1]).toEqual(['foo', true]);
        
        el.find('th:eq(1)').click();
        expect(collection.sortByAttr.argsForCall[2]).toEqual(['bar', true]);
        
        el.find('th:eq(1)').click();
        expect(collection.sortByAttr.argsForCall[3]).toEqual(['bar', false]);
      });
    });

    describe("render", function() {
      
      var el;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
      });

      afterEach(function() {
        el.remove();
      });

      it("requires a columns definition", function() {
        expect(function () {
          var table = new Table({
            el: el
          });
          table.render();
        }).toThrow();
      });

      it("renders a table head and table body", function() {
        var table = new Table({
          el: el,
          collection: {
            on: jasmine.createSpy()
          }
        });

        spyOn(table, "renderHead").andReturn($('<thead></thead>'));
        spyOn(table, "renderBody").andReturn($('<tbody></tbody>'));

        table.columns = {};
        table.render();

        expect(table.renderHead).toHaveBeenCalled();
        expect(table.renderBody).toHaveBeenCalled();

        expect(el.find('thead').length).toEqual(1);
        expect(el.find('tbody').length).toEqual(1);
      });
    });

    describe("renderHead", function() {

      var table;
      beforeEach(function() {
        
        TestTable = Table.extend({
          columns: [
            {
              id: 'foo',
              title: 'Foo Title'
            },
            {
              id: 'bar',
              title: function () {
                return this.options.barTitle;
              },
              className: 'barclass'
            }
          ]
        });
        
        table = new TestTable({
          barTitle: 'Bar Title',
          collection: {
            on: jasmine.createSpy()
          }
        });
      });

      it("renders table header", function() {
        var thead = table.renderHead($('<thead></thead>'));
        expect(thead.prop('tagName').toLowerCase()).toEqual('thead');
        var tr = thead.find('tr');
        expect(tr.length).toEqual(1);
        var ths = tr.find('th');
        expect(ths.length).toEqual(2);
        expect(ths.eq(0).html()).toEqual('Foo Title');
        expect(ths.eq(1).html()).toEqual('Bar Title');
        expect(ths.eq(1).hasClass('barclass')).toBe(true);
      });
    });

    describe("renderBody", function() {

      var createData = function (numEntries) {
        var data = [];
        for (var i = 0; i < numEntries; i++) {
          data.push({
            foo: 'foo' + i,
            bar: 'bar' + i
          });
        };
        return data;
      };

      var table;
      beforeEach(function() {
        var TestTable = Table.extend({
          columns: [
            {
              id: 'foo',
              title: 'Foo Title'
            },
            {
              id: 'bar',
              title: 'Bar Title',
              className: 'barclass'
            }
          ]
        });
        
        var collection = new Collection(createData(100));

        table = new TestTable({
          collection: collection
        });
      });

      it("renders a placeholder message when there is no data", function() {
        
        table.collection.reset([], {silent: true})

        var el = $('<table></table>');
        var tbody = $('<tbody></tbody>').appendTo(el);
        table.renderBody(tbody);

        expect(tbody.prop('tagName').toLowerCase()).toEqual('tbody');

        var tr = tbody.find('tr');
        expect(tr.length).toEqual(1);

        var tds = tr.eq(0).find('td');
        expect(tds.length).toEqual(1);
        expect(tds.eq(0).html()).toEqual('No data available.');
      });

      it("renders a placeholder message while data is being retrieved", function() {
        
        table.collection.loading = true;

        var el = $('<table></table>');
        var tbody = $('<tbody></tbody>').appendTo(el);
        table.renderBody(tbody);

        expect(tbody.prop('tagName').toLowerCase()).toEqual('tbody');

        var tr = tbody.find('tr');
        expect(tr.length).toEqual(1);

        var tds = tr.eq(0).find('td');
        expect(tds.length).toEqual(1);
        expect(tds.eq(0).html()).toEqual('Loading…');
      });

      it("renders table body", function() {

        var el = $('<table></table>');
        var tbody = $('<tbody></tbody>').appendTo(el);
        table.renderBody(tbody);

        expect(tbody.prop('tagName').toLowerCase()).toEqual('tbody');

        var tr = tbody.find('tr');
        expect(tr.length).toEqual(100);

        var tds0 = tr.eq(0).find('td');
        expect(tds0.length).toEqual(2);
        expect(tds0.eq(0).html()).toEqual('foo0');
        expect(tds0.eq(1).html()).toEqual('bar0');
        expect(tds0.eq(1).hasClass('barclass')).toBe(true);

        var tds99 = tr.eq(99).find('td');
        expect(tds99.length).toEqual(2);
        expect(tds99.eq(0).html()).toEqual('foo99');
        expect(tds99.eq(1).html()).toEqual('bar99');
        expect(tds99.eq(1).hasClass('barclass')).toBe(true);
      });
      
      describe("lazy rendering", function () {
        
        var el, tbody;
        beforeEach(function() {
          table.lazyRender = true;
          el = $('<table></table>').appendTo($('body'));
          tbody = $('<tbody></tbody>').appendTo(el);
        });
        
        afterEach(function() {
          el.remove();
        });
        
        it("renders full table body for small number of rows when lazy render is active", function() {
          table.collection.reset(table.collection.slice(0, 30));
          table.renderBody(tbody);
          expect(tbody.find('tr').length).toEqual(30);
        });

        it("renders partial table body for large number of rows when lazy render is active and renders a placeholder row", function() {
          table.renderBody(tbody);
          expect(tbody.find('tr').length).toEqual(31);
          expect(tbody.find('tr:last-child td a.js-load-more').length).toEqual(1);
        });
        
        it("renders additional rows when user clicks on link in placeholder row", function() {
          table.renderBody(tbody);
          expect(tbody.find('tr').length).toEqual(31);
          expect(tbody.find('tr:eq(0) td:eq(0)')).toHaveText('foo0');
          expect(tbody.find('tr:eq(29) td:eq(0)')).toHaveText('foo29');

          var loadMoreLink = tbody.find('tr:last-child td a');
          loadMoreLink.click();
          
          expect(tbody.find('tr').length).toEqual(61);
          expect(tbody.find('tr:eq(30) td:eq(0)')).toHaveText('foo30');
          expect(tbody.find('tr:eq(59) td:eq(0)')).toHaveText('foo59');
          
          var loadMoreLink = tbody.find('tr:last-child td a');
          loadMoreLink.click();
          
          expect(tbody.find('tr').length).toEqual(91);
          expect(tbody.find('tr:eq(60) td:eq(0)')).toHaveText('foo60');
          expect(tbody.find('tr:eq(89) td:eq(0)')).toHaveText('foo89');
          
          var loadMoreLink = tbody.find('tr:last-child td a');
          loadMoreLink.click();
          
          expect(tbody.find('tr').length).toEqual(100);
          expect(tbody.find('tr:eq(90) td:eq(0)')).toHaveText('foo90');
          expect(tbody.find('tr:eq(99) td:eq(0)')).toHaveText('foo99');
          
          expect(tbody.find('tr:last-child td a').length).toEqual(0);
        });
        
        it("renders additional rows when user scrolls to placeholder row", function() {
          var scrollHeight = 500;
          var scrollTop = 0;
          var scrollHeightSpy = jasmine.createSpy();
          scrollHeightSpy.plan = function (prop) {
            if (prop === 'scrollHeight') {
              return scrollHeight;
            }
          };
          var scrollTopSpy = jasmine.createSpy();
          scrollTopSpy.plan = function () {
            return scrollTop;
          };
          
          var scrollWrapper = {
            outerHeight: jasmine.createSpy().andReturn(200),
            prop: scrollHeightSpy,
            scrollTop: scrollTopSpy,
            on: jasmine.createSpy()
          };
          
          table.renderBody(tbody, scrollWrapper);
          expect(scrollWrapper.on.argsForCall[0][0]).toEqual('scroll');
          var scrollListener = scrollWrapper.on.argsForCall[0][1];
          
          expect(tbody.find('tr').length).toEqual(31);
          expect(tbody.find('tr:eq(0) td:eq(0)')).toHaveText('foo0');
          expect(tbody.find('tr:eq(29) td:eq(0)')).toHaveText('foo29');
          
          scrollTop = 300;
          scrollListener();
          
          expect(tbody.find('tr').length).toEqual(61);
          expect(tbody.find('tr:eq(30) td:eq(0)')).toHaveText('foo30');
          expect(tbody.find('tr:eq(59) td:eq(0)')).toHaveText('foo59');
          
          scrollHeight = 800;
          scrollTop = 600;
          scrollListener();
          
          expect(tbody.find('tr').length).toEqual(91);
          expect(tbody.find('tr:eq(60) td:eq(0)')).toHaveText('foo60');
          expect(tbody.find('tr:eq(89) td:eq(0)')).toHaveText('foo89');
          
          scrollHeight = 1100;
          scrollTop = 900;
          scrollListener();
          
          expect(tbody.find('tr').length).toEqual(100);
          expect(tbody.find('tr:eq(90) td:eq(0)')).toHaveText('foo90');
          expect(tbody.find('tr:eq(99) td:eq(0)')).toHaveText('foo99');
          
          expect(tbody.find('tr:last-child td a').length).toEqual(0);
        });
      });

    });

    describe("renderRow", function() {

      var renderRow = Table.prototype.renderRow;

      var model, table;
      beforeEach(function() {
        
        var TestTable = Table.extend({
          columns: [
            {
              id: 'foo'
            },
            {
              id: 'bar',
              className: 'barclass'
            }
          ],
          defaultSortColumn: 1
        });
        
        model = new Model({
          bar: 'bar title',
          foo: 'foo title'
        });
        table = new TestTable({
          collection: new Collection([model])
        });
      });

      it("renders a table row", function() {
        var tr = table.renderRow(model);

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('td');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).html()).toEqual('foo title');
        expect(cells.eq(1).html()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
      });

      it("renders a table header row", function() {
        var tr = table.renderRow(model, {
          header: true
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).html()).toEqual('foo title');
        expect(cells.eq(1).html()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
      });

      it("renders a table header row for sortable columns", function() {
        table.columns[0].sortable = true;
        table.columns[1].sortable = true;
        var tr = table.renderRow(model, {
          header: true
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).text()).toEqual('foo title');
        expect(cells.eq(1).text()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
        expect(cells.eq(0).hasClass('sortable')).toBe(true);
        expect(cells.eq(1).hasClass('sortable')).toBe(true);
      });

      it("renders a table header row for sortable columns and indicates current sort column ascending", function() {
        table.columns[0].sortable = true;
        table.columns[1].sortable = true;

        var tr = table.renderRow(model, {
          header: true
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).text()).toEqual('foo title');
        expect(cells.eq(1).text()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
        expect(cells.eq(0).hasClass('sortable')).toBe(true);
        expect(cells.eq(1).hasClass('sortable')).toBe(true);
        expect(cells.eq(1).hasClass('ascending')).toBe(true);
        expect(cells.eq(1).hasClass('descending')).toBe(false);
      });

      it("renders a table header row for sortable columns and indicates current sort column descending", function() {
        table.columns[0].sortable = true;
        table.columns[1].sortable = true;
        table.collection.sortDescending = true;

        var tr = table.renderRow(model, {
          header: true
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).text()).toEqual('foo title');
        expect(cells.eq(1).text()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
        expect(cells.eq(0).hasClass('sortable')).toBe(true);
        expect(cells.eq(1).hasClass('sortable')).toBe(true);
        expect(cells.eq(1).hasClass('ascending')).toBe(false);
        expect(cells.eq(1).hasClass('descending')).toBe(true);
      });

      it("renders a table row with dynamic cell content", function() {
        table.columns[0].getValue = function (model, column) {
          return model.get('bar') + ' and ' + model.get(column.id);
        };
        var tr = table.renderRow(model, {
          header: true
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).html()).toEqual('bar title and foo title');
        expect(cells.eq(1).html()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
      });

      it("renders a table row ignoring dynamic cell content when it is disallowed", function() {
        table.columns[0].getValue = function (model, column) {
          return model.get('bar') + ' and ' + model.get(column.id);
        };
        var tr = table.renderRow(model, {
          header: true,
          allowGetValue: false
        });

        expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
        var cells = tr.find('th');
        expect(cells.length).toEqual(2);
        expect(cells.eq(0).html()).toEqual('foo title');
        expect(cells.eq(1).html()).toEqual('bar title');
        expect(cells.eq(1).hasClass('barclass')).toBe(true);
      });

      it("adds fallback classes to the first and last element in a body row", function() {
        var tr = table.renderRow(model);
        var cells = tr.find('td');
        expect(cells.eq(0)).toHaveClass('first-child');
        expect(cells.eq(1)).toHaveClass('last-child');
      });

      it("adds fallback classes to the first and last element in a header row", function() {
        var tr = table.renderRow(model, {
          header: true
        });
        var cells = tr.find('th');
        expect(cells.eq(0)).toHaveClass('first-child');
        expect(cells.eq(1)).toHaveClass('last-child');
      });
    });

    describe("applyPreventDocumentScroll", function () {

      var table, tbody, handler, evt;
      beforeEach(function() {
        table = new Table({
          collection: {
            on: jasmine.createSpy()
          }
        });
        tbody = {
          outerHeight: jasmine.createSpy(),
          scrollTop: jasmine.createSpy(),
          prop: jasmine.createSpy(),
          on: jasmine.createSpy()
        };
        table.applyPreventDocumentScroll(tbody);
        handler = tbody.on.argsForCall[0][1];
        evt = {
          preventDefault: jasmine.createSpy()
        };
      });

      it("applies mousewheel handler", function() {
        table.applyPreventDocumentScroll(tbody);
        expect(tbody.on).toHaveBeenCalled();
        expect(tbody.on.argsForCall[0][0]).toEqual('mousewheel');
        expect(typeof tbody.on.argsForCall[0][1]).toEqual('function');
      });

      it("prevents mousewheel default event when scrolling upwards at the top", function() {
        tbody.scrollTop.andReturn(0);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(600);
        handler(evt, null, null, 1);
        expect(evt.preventDefault).toHaveBeenCalled();
      });

      it("prevents mousewheel default event when scrolling downwards at the bottom", function() {
        tbody.scrollTop.andReturn(200);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(600);
        handler(evt, null, null, -1);
        expect(evt.preventDefault).toHaveBeenCalled();
      });

      it("does not prevent mousewheel default event when scrolling downwards at the top", function() {
        tbody.scrollTop.andReturn(0);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(600);
        handler(evt, null, null, -1);
        expect(evt.preventDefault).not.toHaveBeenCalled();
      });

      it("does not prevent mousewheel default event when scrolling upwards at the bottom", function() {
        tbody.scrollTop.andReturn(200);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(600);
        handler(evt, null, null, 1);
        expect(evt.preventDefault).not.toHaveBeenCalled();
      });

      it("does not prevent mousewheel default event when scrolling in the middle", function() {
        tbody.scrollTop.andReturn(100);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(600);
        handler(evt, null, null, -1);
        expect(evt.preventDefault).not.toHaveBeenCalled();
        handler(evt, null, null, 1);
        expect(evt.preventDefault).not.toHaveBeenCalled();
      });

      it("does not prevent mousewheel default event when scrollbars are not active", function() {
        tbody.scrollTop.andReturn(0);
        tbody.outerHeight.andReturn(400);
        tbody.prop.andReturn(400);
        handler(evt, null, null, 1);
        expect(evt.preventDefault).not.toHaveBeenCalled();
      });

    });

  });
});
