define([
  'require',
  '../response',
  '../random'
],
function (require, Timeseries, Random) {
  
  var ApplicationsPerAuthorityResponse = Timeseries.extend({
    
    initialize: function () {
      this.rnd = new Random(2);
    },
    
    url: /\/licensing\/?.*\?(.*)/,
    
    queryId: 'applications-top5licences-weekly',
    
    getData: function (query) {
      var licences = [
        { slug: 'amusement', name: 'Amusement arcade operation', min: 1e3,  max: 2e3 },
        { slug: 'betting',   name: 'Betting shop operation',     min: 1e3,  max: 1e4 },
        { slug: 'bingo',     name: 'Bingo hall operation',       min: 1e3,  max: 3e4 },
        { slug: 'casino',    name: 'Casino operation',           min: 1e3,  max: 2e4 },
        { slug: 'track',     name: 'Track betting operation',    min: 1e3,  max: 4e4 }
      ];
      
      var that = this;
      return _.map(licences, function (licence) {
        
        var getValue = function (start, end, query) {
          return {
            _count: that.rnd(licence.min, licence.max)
          };
        };
        
        var values = that.getTimeseries(query, getValue);
        
        var authorityUrlSlug = query.filter_by.split(':')[1];
        var authorityName = {
          "fake-authority-1": "Fake Authority One",
          "fake-authority-2": "Fake Authority Two"
        }[authorityUrlSlug];
        
        return {
          values: values,
          licenceUrlSlug: licence.slug,
          licenceName: [licence.name],
          authorityName: [authorityName],
          _group_count: values.length
        }
      });
    }
    
  });
  
  return ApplicationsPerAuthorityResponse;
});
