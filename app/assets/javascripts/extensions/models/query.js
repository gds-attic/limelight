define([
  'extensions/models/model'
],
function (Model) {
  var Query = Model.extend({
    
    set: function (attrs, options) {
      if (!_.isObject(attrs)) {
        key = attrs;
        (attrs = {})[key] = options;
        options = arguments[2];
      }
      
      var periodName = attrs['period'];
      var period = periodName ? this.periods[periodName] : null;
      if (period) {
        var endAt = period.boundary(this.moment());
        var startAt = endAt.clone().subtract(period.duration, periodName + 's');
        _.extend(attrs, {
          end_at: endAt,
          start_at: startAt
        });
      }
      
      Model.prototype.set.call(this, attrs, options);
    },
    
    periods: {
      week: {
        boundary: function (date) {
          return date.utc().day(1).startOf('day');
        },
        duration: 9
      },
      month: {
        boundary: function (date) {
          return date.utc().startOf('month');
        },
        duration: 12
      }
    }
  });
  
  return Query;
});
