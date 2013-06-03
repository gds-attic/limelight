define([
  'licensing/controllers/preprocessors/module_touch_actions'
  ],
function (applyModuleTouchActions) {
  describe('Module touch actions', function() {

    describe('touch behaviour', function() {

      var originalModernizr = applyModuleTouchActions.Modernizr;

      beforeEach(function() {
        applyModuleTouchActions.Modernizr = {
          touch: true
        };
        $('body').append($('<ul id="module1" class="module-actions">').append('<li></li>'));
      });

      afterEach(function() {
        applyModuleTouchActions.Modernizr = originalModernizr;
        $('ul.module-actions').remove();
      });

      it('should show a callout on touch', function() {
        applyModuleTouchActions();
        var li = $('ul.module-actions li');
        expect(li).not.toHaveClass('active');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
      });

      it('should toggle the callout on repeated touches', function() {
        applyModuleTouchActions();
        var li = $('ul.module-actions li');
        expect(li).not.toHaveClass('active');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
        li.trigger('touchend');
        expect(li).not.toHaveClass('active');
      });

      it("should close the callout when the user touches somewhere else on the page", function () {
        applyModuleTouchActions();
        var li = $('ul.module-actions li');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
        $('body').trigger('touchend');
        expect(li).not.toHaveClass('active');
      });

      it("should close other open callouts on touch", function () {
        $('body').append($('<ul id="module2" class="module-actions">').append('<li></li>'));
        applyModuleTouchActions();

        $('#module1 li').trigger('touchend');
        expect($('#module1 li')).toHaveClass('active');
        expect($('#module2 li')).not.toHaveClass('active');

        $('#module2 li').trigger('touchend');
        expect($('#module1 li')).not.toHaveClass('active');
        expect($('#module2 li')).toHaveClass('active');
      });
    });

    describe("non-touch behaviour", function () {
      var originalModernizr = applyModuleTouchActions.Modernizr;

      beforeEach(function() {
        applyModuleTouchActions.Modernizr = {
          touch: false
        };
        $('body').append($('<ul class="module-actions">').append('<li></li>'));
      });

      afterEach(function() {
        applyModuleTouchActions.Modernizr = originalModernizr;
        $('ul.module-actions').remove();
      });

      it("should not react to touches", function () {
        applyModuleTouchActions();
        var li = $('ul.module-actions li');
        li.trigger('touchend');
        expect(li).not.toHaveClass('active');
      });
    });
  });
});
