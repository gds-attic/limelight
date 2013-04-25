define([
  'extensions/views/view'
],
function (View) {
  var Filter = View.extend({
    
    initialize: function (options) {
      options = options || {};
      View.prototype.initialize.apply(this, arguments);
      this.id = options.id || 'filter';
      this.collection.filtered.on('reset', this.hideShowElements, this);
    },
    
    events: {
      'keydown input': 'onKeyDown',
      'keyup input': 'onKeyUp'
    },
    
    hideShowElements: function () {
      this.collection.each(function (model) {
        model.get('el').addClass('performance-hidden');
      });
      this.collection.filtered.each(function (model) {
        model.get('el').removeClass('performance-hidden');
      });
      
      // hide groups that have no visible children
      this.listEl.find('dd, dt').removeClass('performance-hidden');
      this.listEl.find('dd').each(function (i, dd) {
        var $dd = $(dd);
        if (!$dd.find('li:not(.performance-hidden)').length) {
          // no children visible, hide group too
          $dd.addClass('performance-hidden');
          $dd.prev('dt').addClass('performance-hidden');
        }
      });
      
      if (this.countEl) {
        this.countEl.text(this.collection.filtered.length);
      }
    },
    
    onKeyDown: function (e) {
      if (e.keyCode == this.keys.escape) {
        return false;
      }
    },
    
    onKeyUp: function (e) {
      var term = this.inputEl.val();
      if (e.keyCode == this.keys.escape) {
        if (!term.length) {
          this.inputEl.blur();
          return;
        }
        this.inputEl.val('');
        term = '';
      }
      
      this.collection.applyFilter(term);
    },
    
    render: function () {
      View.prototype.render.apply(this, arguments);
      
      if (this.label) {
        var label = $('<label/>').prop('for', this.id).text(this.label);
        this.$el.append(label);
      }
      
      var input = this.inputEl = $('<input/>').prop('id', this.id);
      if (this.placeholder) {
        input.prop('placeholder', this.placeholder);
      }
      this.$el.append(input);
    }
  });
  
  return Filter;
});
