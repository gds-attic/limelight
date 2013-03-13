define([
  'moment'
],
function (moment) {
  
  var dateFormat = 'YYYY-MM-DDTHH:mm:ssTZ';
  
  var getResponse = function (query) {
    
    var period = query.period + 's';
    
    var start = moment(query.start_at);
    var end = moment(start).add(1, period);
    
    var data = [];
    for (; end <= query.end_at; start.add(1, period), end.add(1, period)) {
      data.push({
        _start_at: start.format(dateFormat),
        _end_at: end.format(dateFormat),
        _count: Math.floor(Math.random() * 6e4)
      });
    };
    
    return {
      data: data
    }
  };

  return {
    url: /\/licensing\/\?(.*)/,
    urlParams: ['query'],
    dataType: 'json',
    response: function(settings) {
      
      var dateParams = ['start_at', 'end_at'];
      
      // extract query parameters, convert to moment dates
      var query = {};
      settings.urlParams.query.replace(
          /([^?=&]+)(?:=([^&]*))?/g,
          function (all, key, value) {
            value = decodeURIComponent(value);
            if (_.contains(dateParams, key)) {
              value = moment(value, dateFormat);
            }
            query[key] = value;
          }
      );
      this.responseText = getResponse(query);
    }
  };
});
