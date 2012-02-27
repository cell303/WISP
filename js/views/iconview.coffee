# @fileOverview Implements the IconView.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
  'jquery'
  'underscore'
  'backbone'
  'text!templates/icon.html'
], ($, _, Backbone, iconTemplate) ->

  # The icon represents the status of the app.
  # It changes when the status changes.
  class IconView extends Backbone.View

    # The pre-compiled underscore template.
    template: _.template(iconTemplate)

    # Keep the icon up to date with the status of the app.
    initialize: ->
      @model.bind('change:status', @render)
      @render()

    # Renders the icon and adds classes that change the appearance of the icon.
    # HACK: Probably not the best way to do this...
    render: =>
      @$el.html(@template(@model.toJSON()))

      status = @model.get('status')
      switch status
        when 'locked'
          @$el.removeClass('icon-loading icon-unlocked')
            .addClass('pointer icon-locked')
            .children().hide()

        when 'unlocked'
          @$el.removeClass('icon-loading icon-locked')
            .addClass('pointer icon-unlocked')
            .children().hide()
            
        when 'loading'
          @$el.removeClass('pointer icon-locked icon-unlocked')
            .addClass('icon-loading')
            .find('.loading').show()

  return IconView
)
