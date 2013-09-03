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

    at: function (groupIndex, index) {
      if (index != null) {
        return this.at(groupIndex).get('values').at(index);
      } else {
        return Collection.prototype.at.call(this, groupIndex);
      }
    },

    groupSum: function (attr, index) {
      return this.at(index).get('values').reduce(function (memo, model) {
        var value = model.get(attr) || 0;
        return memo + value;
      }, 0);
    },

    itemSum: function (attr, index) {
      return this.reduce(function (memo, group) {
        var value = group.get('values').at(index).get(attr) || 0;
        return memo + value;
      }, 0);
    },
    
    sum: function (attr, groupIndex, index) {
      if (groupIndex != null && index != null) {
        return this.at(groupIndex, index).get(attr) || 0;
      } else if (groupIndex != null) {
        return this.groupSum(attr, groupIndex);
      } else if (index != null) {
        return this.itemSum(attr, index);
      } else {
        return this.reduce(function (memo, group, groupIndex) {
          return memo + this.groupSum(attr, groupIndex);
        }, 0, this);
      }
    },

    fraction: function (attr, groupIndex, index) {
      if (groupIndex != null && index != null) {
        var itemSum = this.sum(attr, null, index);
        var value = this.at(groupIndex, index).get(attr) || 0;
        return value / itemSum;
      } else if (groupIndex != null) {
        return this.sum(attr, groupIndex) / this.sum(attr);
      } else if (index != null) {
        return this.sum(attr, null, index) / this.sum(attr);
      } else {
        return 1;
      }
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


