define([
  'extensions/module-actions'
  ],
function (applyModuleActions) {
  describe('Module Actions', function() {

    describe('touch behaviour', function() {

      var originalModernizr = window.Modernizr;

      beforeEach(function() {
        window.Modernizr = {
          touch: true
        };
        $('body').append($('<ul id="module1" class="module-actions">').append('<li></li>'));
      });

      afterEach(function() {
        window.Modernizr = originalModernizr;
        $('ul.module-actions').remove();
      });

      it('should show a callout on touch', function() {
        applyModuleActions();
        var li = $('ul.module-actions li');
        expect(li).not.toHaveClass('active');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
      });

      it('should toggle the callout on repeated touches', function() {
        applyModuleActions();
        var li = $('ul.module-actions li');
        expect(li).not.toHaveClass('active');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
        li.trigger('touchend');
        expect(li).not.toHaveClass('active');
      });

      it("should close the callout when the user touches somewhere else on the page", function () {
        applyModuleActions();
        var li = $('ul.module-actions li');
        li.trigger('touchend');
        expect(li).toHaveClass('active');
        $('body').trigger('touchend');
        expect(li).not.toHaveClass('active');
      });

      it("should close other open callouts on touch", function () {
        $('body').append($('<ul id="module2" class="module-actions">').append('<li></li>'));
        applyModuleActions();

        $('#module1 li').trigger('touchend');
        expect($('#module1 li')).toHaveClass('active');
        expect($('#module2 li')).not.toHaveClass('active');

        $('#module2 li').trigger('touchend');
        expect($('#module1 li')).not.toHaveClass('active');
        expect($('#module2 li')).toHaveClass('active');
      });
    });

    describe("non-touch behaviour", function () {
      var originalModernizr = window.Modernizr;

      beforeEach(function() {
        window.Modernizr = {
          touch: false
        };
        $('body').append($('<ul class="module-actions">').append('<li></li>'));
      });

      afterEach(function() {
        window.Modernizr = originalModernizr;
        $('ul.module-actions').remove();
      });

      it("should not react to touches", function () {
        applyModuleActions();
        var li = $('ul.module-actions li');
        li.trigger('touchend');
        expect(li).not.toHaveClass('active');
      });
    });
  });
});
