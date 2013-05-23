$(document).ready(function () {

  var baseUrl, d3Url, requireConfig;

  baseUrl = $('#wrapper').data('base-url') || '/limelight';
  d3Url = $('#wrapper').data('d3-url') || 'vendor/d3.v3';

  requireConfig = {
    baseUrl: baseUrl,

    deps: ($('#wrapper').data('additional-dependencies') || "").split(','),

    paths: {
      jquery: 'jqueryloader',
      jqueryxdr: 'vendor/jquery.xdr',
      jquerymousewheel: 'vendor/jquery.mousewheel',
      lodash: 'vendor/lodash',
      backbone: 'vendor/backbone',
      css: 'vendor/require-css',
      modernizr: 'vendor/modernizr',
      moment: 'vendor/moment',
      tpl: 'vendor/tpl',
      d3: d3Url
    },

    shim: {
      backbone: {
        deps: ['lodash', 'jqueryxdr', 'jquerymousewheel'],
        exports: 'Backbone'
      },
      modernizr: {
        exports: 'Modernizr'
      },
      moment: {
        exports: 'Moment'
      },
      d3: {
        exports: 'd3'
      }
    }
  };

  require.config(requireConfig);

  require(['bootstrap']);
});
