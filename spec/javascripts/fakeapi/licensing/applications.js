define([
  'require',
  '../timeseries',
  'fakeapi/random'
],
function (require, Timeseries, Random) {
  
  var TotalApplicationsResponse = Timeseries.extend({
    
    initialize: function () {
      this.rnd = new Random(1);
    },
    
    url: /\/licensing\/?.*\?(.*)/,
    
    getValue: function (start, end) {
      return {
        _count: this.rnd(3e4, 6e4)
      }
    }
    
  });
  
  return TotalApplicationsResponse;
});
