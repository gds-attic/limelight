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
        { slug: 'westminster', name: 'London Borough of Westminster', min: 1e4,  max: 3e4 },
        { slug: 'croydon',     name: 'London Borough of Croydon'    , min: 1e3,  max: 4e3 },
        { slug: 'wandsworth',  name: 'London Borough of Wandsworth' , min: 1e3,  max: 2e4 },
        { slug: 'lambeth',     name: 'London Borough of Lambeth'    , min: 1e3,  max: 2e3 },
        { slug: 'bristol',     name: 'Bristol City Council'         , min: 1e3,  max: 1e4 }
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
