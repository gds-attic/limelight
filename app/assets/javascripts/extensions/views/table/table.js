define([
  'extensions/views/view'
],
function (View) {
  var Table = View.extend({

    lazyRender: false,
    preventDocumentScroll: true,
    
    initialize: function (options) {
      options = _.extend({}, options);
      var collection = this.collection = options.collection;
      collection.on('reset add remove', this.render, this);
      
      _.bindAll(this, 'adjustTableLayout');
      
      if (this.defaultSortColumn) {
        var column = this.columns[this.defaultSortColumn];
        this.collection.sortByAttr(column.id, column.defaultDescending);
      }
      
      View.prototype.initialize.apply(this, arguments);
    },
    
    events: {
      'click th.sortable': function (e) {
        var th = $(e.target);
        var column = this.columns[this.$el.find('th').index(th)];
        var isCurrent = th.hasClass('descending') || th.hasClass('ascending');
        var descending = isCurrent ? th.hasClass('ascending') : column.defaultDescending;
        this.collection.sortByAttr(column.id, Boolean(descending));
      }
    },

    /**
    * Renders the table using the column definition and the current data.
    */
    render: function () {
      $(window).off('resize', this.adjustTableLayout);

      if (!this.columns) {
        throw('no columns defined for table');
      }

      var el = this.$el;
      el.addClass('outer-table-wrapper');
      el.empty();
      
      var tableHead = $('<table></table>').addClass('head');
      tableHead.appendTo(el);

      var wrapper = $('<div></div>').addClass('inner-table-wrapper');
      wrapper.appendTo(el);
      var tableBody = $('<table></table>').addClass('body');
      tableBody.appendTo(wrapper);

      var thead = $('<thead></thead>');
      thead.appendTo(tableHead);
      this.renderHead(thead);

      var tbody = $('<tbody></tbody>');
      tbody.appendTo(tableBody);
      this.renderBody(tbody, wrapper);

      if (this.preventDocumentScroll) {
        this.applyPreventDocumentScroll(wrapper);
      }
      
      this.adjustTableLayout();
      $(window).on('resize', this.adjustTableLayout);
    },

    close: function () {
      var el = this.$el;
      el.find('.inner-table-wrapper').off('mousewheel');
      el.find('.inner-table-wrapper').off('scroll');
      $(window).off('resize');
      el.find('th').off('touchend');
      el.find('th').off('click');
      el.empty();
    },

    /**
     * Keeps widths of columns in head and body tables in sync.
     */
    adjustTableLayout: function () {
      var el = this.$el;
      
      var head = el.find('table.head');
      var body = el.find('table.body');
      head.css('width', 'auto');
      body.css('width', 'auto');
      
      var tableWidth = el.width();
      head.width(tableWidth);
      body.width(tableWidth);
    },

    /**
    * Renders a thead element with a table row containing th elements.
    * Cell values are retrieved from `title` property of columns definition.
    */
    renderHead: function (thead) {

      var titles = {};
      $.each(this.columns, function (i, column) {
        titles[column.id] = column.title;
      });

      var tr = this.renderRow(titles, {
        header: true,
        allowGetValue: false
      });
      tr.appendTo(thead);

      return thead;
    },

    /**
    * Renders a tbody element with rows for the current data.
    * @param {jQuery} tbody tbody tag to render rows into
    * @param {jQuery} [scrollWrapper=tbody] Scrolling element for lazy render detection, if different from tbody
    */
    renderBody: function (tbody, scrollWrapper) {

      scrollWrapper = scrollWrapper || tbody;

      var data = this.collection;
      var that = this;
      
      if (!data || !data.length) {
        // no data, show placeholder message
        var message = "No data available.";
        
        var placeholderRow = $([
          '<tr class="placeholder"><td colspan="',
          this.columns.length,
          '">',
          message,
          '</td></tr>'
        ].join(''));
        
        tbody.append(placeholderRow);
      } else if (this.lazyRender) {
        // render table on demand in chunks. whenever the user scrolls to the
        // bottom, append another chunk of rows.

        var rowsPerChunk = 30;
        var index = 0;

        var placeholderRow = $('<tr class="placeholder"><td colspan="' + this.columns.length + '">&hellip;</td></tr>');
        // FIXME: placeholder height needs to be measured, rather than hardcoded
        var placeholderHeight = 43;

        var renderChunk = function () {
          placeholderRow.remove();
          var last = Math.min(index + rowsPerChunk, data.length);
          for (; index < last; index++) {
            var tr = that.renderRow.call(that, data.at(index));
            tr.appendTo(tbody);
          };
          if (last < data.length) {
            // more rows available, show placeholder
            tbody.append(placeholderRow);
          }
        }

        scrollWrapper.on('scroll', function (e) {
          var visibleHeight = scrollWrapper.outerHeight();
          var scrollHeight = scrollWrapper.prop('scrollHeight');
          var scrollTop = scrollWrapper.scrollTop();
          var scrolling = (scrollHeight > visibleHeight);

          if (scrollTop + visibleHeight >= scrollHeight - placeholderHeight) {
            // scrolled down to last row, show more
            renderChunk();
          }
        });

        // render first chunk
        renderChunk();

      } else {
        // render whole table in one go
        data.each(function (model, index) {
          var tr = this.renderRow(model);
          tr.appendTo(tbody);
        }, this);
      }

      return tbody;
    },

    /**
    * Renders a row of table cells.
    * @param {Object} model Data for this row.
    * @param {Object} [options={}] Render options
    * @param {Array} [options.columns=this.columns] Column definition, defaults to instance columns. See GOVUK.Insights.prototype.columns for syntax.
    * @param {Boolean} [options.header=false] Render table header cells instead of body cells
    */
    renderRow: function (model, options) {
      options = _.extend({
        columns: this.columns,
        header: false,
        valueKey: 'id',
        allowGetValue: true
      }, options);

      var tr = $('<tr></tr>');

      var tdString = options.header ? '<th></th>' : '<td></td>';

      var that = this;
      _.each(options.columns, function (column, i) {
        var td = $(tdString);
        td.addClass(column.className || column.id);

        var value;
        if (options.allowGetValue && typeof column.getValue === 'function') {
          value = column.getValue.call(that, model, column); 
        } else {
          if (_.isFunction(model.get)) {
            value = model.get(column.id);
          } else if (_.isFunction(model[column.id])) {
            value = model[column.id].call(that);
          } else {
            value = model[column.id];
          }
        }
        td.html(value);
        td.appendTo(tr);

        if (options.header && column.sortable) {
          td.addClass('sortable');

          var currentSortColumn = (column.id === that.collection.sortAttr);

          if (currentSortColumn) {
            td.addClass(that.collection.sortDescending ? 'descending' : 'ascending');
          }
        }
      }, this);

      return tr;
    },

    /**
    * Stops the page from scrolling when the user scrolls inside the table
    */
    applyPreventDocumentScroll: function (el) {

      el.on('mousewheel', function (e, delta, deltaX, deltaY) {

        var visibleHeight = el.outerHeight();
        var scrollHeight = el.prop('scrollHeight');

        if (scrollHeight <= visibleHeight) {
          // nothing to do if there are no scrollbars
          return;
        }

        // prevent document scroll if scrolling upwards at the top
        var scrollTop = el.scrollTop();
        if (scrollTop == 0 && deltaY > 0) {
          e.preventDefault();
          return;
        }

        // prevent document scroll if scrolling downwards at the bottom
        if (scrollTop + visibleHeight >= scrollHeight && deltaY < 0) {
          e.preventDefault();
          return;
        }
      });
    }
  });

  return Table;
});
