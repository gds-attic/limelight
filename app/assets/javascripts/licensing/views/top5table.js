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
          var res = [];
          _.each(['licenceName', 'authorityName'], function (attr) {
            var name = model.get(attr);
            if (name) {
              res.push(name);
            }
          });
          return res.join(' &ndash; ');
        }
      },
      {
        id: '_count',
        title: 'Licence applications',
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
