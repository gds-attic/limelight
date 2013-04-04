define([
  'require',
  '../response',
  '../random',
  'lodash'
], function (require, Response, Random, _) {
  
  var LicensingResponse = Response.extend({
    
    initialize: function () {
      this.rnd = new Random(1);
    },
    
    url: /\/licensing\/?.*\?(.*)/,
    
    queryId: 'applications-top5-lastmonth',
    
    getData: function (query) {
      
      if (query.group_by == 'authorityUrlSlug') {
        return this.getAuthorities(query);
      }
      
      if (query.group_by == 'licenceUrlSlug') {
        return this.getLicences(query);
      }
      
    },
    
    getAuthorities: function (query) {
      var values = _.map(this.authorities, function (name) {
        return {
          authorityUrlSlug: name.replace(' ', '-').toLowerCase(),
          _count: Math.floor(this.rnd(0, 1e4)),
          authorityName: [name]
        }
      }, this);
      
      return values;
    },
    
    getLicences: function (query) {
      var values = _.map(this.licences, function (name) {
        return {
          licenceUrlSlug: name.replace(' ', '-').toLowerCase(),
          _count: Math.floor(this.rnd(0, 1e4)),
          licenceName: [name]
        }
      }, this);
      
      return values;
    },
    
    authorities: [
      "Powys",
      "Strabane",
      "Tunbridge Wells",
      "West Lothian",
      "Wyre Forest"
    ],
    
    licences: [
      "Hold, keep or release any of the specified species of non-native fish",
      "Approval of meat plants with veterinary attendance",
      "Licenses and consents for structures over, along and under the highway",
      "Transmissible spongiform encephalopathies testing",
      "Licence to buy and sell salmon, trout, pike, eel or pollan"
    ]
    
  });
  
  return LicensingResponse;
});
