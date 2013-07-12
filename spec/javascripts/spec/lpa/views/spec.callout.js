define([
  'lpa/views/timeseries-graph/callout',
  'extensions/models/model'
], function (Callout, Model) {
  describe('LPA Timeseries Graph Callout', function () {
    it('displays series title, count and percentage', function () {
      var callout = new Callout({
        collection: {
          on: jasmine.createSpy()
        },
        getHeader: jasmine.createSpy().andReturn('test header'),
        graph: {
          valueAttr: 'testattr'
        }
      });

      var el = $('<div>');
      var group = new Model({
        title: 'test title'
      });
      var model = new Model({
        testattr: 123,
        fraction: 0.12
      });
      callout.renderContent(el, group, 0, model, 0);

      expect(el.html()).toEqual('<h3>test header</h3><dl><dt>test title</dt><dd>123 (12%)</dd></dl>');
    });
  });
});
