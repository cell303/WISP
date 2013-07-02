# @fileOverview Kick-off script file for WISP.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

require.config(
  paths:
    jquery: 'vendor/jquery-1.7.1.min'
    jquerymobile: 'vendor/jquery.mobile-1.1.0-rc.2.min'
    underscore: 'vendor/underscore-min'
    backbone: 'vendor/backbone-min'
    order: 'vendor/order'
    text: 'vendor/text'
)

require [
  'jquery'
  'jquerymobile'
  'models/appmodel'
  'views/appview'
], ($, $m, AppModel, AppView) ->
  
  appModel = new AppModel()

  $('.ui-page').live 'pageinit', (event, ui) ->
    appView = new AppView(el: $(event.target).find('.app'), model: appModel)

    # HACK: Sets store to true on the settings model, to indicate that the
    # user allows data to be stored in the localStorage.
    # Since there are no models for pages I put this here.
    $settings = $('#enable-settings')
    if $settings.length
      settingsModel = appModel.get('settings')
      $settings.attr('checked': settingsModel.get('store'))
        .checkboxradio('refresh')

      $settings.bind 'change', ->
        store = $settings.is(':checked')
        settingsModel.save('store': store)
