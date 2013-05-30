define([
  'extensions/views/graph/graph',
  'extensions/collections/collection',
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
    
    describe("prepareGraphArea", function() {
      
      var graph, el;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        
        var TestGraph = Graph.extend();
        graph = new TestGraph({
          el: el,
          collection: new Collection()
        });
      });
      
      afterEach(function() {
        el.remove();
      });

      it("creates element to measure size of inner graph area", function () {
        expect(graph.el.find('.inner').length).toEqual(1);
      });

      it("creates empty SVG element", function () {
        var svg = graph.el.find('svg');
        expect(svg.length).toEqual(1);
      });
      
      it("creates wrapper element", function() {
        var wrapper = graph.el.find('svg g.wrapper');
        expect(wrapper.length).toEqual(1);
      });
    });

    describe("pxToValue", function () {
      var pxToValue = Graph.prototype.pxToValue;

      it("extracts number from valid CSS px values", function () {
        expect(pxToValue('1px')).toEqual(1);
        expect(pxToValue('1.0px')).toEqual(1);
        expect(pxToValue('0.5px')).toEqual(0.5);
        expect(pxToValue('100px')).toEqual(100);
      });

      it("returns null when it is not a valid CSS px value", function () {
        expect(pxToValue(100)).toEqual(null);
        expect(pxToValue(1)).toEqual(null);
        expect(pxToValue('1p')).toEqual(null);
        expect(pxToValue(null)).toEqual(null);
        expect(pxToValue(undefined)).toEqual(null);
        expect(pxToValue(true)).toEqual(null);
        expect(pxToValue(false)).toEqual(null);
      });
    });
    
    describe("resize", function () {

      var graph, el, wrapper;
      beforeEach(function() {
        wrapper = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        el = $('<div></div>').appendTo(wrapper);
        graph = new Graph({
          collection: new Collection(),
          el: el
        });
        spyOn(graph, "render");
      });
      
      afterEach(function() {
        wrapper.remove();
      });

      it("re-scales graph according to aspect ratio when both max-width and max-height are defined", function () {
        wrapper.css({
          width: '150px'
        });
        el.css({
          'max-width': '200px',
          'max-height': '100px'
        });

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(75);
      });

      it("re-scales graph according to defined height and available width", function () {
        wrapper.css({
          width: '150px'
        });
        el.css({
          'max-width': '200px',
          'height': '100px'
        });

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(100);
      });

      it("updates SVG element with auto resize options", function() {
        wrapper.css({
          width: '150px'
        });
        el.css({
          'max-width': '200px',
          'max-height': '100px'
        });
        graph.resize();

        var svg = graph.el.find('svg');
        expect(svg.length).toEqual(1);
        expect(svg.attr('width')).toEqual('100%');
        expect(svg.attr('height')).toEqual('100%');
        expect(svg.prop('viewBox').baseVal.x).toEqual(0);
        expect(svg.prop('viewBox').baseVal.y).toEqual(0);
        expect(svg.prop('viewBox').baseVal.width).toEqual(150);
        expect(svg.prop('viewBox').baseVal.height).toEqual(75);
        expect(svg.css('max-width')).toEqual('150px');
        expect(svg.css('max-height')).toEqual('75px');
        expect(svg.css('display')).toEqual('block');
      });
      
      it("calculates inner dimensions and margin", function() {
        wrapper.css({
          width: '150px'
        });
        el.css({
          'position': 'relative',
          'max-width': '200px',
          'max-height': '100px'
        });

        el.find('.inner').css({
          position: 'absolute',
          top: '1px',
          right: '2px',
          bottom: '3px',
          left: '4px'
        });
        graph.resize();

        expect(graph.innerWidth).toEqual(150 - 2 - 4);
        expect(graph.innerHeight).toEqual(75 - 1 - 3);
        expect(graph.margin.top).toEqual(1);
        expect(graph.margin.right).toEqual(2);
        expect(graph.margin.bottom).toEqual(3);
        expect(graph.margin.left).toEqual(4);
      });
      
    });
    
    describe("render", function() {

      var graph;
      beforeEach(function() {
        spyOn(Graph.prototype, 'prepareGraphArea');
        graph = new Graph({
          collection: new Collection()
        });
        spyOn(graph, "resize");
      });

      it("resizes the graph", function () {
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.render();
        expect(graph.resize).toHaveBeenCalled();
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
    
    describe("scaleFactor", function () {
      var el, TestGraph;
      beforeEach(function() {
          el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
          el.css('display', 'block');
          TestGraph = Graph.extend({
            width: 600,
            height: 400
          });
      });
      
      afterEach(function() {
          el.remove();
      });
      
      it("calculates the scale factor when the graph is not resized", function() {
          el.width(600);
          graph = new TestGraph({
            el: el,
            collection: new Collection()
          });
          expect(graph.scaleFactor()).toEqual(1);
      });
      
      it("calculates the scale factor when the graph is resized", function() {
          el.width(300);
          graph = new TestGraph({
            el: el,
            collection: new Collection()
          });
          expect(graph.scaleFactor()).toEqual(0.5);
      });
    });
    
  });
});
