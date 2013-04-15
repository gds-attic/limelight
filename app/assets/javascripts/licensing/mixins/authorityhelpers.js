define(function() {

  var AuthorityHelpersMixin = {
    
    getAuthorityShortName: function (fullName) {
      if (!fullName || !fullName.length) {
        return fullName;
      }
      var expression = /(^((London |Royal )?Borough (Council )?of |City (and County )?of (?!London))|( City| County|( County| Metropolitan)? Borough|( City( and| Metropolitan))? District)? Council$)/g;
      return fullName.replace(expression, '');
    },
    
    getAuthoritySortName: function (fullName) {
      if (!fullName || !fullName.length) {
        return fullName;
      }
      var expression = /(^((London |Royal )?Borough (Council )?of |City (and County )?of (?!London)))/g;
      return fullName.replace(expression, '');
    }
  };

  return AuthorityHelpersMixin;
});