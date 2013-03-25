define([
  'require',
  '../timeseries',
  'fakeapi/random'
],
function (require, Timeseries, Random) {
  
  var ApplicationsPerLicenceResponse = Timeseries.extend({
    
    initialize: function () {
      this.rnd = new Random(1);
    },
    
    url: /\/licensing\/?.*\?(.*group_by=authorityUrlSlug.*)/,
    
    getValue: function (start, end) {
      return {
        authorityUrlSlug: {
          westminster: {
            _count: this.rnd(1e3, 3e4),
            authorityName: ['Westminster']
          },
          croydon: {
            _count: this.rnd(1e3, 2e4),
            authorityName: ['Croydon']
          },
          wandsworth: {
            _count: this.rnd(1e3, 2e4),
            authorityName: ['Wandsworth']
          },
          lambeth: {
            _count: this.rnd(1e3, 2e3),
            authorityName: ['Lambeth']
          },
          bristol: {
            _count: this.rnd(1e3, 1e4),
            authorityName: ['Bristol']
          },
          
        }
      }
    }
    
  });
  
  return ApplicationsPerLicenceResponse;
});
