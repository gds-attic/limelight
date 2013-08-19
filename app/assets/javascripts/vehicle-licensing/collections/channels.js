define([
  'require',
  './services'
],
function (require, Services) {
  var Channels = Services.extend({

    apiName: 'channels',

    baseSeriesList: [
      { id: 'successful_agent', title: 'Agent' },
      { id: 'successful_ivr', title: 'IVR' },
      { id: 'successful_web', title: 'Web' }
    ]
  });

  return Channels;
});
