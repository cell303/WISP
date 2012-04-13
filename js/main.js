(function() {

  require.config({
    paths: {
      jquery: 'libs/jquery-1.7.1.min',
      jquerymobile: 'libs/jquery.mobile-1.1.0-rc.2.min',
      underscore: 'libs/underscore-min',
      backbone: 'libs/backbone-min',
      order: 'libs/order',
      text: 'libs/text'
    }
  });

  require(['jquery', 'jquerymobile', 'models/appmodel', 'views/appview'], function($, $m, AppModel, AppView) {
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
