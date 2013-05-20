define([
  'require',
  '../response',
  'fakeapi/random'
],
function (require, Response, Random) {
  
  var TotalApplicationsResponse = Response.extend({
    
    initialize: function () {
      this.rnd = new Random(1);
    },
    
    url: /\/licensing\/?.*\?(.*)/,
    
    queryId: 'applications-total-weekly',
    
    getData: function (query) {
      var rnd = this.rnd;
      var getValue = function (start, end, query) {
        if (query.period === 'month') {
          max = 30e4;
        } else {
          max = 6e4;
        }
        return {
          _count: rnd(3e4, max)
        }
      };
      return this.getTimeseries(query, getValue);
    }
  });
  
  return TotalApplicationsResponse;
});
