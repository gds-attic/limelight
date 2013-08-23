define([
  'extensions/views/view'
],
function (View) {
  var Filter = View.extend({
    
    initialize: function (options) {
      options = options || {};
      View.prototype.initialize.apply(this, arguments);
      this.id = options.id || 'filter';
    },
    
    events: {
      'keydown input': 'onKeyDown',
      'keyup input': 'onKeyUp'
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
      
      this.model.set('term', term);
    },
    
    render: function () {
      View.prototype.render.apply(this, arguments);
      
      if (this.label) {
        var label = $('<label/>').prop('for', this.id).html(this.label);
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
