define([
  'extensions/views/view',
  'd3loader!'
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
      
      this.prepareGraphArea();
      
      this.scales = {};
      var componentInstances = this.componentInstances = [];
      
      // initialize graph components
      var defaultComponentOptions = this.getDefaultComponentOptions();
      _.each(this.prop('components'), function (definition) {
        var options = _.extend({}, defaultComponentOptions, definition.options);
        componentInstances.push(new definition.view(options));
      }, this);
    },
    
    /**
     * Defines default options that get passed to all graph components.
     * This object will be extended with component-specific options.
     * @returns {Object} Default options that get passed to components
     */
    getDefaultComponentOptions: function () {
      return {
        graph: this,
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
        style: 'max-width:' + this.width + 'px; max-height:' + this.height + 'px; display:block;'
      });
      
      // ensure that size is calculated correctly in all browsers
      this.adjustSize();
      $(window).on('resize', _.bind(this.adjustSize, this));
      
      this.wrapper = svg.append('g')
        .classed('wrapper', true)
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top +')');
    },
    
    /**
     * Resizes SVG element to parent container width, taking aspect ratio into
     * account. This works around bugs in some Webkit builds and IE10.
     */
    adjustSize: function () {
      var aspectRatio = this.width / this.height;
      var svg = $(this.svg.node());
      svg.height(this.el.width() / aspectRatio);
    },
    
    /**
     * Calculates current factor between size in displayed pixels and logical
     * size.
     */
    scaleFactor: function () {
      return this.$el.width() / this.width;
    },
    
    // Not implemented; override in configuration or subclass
    calcXScale: function () {
      throw('No x scale defined.');
    },
    
    // Not implemented; override in configuration or subclass
    calcYScale: function () {
      throw('No y scale defined.');
    },
    
    getConfigName: function () {
      return null;
    },
    
    /**
     * Calculates current scales, then renders components in defined order.
     */
    render: function () {
      View.prototype.render.apply(this, arguments);
      
      this.scales.x = this.calcXScale();
      this.scales.y = this.calcYScale();
      
      var configName = this.getConfigName();
      
      _.each(this.componentInstances, function (component) {
        if (configName) {
          component.applyConfig(configName);
        }
        component.render();
      }, this);
    }
  });

  return Graph;
});
