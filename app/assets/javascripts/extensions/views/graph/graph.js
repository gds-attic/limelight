define([
  'extensions/views/view',
  'd3loader!'
],
function (View, d3) {
  
  var Graph = View.extend({
    
    d3: d3,
    
    valueAttr: '_count',
    
    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      
      var collection = this.collection = options.collection;
      collection.on('reset add remove', this.render, this);
      
      this.prepareGraphArea();
      
      this.scales = {};
      this.margin = {};

      // initialize graph components
      var componentInstances = this.componentInstances = [];
      var defaultComponentOptions = this.getDefaultComponentOptions();
      _.each(this.prop('components'), function (definition) {
        var options = _.extend({}, defaultComponentOptions, definition.options);
        componentInstances.push(new definition.view(options));
      }, this);

      $(window).on('resize', _.bind(this.render, this));
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
        scales: this.scales
      }
    },
    
    prepareGraphArea: function () {
      this.innerEl = $('<div class="inner"></div>');
      this.innerEl.appendTo(this.$el);
      
      var svg = this.svg = this.d3.select(this.$el[0]).append('svg');
      
      this.wrapper = svg.append('g')
        .classed('wrapper', true);
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

    pxToValue: function (cssVal) {
      if (!_.isString(cssVal)) {
        return null;
      }
      var matches = cssVal.match(/([0-9\.]+)px/);
      return matches ? parseFloat(matches[1]) : null;
    },

    resize: function () {
      var width = this.width = this.$el.width();

      // when both max-width and max-height are defined, scale graph according
      // to this aspect ratio. A defined min-height still takes precedence
      // over aspect ratio scaling.
      var maxWidth = this.pxToValue(this.$el.css('max-width'));
      var maxHeight = this.pxToValue(this.$el.css('max-height'));
      var minHeight = this.pxToValue(this.$el.css('min-height'));
      var height;
      if (maxWidth != null && maxHeight != null) {
        var aspectRatio = maxWidth / maxHeight;
        height = width / aspectRatio;
        if (minHeight != null) {
          height = Math.max(height, minHeight);
        }
      } else {
        height = this.$el.height();
      }
      this.height = height;

      // configure SVG for automatic resize
      this.svg.attr({
        width: '100%',
        height: '100%',
        viewBox: '0 0 ' + width + ' ' + height,
        style: 'max-width:' + width + 'px; max-height:' + height + 'px; display:block;'
      });
      $(this.svg.node()).height(height);

      var innerEl = this.innerEl;
      this.margin.top = innerEl.position().top;
      this.margin.left = innerEl.position().left;

      this.innerWidth = innerEl.outerWidth();
      this.innerHeight = innerEl.outerHeight();

      this.margin.bottom = height - this.margin.top - this.innerHeight;
      this.margin.right = width - this.margin.left - this.innerWidth;

      this.wrapper.attr('transform', [
        'translate(',
        this.margin.left,
        ', ',
        this.margin.top,
        ')'
      ].join(''));
    },
    
    /**
     * Calculates current scales, then renders components in defined order.
     */
    render: function () {
      View.prototype.render.apply(this, arguments);

      // hide callout during resize if present.
      // works around bug in Webkit / iOS that incorrectly calculates height
      // of inner element.
      var callout = this.$el.find('.callout');
      var calloutHidden = callout.hasClass('performance-hidden');
      callout.addClass('performance-hidden');

      this.resize();

      if (!calloutHidden) {
        callout.removeClass('performance-hidden');
      }

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
