define([
    'extensions/collection'
],
function (Collection) {
    var WeeklyApplications = Collection.extend({
      
        queryUrl: 'licensing',
        
        queryParams: function () {
          return {
            start_at: this.moment().startOf('week').subtract(8, 'weeks'),
            end_at: this.moment().startOf('week'),
            period: 'week'
          }
        },
        
        parse: function (response) {
            return response.data;
        },
        
        /**
         * Keep sorted chronologically
         */
        comparator: function(model) {
          return +model.get('_start_at');
        }
    });
    
    return WeeklyApplications;
});
