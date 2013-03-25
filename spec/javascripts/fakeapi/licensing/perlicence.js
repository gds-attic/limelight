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
    
    getValue: function (start, end, query) {
      
      var values = {
        authorityUrlSlug: {
          westminster: {
            _count: this.rnd(1e3, 3e3),
            authorityName: ['Westminster']
          },
          croydon: {
            _count: this.rnd(1e3, 4e3),
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
      };
      
      var licenceUrlSlug = query.filter_by;
      var licenceName = {
        "application-to-licence-a-street-collection": "Application to licence a street collection",
        "register-as-a-scrap-metal-dealer": "Register as a scrap metal dealer"
      }[licenceUrlSlug];
      _.each(values.authorityUrlSlug, function (value, key) {
        value.licenceName = [licenceName];
      });
      
      return values;
    }
    
  });
  
  return ApplicationsPerLicenceResponse;
});
