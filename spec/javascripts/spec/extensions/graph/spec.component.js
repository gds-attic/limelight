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
    
    describe("render", function () {
      var componentWrapper, wrapper, view
      beforeEach(function() {
        componentWrapper = {
          classed: jasmine.createSpy()
        };
        wrapper = {
          append: jasmine.createSpy().andReturn(componentWrapper)
        };
        view = new Component({
          wrapper: wrapper
        });
      });
      
      it("creates a group element for the component", function () {
        view.render();
        expect(wrapper.append).toHaveBeenCalledWith('g');
        expect(view.componentWrapper).toBe(componentWrapper);
        expect(componentWrapper.classed).not.toHaveBeenCalled();
      });
      
      it("creates a group element for the component with a class", function () {
        view.classed = 'foo';
        view.render();
        expect(wrapper.append).toHaveBeenCalledWith('g');
        expect(view.componentWrapper).toBe(componentWrapper);
        expect(componentWrapper.classed).toHaveBeenCalledWith('foo', true);
      });
    });
    
  });
});
