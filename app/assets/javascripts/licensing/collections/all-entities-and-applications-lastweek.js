define([
  'require',
  'extensions/collections/collection',
  './all-entities',
  './applications-detail-lastweek'
],
function (require, Collection, AllEntities, ApplicationsLastWeek) {
  var AllEntitiesAndApplicationsLastWeek = Collection.extend({
    
    collections: [
      AllEntities,
      ApplicationsLastWeek
    ],
    
    initialize: function (models, options) {
      if (!options || !options.groupBy) {
        throw "groupBy option is mandatory";
      }
      this.groupBy = options.groupBy;
      Collection.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * Augments list of authorities / licences with number of applications
     * last week.
     */
    parse: function () {
      var allEntities = this.collectionInstances[0];
      var applicationsLastWeek = this.collectionInstances[1];
      
      var groupBy = this.groupBy;
      var applicationsBySlug = {};
      applicationsLastWeek.each(function (model) {
        applicationsBySlug[model.get(groupBy)] = model.get('_count');
      }, this);
      
      return allEntities.map(function (model) {
        model.set('_count', applicationsBySlug[model.get('slug')] || 0);
        return model;
      });
    }
  });

  return AllEntitiesAndApplicationsLastWeek;
});
