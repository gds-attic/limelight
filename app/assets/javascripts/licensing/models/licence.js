define([
  'extensions/models/model'
],
function (Model) {
  var Licence = Model.extend({
    
    parse: function (data) {
      
      data.slug = data.licenceUrlSlug;
      
      if (data.licenceName && data.licenceName[0]) {
        data.name = data.licenceName[0];
      } else {
        data.name = data.slug;
      }
      
      data.sortName = data.name;
      data.url = '/performance/licensing/licences/' + data.slug;
      
      return data;
    }
  });
  
  return Licence;
});
