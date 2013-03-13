define([
  'extensions/graph/component',
  'd3'
],
function (Component, d3) {
  describe("Component", function() {
    
    it("keeps a reference to d3 library", function() {
      var view = new Component({
        collection: {
          on: jasmine.createSpy()
        }
      });
      expect(view.d3).toBe(d3);
    });
    
    describe("initialize", function() {
      it("assigns options as object properties", function() {
        var view = new Component({
          testProperty: true
        });
        expect(view.testProperty).toBe(true);
      });
    });
    
  });
});
