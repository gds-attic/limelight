define([
  'require',
  'extensions/models/model',
  '../mixins/authorityhelpers'
],
function (require, Model, AuthorityHelpersMixin) {
  var Entity = Model.extend({
    parse: function (data) {
      if (data.authorityName && data.authorityName[0]) {
        data.authorityName = data.authorityName[0];
      } else if (data.authorityUrlSlug) {
        data.authorityName = data.authorityUrlSlug;
      }
      if (data.authorityName) {
        data.authoritySortName = this.getAuthoritySortName(data.authorityName);
      }
      if (data.licenceName && data.licenceName[0]) {
        data.licenceName = data.licenceName[0];
      } else if (data.licenceUrlSlug) {
        data.licenceName = data.licenceUrlSlug;
      }
      return data;
    }
  });
  
  _.extend(Entity.prototype, AuthorityHelpersMixin);
  
  return Entity;
});
