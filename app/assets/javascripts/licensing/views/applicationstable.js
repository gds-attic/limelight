define([
  'extensions/table/table'
],
function (Table) {
  var ApplicationsTable = Table.extend({
    
    lazyRender: true,
    
    columns: [
      {
        id: 'group',
        className: 'js_group',
        title: 'Licence',
        sortable: true,
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
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatNumericLabel(model.get('_count'));
        }
      }
    ],
    
    defaultSortColumn: 1
  });
  
  return ApplicationsTable;
});
