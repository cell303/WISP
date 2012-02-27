# @fileOverview Kick-off script file of WISP.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

requirejs.config(
  paths:
    jquery: 'libs/jquery-1.6.4.min'
    underscore: 'libs/underscore-min'
    backbone: 'libs/backbone-min'
    order: 'libs/order'
    text: 'libs/text'
)

require([
  'jquery'
  'underscore'
  'backbone'
  'models/appmodel'
  'views/appview'
  'order!libs/jquery.mobile-1.0.1.min'
], ($, _, Backbone, AppModel, AppView) ->
  
  appModel = new AppModel()

  $('.ui-page').live('pageinit', (event, ui) ->
    appView = new AppView(el: $(event.target).find('.app'), model: appModel)

    # HACK
    $settings = $('#enable-settings')
    if $settings.length
      settingsModel = appModel.get('settings')
      $settings.attr('checked': settingsModel.get('store'))
        .checkboxradio('refresh')
      $settings.bind('change', ->
        store = $settings.is(':checked')
        settingsModel.save('store': store)
      )
  )
)
