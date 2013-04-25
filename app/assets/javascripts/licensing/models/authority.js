define([
  'require',
  'extensions/models/model',
  '../mixins/authorityhelpers'
],
function (require, Model, AuthorityHelpersMixin) {
  var Authority = Model.extend({
    
    parse: function (data) {
      
      data.slug = data.authorityUrlSlug;
      
      if (data.authorityName && data.authorityName[0]) {
        data.name = data.authorityName[0];
      } else {
        data.name = data.slug;
      }
      
      data.sortName = this.getAuthoritySortName(data.name);
      data.url = '/performance/licensing/authorities/' + data.slug;
      
      return data;
    }
  });
  
  _.extend(Authority.prototype, AuthorityHelpersMixin);
  
  return Authority;
});
