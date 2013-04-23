define([
  'extensions/mixins/safesync',
  'backbone'
],
function (SafeSync, Backbone) {
  describe("SafeSync", function() {
    describe("sync", function () {
      it("escapes HTML characters in received response", function () {
        $.mockjax({
          url: '//testurl',
          contentType: 'application/json',
          responseText: '{"someProperty": "<b>html content</b>"}'
        });

        var response = null;

        runs(function() {
          SafeSync.sync('get', new Backbone.Model(), {
            url: '//testurl',
            success: function(resp) { response = resp; }
          })
        });

        waitsFor(function() {
          return response !== null;
        }, "the collection should fetch the mocked response", 2000);

        runs(function() {
          expect(response.someProperty).toBe("&lt;b&gt;html content&lt;/b&gt;")
        });
      });
    });
  });
});
