define([
  'require',
  './collection',
  'extensions/models/group'
],
function (require, Collection, Group) {
  /**
   * Helper class. Graphs expect a collection of `Group` models, each of which
   * containing a data series. This collection combines one or more single
   * data series into a Graph-compatible collection of collections.
   */
  var GraphCollection = Collection.extend({
    model: Group,
    
    initialize: function () {
      Collection.prototype.initialize.apply(this, arguments);
      
      this.on('reset', function () {
        this.each(function (group, groupIndex) {
          group.get('values').on('change:selected', function (model, index) {
            this.onGroupChangeSelected(group, groupIndex, model, index);
          }, this);
        }, this);
      }, this);
    },
    
    parse: function () {
      return _.map(this.collectionInstances, function (collection) {
        return {
          id: collection.id,
          title: collection.title,
          values: collection.models
        };
      });
    },
    
    selectItem: function (selectGroupIndex, selectIndex) {
      if (_.isUndefined(selectIndex)) {
        selectIndex = null;
      }
      
      this.each(function (group, groupIndex) {
        var values = group.get('values');
        if (groupIndex === selectGroupIndex) {
          values.selectItem(selectIndex, { silent: true });
        } else {
          values.selectItem(null, { silent: true });
        }
      }, this);
      
      var selectGroup = this.at(selectGroupIndex) || null;
      var selectModel = null;
      if (selectGroup && selectIndex != null) {
        selectModel = selectGroup.get('values').at(selectIndex);
      }
      
      Collection.prototype.selectItem.call(this, selectGroupIndex, { silent: true });
      
      this.trigger('change:selected', selectGroup, selectGroupIndex, selectModel, selectIndex);
    },

    getCurrentSelection: function () {
      var res = {
        selectedGroupIndex: this.selectedIndex,
        selectedGroup: this.selectedItem,
        selectedModelIndex: null,
        selectedModel: null
      };

      if (this.selectedItem) {
        var groupValues = this.selectedItem.get('values');
        if (groupValues.selectedItem) {
          _.extend(res, {
            selectedModelIndex: groupValues.selectedIndex,
            selectedModel: groupValues.selectedItem
          });
        }
      }

      return res;
    },
    
    onGroupChangeSelected: function (group, groupIndex, model, index) {
      if (index === null) {
        group = null;
        groupIndex = null;
      }
      this.trigger('change:selected', group, groupIndex, model, index)
    }
  });
  
  return GraphCollection;
});


