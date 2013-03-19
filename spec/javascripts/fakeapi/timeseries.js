define([
  'require',
  './response',
  'lodash'
], function (require, Response, _) {
  
  var TimeseriesResponse = Response.extend({
    
    getData: function (query) {
      // translate Backdrop period to moment period
      var period = query.period + 's';
    
      var start = moment(query.start_at);
      var end = moment(start).add(1, period);
    
      var data = [];
      for (; end <= query.end_at; start.add(1, period), end.add(1, period)) {
        data.push(_.extend({
          '_start_at': start.format(this.dateFormat),
          '_end_at': end.format(this.dateFormat)
        }, this.getValue(start, end)));
      };
    
      return data;
    }
    
  });
  
  return TimeseriesResponse;
});
