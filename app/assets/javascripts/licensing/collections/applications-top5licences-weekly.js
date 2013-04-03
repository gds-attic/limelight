define([
  'require',
  './applications-total-weekly',
  'extensions/group'
],
function (require, Applications, Group) {
  /**
   * Retrieves data for a specific licence, grouped by authority,
   * for the "top 5" authorities
   */
  var LicenceApplications = Applications.extend({
    
    queryParams: function () {
      return _.extend(Applications.prototype.queryParams.call(this, arguments), {
        group_by: 'licenceUrlSlug',
        limit: 5,
        sort_by: '_count:descending',
        collect: ['authorityName', 'licenceName']
      });
    },
    
    queryId: 'applications-top5licences-weekly',
    
    comparator: function (a, b) {
      // sort by last value
      var aVal = a.get('values').last().get('_count');
      var bVal = b.get('values').last().get('_count');
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    },
    
    parse: function (response) {
      var data = [];
      
      _.each(response.data, function (group) {
        var attributes = {
          id: group.licenceUrlSlug,
          values: group.values
        };
        if (group.licenceName) {
          attributes.title = group.licenceName[0];
        } else {
          attributes.title = group.licenceUrlSlug;
        }
        if (group.authorityName) {
          attributes.subTitle = group.authorityName[0];
        }
        data.push(attributes);
      });

      return data;
    }
  });

  return LicenceApplications;
});
