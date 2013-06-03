define(['modernizr'], function (Modernizr) {
  var applyTouchActions = function () {
    if (applyTouchActions.Modernizr.touch) {
      // module action items touch interaction
      $('ul.module-actions li').on('touchend', function(e) {
        var item = $(this);
        var close = function(e) { item.removeClass('active'); };
        if (item.hasClass('active')) {
          close();
          return false;
        }
        $('ul.module-actions li').removeClass('active');
        item.addClass('active');
        $('body').one('touchend', close);
        return false;
      });
    }
  }

  applyTouchActions.Modernizr = Modernizr;

  return applyTouchActions;
});
