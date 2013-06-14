define([
  'extensions/views/view'
],
function (View) {
  var HeadlineView = View.extend({
    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('reset', this.render, this);
    },
    
    render: function () {
      var c = this.collection;
      var getMonth = function (index) {
        return c.collectionInstances[index].query.get('start_at').format('MMMM');
      };
      this.$el.html([
        'Percentages of unique visitors at common stages ',
        'of licensing submissions in ',
        '<span class="group0">',
        getMonth(0),
        '</span>',
        ' compared with ',
        '<span class="group1">',
        getMonth(1),
        '</span>'
      ].join(''));
    }
  });
  
  return HeadlineView;
});
