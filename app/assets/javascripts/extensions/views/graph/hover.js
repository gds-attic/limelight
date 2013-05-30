define([
  'extensions/views/graph/component',
  'modernizr'
],
function (Component, Modernizr) {
  
  /**
   * Graph component that intercepts and normalises user interaction events
   */
  var Hover = Component.extend({
    
    modernizr: Modernizr,
    
    events: function () {
      if (this.modernizr.touch) {
        
        _.bindAll(this, 'onTouchStartBody');
        $('body').on('touchstart', this.onTouchStartBody);
        
        return {
          'touchstart .hover': 'onTouchStart'
        }
      } else {
        return {
          'mousemove .hover': 'onMouseMove'
        }
      }
    },
    
    dispose: function () {
      if (this.modernizr.touch) {
        $('body').off('touchstart', this.onTouchStartBody);
      }
      Component.prototype.dispose.apply(this, arguments);
    },
    
    render: function () {
      if (!this.hoverEl) {
        this.hoverEl = $('<div></div>').addClass('hover').appendTo(this.$el);
      }
    },
    
    onMouseMove: function (e) {
      var scaleFactor = this.graph.scaleFactor();
      
      var offset = this.$el.offset();
      var scaleFactor = this.graph.scaleFactor();
      var x = (e.pageX - offset.left) / scaleFactor - this.margin.left;
      var y = (e.pageY - offset.top) / scaleFactor - this.margin.top;
      
      if (!this.bodyListener) {
        this.bodyListener = true;
        var that = this;
        $('body').one('mousemove', function () {
          that.bodyListener = false;
          that.collection.selectItem(null, null);
        });
      }
      
      this.selectPoint(x, y);
      return false;
    },
    
    onTouchStartBody: function (e) {
      if (this.ignoreNextBodyTouchStartEvent) {
        this.ignoreNextBodyTouchStartEvent = false;
      } else {
        this.collection.selectItem(null, null);
      }
    },
    
    onTouchStart: function (e) {
      var touch = e.originalEvent.touches[0];
      var offset = this.$el.offset();
      var scaleFactor = this.graph.scaleFactor();
      var x = (touch.pageX - offset.left) / scaleFactor - this.margin.left;
      var y = (touch.pageY - offset.top) / scaleFactor - this.margin.top;
      
      this.ignoreNextBodyTouchStartEvent = true;
      this.selectPoint(x, y, {
        toggle: true
      });
    },
    
    /**
     * Triggers a graph 'hover' event for a specific coordinate.
     */
    selectPoint: function (x, y, options) {
      var slice = this.getSlice(x, y);
      this.graph.trigger('hover', _.extend({
        x: x,
        y: y,
        slice: slice
      }, options));
    },
    
    /**
     * Finds 'slice' of the graph for a specific coordinate.
     * The graph area is divided in 9 slices counted in reading direction:
     * 0-2: top; 3-5: middle; 6-8: bottom.
     * 0,3,6: left; 1,4,7: centre; 2,5,8: right.
     * The main graph area therefore is slice 4.
     */
    getSlice: function (x, y) {
      return (y >= this.graph.innerHeight ? 6 : y < 0 ? 0 : 3) + 
             (x >= this.graph.innerWidth ? 2 : x < 0 ? 0 : 1);
    }
    
  });

  return Hover;
});
