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
    
    queryId: 'totalapplications',
    
    getData: function (query) {
      var rnd = this.rnd;
      var getValue = function (start, end, query) {
        return {
          _count: rnd(3e4, 6e4)
        }
      };
      return this.getTimeseries(query, getValue);
    }
  });
  
  return TotalApplicationsResponse;
});
