define(function () {
  
  var config = {
    paths: {
      lodash: 'vendor/lodash',
      backbone: 'vendor/backbone',
      css: 'vendor/require-css',
      modernizr: 'vendor/modernizr',
      moment: 'vendor/moment',
      tpl: 'vendor/tpl'
    },
    
    shim: {
      backbone: {
        deps: ['lodash', 'jquery'],
        exports: 'Backbone'
      },
      modernizr: {
        exports: 'Modernizr'
      },
      moment: {
        exports: 'Moment'
      }
    }
  };
  
  if (typeof window === 'object') {
    // additional setup for client
    config.paths.jquery = 'vendor/jquery';
    config.paths.jqueryxdr = 'vendor/jquery.xdr';
    config.paths.jquerymousewheel = 'vendor/jquery.mousewheel';
    config.paths.d3 = 'vendor/d3.v3';
    config.shim.backbone.deps.concat(['jqueryxdr', 'jquerymousewheel']);
    config.shim.jqueryxdr = {
      deps: ['jquery'],
      exports: '$'
    };
    config.shim.d3 = {
      exports: 'd3'
    };
  }
  
  return config;
});
