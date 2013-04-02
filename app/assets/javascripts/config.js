// Set the require.js configuration for your application.
require.config({

  deps: [
    'bootstrap'
  ],

  baseUrl: (window.$ && $('#wrapper').data('base-url')) || '/limelight',

  paths: {
    jquery: 'vendor/jquery',
    jqueryxdr: 'vendor/jquery.xdr',
    jquerymousewheel: 'vendor/jquery.mousewheel',
    jquerymockjax: 'helpers/jquery.mockjax',
    lodash: 'vendor/lodash',
    backbone: 'vendor/backbone',
    css: 'vendor/require-css',
    modernizr: 'vendor/modernizr',
    moment: 'vendor/moment',
    tpl: 'vendor/tpl',
    d3: 'vendor/d3.v3'
  },

  shim: {
    backbone: {
      deps: ['lodash', 'jquery', 'jqueryxdr', 'jquerymousewheel'],
      exports: 'Backbone'
    },

    modernizr: {
      exports: 'Modernizr'
    },

    moment: {
      exports: 'Moment'
    },
    
    jqueryxdr: {
      deps: ['jquery']
    },

    jquerymousewheel: {
      deps: ['jquery']
    },

    jquerymockjax: {
      deps: ['jquery']
    },

    d3: {
      exports: 'd3'
    }
  }

});
