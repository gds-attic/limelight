define([
  './applicationstable'
],
function (ApplicationsTable) {
  var Top5Table = ApplicationsTable.extend({
    
    lazyRender: false,
    
    initialize: function () {
      _.each(this.columns, function (column) {
        column.sortable = false;
      });
      ApplicationsTable.prototype.initialize.apply(this, arguments);
    }
  });
  
  return Top5Table;
});
