define([
  'extensions/table/table'
],
function (Table) {
  var Top5Table = Table.extend({
    
    lazyRender: false,
    
    columns: [
      {
        id: 'group',
        className: 'js_group',
        title: function () {
          return this.options.title || 'Licence';
        },
        sortable: false,
        getValue: function (model) {
          return $('<a>').text(model.get('name')).prop('href', model.get('url'));
        }
      },
      {
        id: '_count',
        title: 'Applications last week',
        sortable: false,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatNumericLabel(model.get('_count'));
        }
      }
    ],
    
    defaultSortColumn: 1
  });
  
  return Top5Table;
});
