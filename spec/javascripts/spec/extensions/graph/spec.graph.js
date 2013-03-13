define([
  'extensions/graph/graph',
  'extensions/collection',
  'd3'
],
function (Graph, Collection, d3) {
  describe("Graph", function() {
    
    it("keeps a reference to d3 library", function() {
      spyOn(Graph.prototype, "prepareGraphArea");
      var view = new Graph({
        collection: {
          on: jasmine.createSpy()
        }
      });
      expect(view.d3).toBe(d3);
    });
    
    describe("initialize", function() {
      
      var collection, TestGraph, testComponent1, testComponent2;
      beforeEach(function() {
        collection = new Collection();
        testComponent1 = jasmine.createSpy();
        testComponent2 = jasmine.createSpy();
        TestGraph = Graph.extend({
          components: [
            {
              view: testComponent1,
              options: {
                foo: 'bar'
              }
            },
            {
              view: testComponent2,
              options: {
                foo: 'baz',
                a: 'c'
              }
            }
          ],
          getDefaultComponentOptions: function () {
            return {
              a: 'b'
            }
          }
        });
        spyOn(TestGraph.prototype, "render");
        spyOn(TestGraph.prototype, "prepareGraphArea");
      });
      
      it("re-renders when collection resets", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('reset');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("re-renders when item is added to collection", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('add');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("re-renders when items is removed from collection", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('remove');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("prepare graph area", function() {
        var graph = new TestGraph({
          collection: collection
        });
        expect(graph.prepareGraphArea).toHaveBeenCalled();
      });
      
      it("initialises components", function() {
        var graph = new TestGraph({
          collection: collection
        });
        expect(testComponent1).toHaveBeenCalledWith({
          a: 'b',    // default option
          foo: 'bar' // component option
        });
        expect(testComponent2).toHaveBeenCalledWith({
          a: 'c',    // overridden default option
          foo: 'baz' // component option
        });
        expect(graph.componentInstances[0] instanceof testComponent1).toBe(true);
        expect(graph.componentInstances[1] instanceof testComponent2).toBe(true);
      });
    });
    
  });
  
  describe("prepareGraphArea", function() {
    
    var graph, el;
    beforeEach(function() {
      el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
      
      var TestGraph = Graph.extend({
        width: 555,
        height: 444,
        margin: {
          top: 11,
          bottom: 22,
          left: 33,
          right: 44
        }
      });
      graph = new TestGraph({
        el: el,
        collection: new Collection()
      });
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("creates SVG element with auto resize options", function() {
      var svg = graph.el.find('svg');
      expect(svg.length).toEqual(1);
      expect(svg.attr('width')).toEqual('100%');
      expect(svg.attr('height')).toEqual('100%');
      expect(svg.prop('viewBox').baseVal.x).toEqual(0);
      expect(svg.prop('viewBox').baseVal.y).toEqual(0);
      expect(svg.prop('viewBox').baseVal.width).toEqual(555);
      expect(svg.prop('viewBox').baseVal.height).toEqual(444);
      expect(svg.css('max-width')).toEqual('555px');
      expect(svg.css('max-height')).toEqual('444px');
    });
    
    it("calculates inner width and inner height", function() {
      expect(graph.innerWidth).toEqual(555 - 33 - 44);
      expect(graph.innerHeight).toEqual(444 - 11 - 22);
    });
    
    it("creates wrapper element", function() {
      var wrapper = graph.el.find('svg g.wrapper');
      expect(wrapper.length).toEqual(1);
      expect(wrapper.attr('transform')).toEqual('translate(33, 11)');
    });
  });
  
  describe("render", function() {

    var graph;
    beforeEach(function() {
      spyOn(Graph.prototype, 'prepareGraphArea');
      graph = new Graph({
        collection: new Collection()
      });
    });
    
    it("requires an x scale implementation", function() {
      graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
      expect(function () {
        graph.render();
      }).toThrow();
    });
    
    it("requires a y scale implementation", function() {
      graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
      expect(function () {
        graph.render();
      }).toThrow();
    });
    
    it("calculates x scale", function() {
      graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
      graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
      graph.render();
      expect(graph.scales.x).toEqual('test x scale');
    });
    
    it("calculates y scale", function() {
      graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
      graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
      graph.render();
      expect(graph.scales.y).toEqual('test y scale');
    });
    
    it("renders component instances", function() {
      graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
      graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
      var component1 = {
        render: jasmine.createSpy()
      };
      var component2 = {
        render: jasmine.createSpy()
      };
      graph.componentInstances = [component1, component2];
      graph.render();
      expect(component1.render).toHaveBeenCalled();
      expect(component2.render).toHaveBeenCalled();
    });
  });
  
});
