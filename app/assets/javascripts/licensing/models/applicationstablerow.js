define([
  'extensions/model'
],
function (Model) {
  var ApplicationsTableRow = Model.extend({
    parse: function (data) {
      if (data.authorityName && data.authorityName[0]) {
        data.authorityName = data.authorityName[0];
      } else if (data.authorityUrlSlug) {
        data.authorityName = data.authorityUrlSlug;
      }
      if (data.licenceName && data.licenceName[0]) {
        data.licenceName = data.licenceName[0];
      } else if (data.licenceUrlSlug) {
        data.licenceName = data.licenceUrlSlug;
      }
      return data;
    }
  });
  
  return ApplicationsTableRow;
});
