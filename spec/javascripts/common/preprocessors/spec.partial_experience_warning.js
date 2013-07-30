define(['common/preprocessors/partial_experience_warning'],
function (preprocessor) {
  describe("Browser message pre-processor", function () {
    afterEach(function () {
      $('#global-browser-prompt').remove();
      $('html').removeClass('lte-ie8');
    });

    it ("Should update the GOV.UK banner with performance platform content", function () {
      $('html').addClass('lte-ie8');
      $('body').append('<div id="global-browser-prompt"><p>Foo</p></div>');
      preprocessor();
      expect($('#global-browser-prompt').html()).toBe('<p>Your browser is unable to display some of the content on this page.</p><p>Foo</p>');
    });

    it ("Should not update the GOV.UK banner when on newer browsers", function () {
      // default state = not lte-ie8 class on html tag
      $('body').append('<div id="global-browser-prompt"><p>Foo</p></div>');
      preprocessor();
      expect($('#global-browser-prompt').html()).toBe('<p>Foo</p>');
    });
  });
});
