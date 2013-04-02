define([
  'extensions/model'
],
function (Model) {
  var PerLicenceTableRow = Model.extend({
    parse: function (data) {
      if (data.authorityName && data.authorityName[0]) {
        data.authorityName = data.authorityName[0];
      } else {
        data.authorityName = data.authorityUrlSlug;
      }
      if (data.licenceName && data.licenceName[0]) {
        data.licenceName = data.licenceName[0];
      }
      return data;
    }
  });
  
  return PerLicenceTableRow;
});
