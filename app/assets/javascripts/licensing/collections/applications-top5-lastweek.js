define([
  'require',
  './all-entities'
],
function (require, AllEntitiesCollection) {

  var Top5Collection = AllEntitiesCollection.extend({
    
    queryId: 'applications-top5-lastweek',

    queryParams: function () {
      var params = AllEntitiesCollection.prototype.queryParams.apply(this, arguments);
      var lastWeek = this.lastWeekDateRangeParams(this.moment().utc());

      return _.extend(params, lastWeek, {
        limit: 5,
        sort_by: '_count:descending'
      });
    }
  });

  return Top5Collection;
});
