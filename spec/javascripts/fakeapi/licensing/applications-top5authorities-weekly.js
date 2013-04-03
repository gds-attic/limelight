define([
  'require',
  '../response',
  'fakeapi/random'
],
function (require, Timeseries, Random) {
  
  var ApplicationsPerLicenceResponse = Timeseries.extend({
    
    initialize: function () {
      this.rnd = new Random(1);
    },
    
    url: /\/licensing\/?.*\?(.*)/,
    
    queryId: 'applications-top5authorities-weekly',
    
    getData: function (query) {
      var authorities = [
        { slug: 'westminster', name: 'Westminster', min: 1e3,  max: 3e3 },
        { slug: 'croydon',     name: 'Croydon'    , min: 1e3,  max: 4e3 },
        { slug: 'wandsworth',  name: 'Wandsworth' , min: 1e3,  max: 2e4 },
        { slug: 'lambeth',     name: 'Lambeth'    , min: 1e3,  max: 2e3 },
        { slug: 'bristol',     name: 'Bristol'    , min: 1e3,  max: 1e4 }
      ];
      
      var that = this;
      return _.map(authorities, function (authority) {
        
        var getValue = function (start, end, query) {
          return {
            _count: that.rnd(authority.min, authority.max)
          };
        };
        
        var values = that.getTimeseries(query, getValue);
        
        var licenceUrlSlug = query.filter_by.split(':')[1];
        var licenceName = {
          "application-to-licence-a-street-collection": "Application to licence a street collection",
          "register-as-a-scrap-metal-dealer": "Register as a scrap metal dealer"
        }[licenceUrlSlug];
        
        return {
          values: values,
          authorityUrlSlug: authority.slug,
          authorityName: [authority.name],
          licenceName: [licenceName],
          _group_count: values.length
        }
      });
    }
    
  });
  
  return ApplicationsPerLicenceResponse;
});
