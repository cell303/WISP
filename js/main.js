(function() {

  requirejs.config({
    paths: {
      jquery: 'libs/jquery-1.6.4.min',
      underscore: 'libs/underscore-min',
      backbone: 'libs/backbone-min',
      order: 'libs/order',
      text: 'libs/text'
    }
  });

  require(['jquery', 'underscore', 'backbone', 'models/appmodel', 'views/appview', 'order!libs/jquery.mobile-1.0.1.min'], function($, _, Backbone, AppModel, AppView) {
    var appModel;
    appModel = new AppModel();
    return $('.ui-page').live('pageinit', function(event, ui) {
      var $settings, appView, settingsModel;
      appView = new AppView({
        el: $(event.target).find('.app'),
        model: appModel
      });
      $settings = $('#enable-settings');
      if ($settings.length) {
        settingsModel = appModel.get('settings');
        $settings.attr({
          'checked': settingsModel.get('store')
        }).checkboxradio('refresh');
        return $settings.bind('change', function() {
          var store;
          store = $settings.is(':checked');
          return settingsModel.save({
            'store': store
          });
        });
      }
    });
  });

}).call(this);
