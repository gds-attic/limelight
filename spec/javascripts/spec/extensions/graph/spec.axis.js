define([
  'extensions/views/graph/axis'
],
function (Axis) {
  
  describe("render", function() {
    
    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Axis.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("requires a scale", function() {
      expect(function () {
        var view = new Axis({
          wrapper: wrapper
        });
        view.render()
      }).toThrow();
    });
    
    it("renders a d3 axis component", function() {
      
      var view = new Axis({
        wrapper: wrapper,
        classed: 'testclass',
        getScale: function () {
          return view.d3.scale.linear()
        }
      });
      spyOn(view.d3.svg, "axis").andCallThrough();
      
      view.render()
      
      expect(wrapper.selectAll('.tick')[0].length).toEqual(11);
    });
    
  });
  
  describe("getTransform", function() {
    
    var view;
    beforeEach(function() {
      view = new Axis({
        innerWidth: 555,
        innerHeight: 444
      });
    });
    
    it("calculates default translation for position left", function() {
      view.position = 'left';
      expect(view.getTransform()).toEqual('translate(0,0)');
    });
    
    it("calculates default translation for position right", function() {
      view.position = 'right';
      expect(view.getTransform()).toEqual('translate(555,0)');
    });
    
    it("calculates default translation for position top", function() {
      view.position = 'top';
      expect(view.getTransform()).toEqual('translate(0,0)');
    });
    
    it("calculates default translation for position bottom", function() {
      view.position = 'bottom';
      expect(view.getTransform()).toEqual('translate(0,444)');
    });
    
    it("calculates custom translation for position left", function() {
      view.position = 'left';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,8)');
    });
    
    it("calculates custom translation for position right", function() {
      view.position = 'right';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(562,8)');
    });
    
    it("calculates custom translation for position top", function() {
      view.position = 'top';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,8)');
    });
    
    it("calculates custom translation for position bottom", function() {
      view.position = 'bottom';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,452)');
    });
    
  });
  
});
