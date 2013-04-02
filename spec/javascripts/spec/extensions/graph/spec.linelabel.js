define([
  'extensions/graph/linelabel',
  'extensions/collection'
],
function (LineLabel, Collection) {

  describe("setLabelPositions", function() {
    var el, wrapper, lineLabel;
    beforeEach(function() {
      var collection = new Collection([
        {
          id: 'a',
          values: new Collection([
            { _count: 1 },
            { _count: 4 },
            { _count: 7 }
          ])
        },
        {
          id: 'b',
          values: new Collection([
            { _count: 2 },
            { _count: 5 },
            { _count: 8 }
          ])
        }
      ]);
      
      var yScale = jasmine.createSpy();
      yScale.plan = function (val) {
        return val * val;
      };
      lineLabel = new LineLabel({
        scales: {
          y: yScale
        },
        collection: collection,
        offset: 100,
        linePaddingInner: 20,
        linePaddingOuter: 30
      });
      
      el = $('<div></div>').appendTo($('body'));
      wrapper = lineLabel.d3.select(el[0]).append('svg').append('g');
      wrapper.selectAll('g').data(collection.models)
        .enter().append('g');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("positions labels vertically so they do not collide", function() {
      wrapper.selectAll('g').each(function (metaModel) {
        spyOn(this, "getBBox").andReturn({
          height: 20
        });
      });
      spyOn(lineLabel, "calcPositions").andReturn([
        { min: 20 },
        { min: 30 }
      ]);
      lineLabel.setLabelPositions(wrapper.selectAll('g'));
      expect(lineLabel.calcPositions).toHaveBeenCalled();
      var startPositions = lineLabel.calcPositions.argsForCall[0][0];
      expect(lineLabel.scales.y).toHaveBeenCalledWith(7);
      expect(startPositions[0]).toEqual({
        ideal: 49, // yScale was applied to last element in line 'a'
        size: 20,
        id: 'a'
      });
      expect(lineLabel.scales.y).toHaveBeenCalledWith(8);
      expect(startPositions[1]).toEqual({
        ideal: 64, // yScale was applied to last element in line 'b'
        size: 20,
        id: 'b'
      });
      
      expect(wrapper.select('g:nth-child(1)').attr('transform')).toEqual('translate(0, 20)');
      expect(wrapper.select('g:nth-child(2)').attr('transform')).toEqual('translate(0, 30)');
    });
  });
  
  describe("updateLines", function() {
    var el, wrapper, lineLabel;
    beforeEach(function() {
      lineLabel = new LineLabel();
      lineLabel.offset = 100;
      lineLabel.linePaddingInner = 20;
      lineLabel.linePaddingOuter = 30;
      
      el = $('<div></div>').appendTo($('body'));
      wrapper = lineLabel.d3.select(el[0]).append('svg').append('g');
      var metaCollection = new Collection([
        { y: 30, yLabel: 40 },
        { y: 80, yLabel: 80 }
      ]);
      wrapper.selectAll('line').data(metaCollection.models)
        .enter().append('line');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("updates lines to connect last items with labels", function() {
      lineLabel.updateLines(wrapper);
      var line1 = wrapper.select('line:nth-child(1)');
      var line2 = wrapper.select('line:nth-child(2)');
      expect(parseFloat(line1.attr('x1'))).toEqual(-80);
      expect(parseFloat(line1.attr('x2'))).toEqual(-30);
      expect(parseFloat(line1.attr('y1'))).toEqual(-10);
      expect(parseFloat(line1.attr('y2'))).toEqual(0);
      expect(parseFloat(line2.attr('x1'))).toEqual(-80);
      expect(parseFloat(line2.attr('x2'))).toEqual(-30);
      expect(parseFloat(line2.attr('y1'))).toEqual(0);
      expect(parseFloat(line2.attr('y2'))).toEqual(0);
    });
    
    it("displays straight lines with 'crisp' option", function() {
      lineLabel.updateLines(wrapper);
      var line1 = wrapper.select('line:nth-child(1)');
      var line2 = wrapper.select('line:nth-child(2)');
      expect(line1.attr('class')).toBeFalsy();
      expect(line2.attr('class')).toEqual('crisp');
    });
  });
  
  describe("truncateWithEllipsis", function() {
    
    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');
      wrapper.append('text')
        .text('XXX XXXXXX')
        .attr('style', 'font: Arial; font-size:100px');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("does not truncate text elements when they fit", function() {
      LineLabel.prototype.truncateWithEllipsis(wrapper, 1000);
      expect(wrapper.select('text').text()).toEqual('XXX XXXXXX');
    });
    
    it("truncates text elements that don't fit with a default symbol", function() {
      LineLabel.prototype.truncateWithEllipsis(wrapper, 500);
      expect(wrapper.select('text').text()).toEqual('XXX XX…');
    });
    
    it("does not leave trailing spaces", function() {
      LineLabel.prototype.truncateWithEllipsis(wrapper, 390);
      expect(wrapper.select('text').text()).toEqual('XXX…');
    });
    
    it("truncates text elements that don't fit with a custom symbol", function() {
      LineLabel.prototype.truncateWithEllipsis(wrapper, 460, '*');
      expect(wrapper.select('text').text()).toEqual('XXX XX*');
    });
    
  });
  
  describe("calcPositions", function() {
    
    var line;
    beforeEach(function() {
      line = new LineLabel();
    });
    
    it("places non-adjacent items at their ideal positions when possible", function() {
      var initial = [
        { ideal:  0, size: 10 },
        { ideal: 40, size: 20 },
        { ideal: 80, size: 20 }
      ];
      var result = line.calcPositions(initial);
      expect(result[0].min).toEqual(0);
      expect(result[1].min).toEqual(40);
      expect(result[2].min).toEqual(80);
    });
    
    it("places adjacent items at their ideal positions when possible", function() {
      var initial = [
        { ideal:  0, size: 10 },
        { ideal: 10, size: 20 },
        { ideal: 30, size: 20 }
      ];
      var result = line.calcPositions(initial);
      expect(result[0].min).toEqual(0);
      expect(result[1].min).toEqual(10);
      expect(result[2].min).toEqual(30);
    });
    
    it("places items as close to their ideal positions as possible", function() {
      var initial = [
        { ideal:  5, size: 10 },
        { ideal: 10, size: 20 },
        { ideal: 25, size: 20 }
      ];
      var result = line.calcPositions(initial);
      expect(Math.round(result[0].min)).toEqual(0);
      expect(Math.round(result[1].min)).toEqual(10);
      expect(Math.round(result[2].min)).toEqual(30);
    });
    
    it("places multiple clusters of items as close to their ideal positions as possible", function() {
      var initial = [
        { ideal:  4, size: 10 },
        { ideal: 10, size: 20 },
        { ideal: 30, size: 20 },
        { ideal: 40, size: 20 }
      ];
      var result = line.calcPositions(initial);
      expect(Math.round(result[0].min)).toEqual(-2);
      expect(Math.round(result[1].min)).toEqual(8);
      expect(Math.round(result[2].min)).toEqual(28);
      expect(Math.round(result[3].min)).toEqual(48);
    });
    
    it("keeps items within minimum bounds", function() {
      var initial = [
        { ideal:  5, size: 10 },
        { ideal: 10, size: 20 },
        { ideal: 25, size: 20 }
      ];
      var bounds = { min: 5, max: 100 };
      var result = line.calcPositions(initial, bounds);
      expect(Math.round(result[0].min)).toEqual(5);
      expect(Math.round(result[1].min)).toEqual(15);
      expect(Math.round(result[2].min)).toEqual(35);
    });
    
    it("keeps items within minimum bounds", function() {
      var initial = [
        { ideal:  5, size: 10 },
        { ideal: 10, size: 20 },
        { ideal: 25, size: 20 }
      ];
      var bounds = { min: -100, max: 40 };
      var result = line.calcPositions(initial, bounds);
      expect(Math.round(result[0].min)).toEqual(-10);
      expect(Math.round(result[1].min)).toEqual(0);
      expect(Math.round(result[2].min)).toEqual(20);
    });
  });
  
});
