define([
  'extensions/collections/collection'
],
function (Collection) {
  
  /**
   * Combines data from multiple Backdrop queries
   */
  var MultiCollection = Collection.extend({
    
    /**
     * Defines the constituent collection classes.
     * Override in subclass or options
     */
    collections: [],
    
    initialize: function (models, options) {
      if (options && options.collections) {
        this.collections = options.collections;
      }
      this.collectionInstances = _.map(this.collections, function (classRef) {
        return new classRef(models, options);
      });
    },
    
    /**
     * Called when all collections are ready. Override this to calculate
     * the actual data from the constituent collections.
     */
    parse: function (options) {
      throw("No parser defined for MultiCollection");
    },
    
    /**
     * Fetches data for all constituent collections. Parses data when all
     * requests have returned successfully. Fails if any of the requests fail.
     */
    fetch: function (options) {
      options = options || {};
      
      var openRequests = numRequests = this.collectionInstances.length;
      var successfulRequests = 0;
      var that = this;
      
      var onResponse = function () {
        if (--openRequests > 0) {
          // wait for other requests to return
          return;
        }
        
        if (successfulRequests == numRequests) {
          // all constituent collections returned successfully
          that.reset.call(that, that.parse.call(that, options), { parse: true });
        }
      };
      var onSuccess = function () {
        successfulRequests++;
        onResponse();
      };
      
      _.each(this.collectionInstances, function (collection) {
        
        collection.on('error', function () {
          // escalate error status
          if (options.error) {
            options.error.apply(collection, arguments)
          }
          var args = ['error'].concat(Array.prototype.slice.call(arguments));
          this.trigger.apply(this, args);
        }, this),
        collection.fetch({
          success: onSuccess,
          error: onResponse
        });
      }, this);
    }
    
  });
  
  return MultiCollection;
});
