define([
  'extensions/view',
  'd3'
],
function (View, d3) {
  
  var Graph = View.extend({
    
    d3: d3,
    
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    
    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      
      var collection = this.collection = options.collection;
      collection.on('reset add remove', this.render, this);
      
      this.el = options.el;
      
      this.prepareGraphArea();
      
      this.scales = {};
      
      // initialize graph components
      var defaultComponentOptions = this.getDefaultComponentOptions();
      _.each(this.components, function (component) {
        component.instance = new component.view(_.extend(
          {}, defaultComponentOptions, component.options
        ));
      }, this);
    },
    
    /**
     * Defines default options that get passed to all graph components.
     * This object will be extended with component-specific options.
     * @returns {Object} Default options that get passed to components
     */
    getDefaultComponentOptions: function () {
      return {
        collection: this.collection,
        el: this.el,
        svg: this.svg,
        wrapper: this.wrapper,
        margin: this.margin,
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        width: this.width,
        height: this.height,
        scales: this.scales
      }
    },
    
    /**
     * Creates SVG element and group element inset by defined margin.
     */
    prepareGraphArea: function () {
      this.innerWidth = this.width - this.margin.left - this.margin.right;
      this.innerHeight = this.height - this.margin.top - this.margin.bottom;
      
      var svg = this.svg = this.d3.select(this.el[0]).append('svg');
      
      // configure SVG for automatic resize
      svg.attr({
        width: '100%',
        height: '100%',
        viewBox: '0 0 ' + this.width + ' ' + this.height,
        style: 'max-width:' + this.width + 'px; max-height:' + this.height + 'px'
      });

      this.wrapper = svg.append('g')
        .classed('wrapper', true)
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top +')');
    },
    
    /**
     * Calculates current scales, then renders components in defined order.
     */
    render: function () {
      View.prototype.render.apply(this, arguments);
      
      this.scales.x = this.calcXScale();
      this.scales.y = this.calcYScale();
      
      _.each(this.components, function (component) {
        component.instance.render();
      }, this);
    }
  });

  return Graph;
});