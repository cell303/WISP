# @fileOverview Implements the SettingsView.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
  'jquery'
  'underscore'
  'backbone'
  'text!templates/settings.html'
], ($, _, Backbone, settingsTemplate) ->

  # Handles the appearance and the events of the app settings badge.
  # Reads the selected settings on the view when they change and passes them 
  # to the model.
  # Not to be confused with the settings page which is rendered server-side.
  class SettingsView extends Backbone.View

    # The pre-compiled underscore template for the settings.
    template: _.template(settingsTemplate)

    # Renders the settings badge upon initialization.
    initialize: ->
      @render()

    # Triggers a create event to tell jquery mobile to style the inputs.
    # `checkboxradio` tells jquery mobile to initialize them.
    render: ->
      @$el.html(@template(@model.toJSON()))

      length = @model.get('length')
      switch length
        when 7 then @$('.length-0').attr('checked', true)
        when 14 then @$('.length-1').attr('checked', true)
        when 21 then @$('.length-2').attr('checked', true)
        when 42 then @$('.length-3').attr('checked', true)

      chars = @model.get('chars')
      if chars.lowercase then @$('.chars-0').attr('checked', true)
      if chars.uppercase then @$('.chars-1').attr('checked', true)
      if chars.numeric then @$('.chars-2').attr('checked', true)
      if chars.special then @$('.chars-3').attr('checked', true)

      @$el.trigger("create")

    # Tells the view which data to set on the model when the user has changed 
    # a settings.
    events: =>
      'change .length': @lengthChanged
      'change .chars': @charsChanged

    # Sets the new length on the model
    lengthChanged: =>
      @model.save('length': @getLength())

    # Sets the new chars on the model
    charsChanged: =>
      @model.save('chars': @getChars())

    # Get the chars configuration from the form.
    # @returns {Object} A hash representing the selected charset for the 
    #   password. 
    # @nosideeffects
    getChars: =>
      chars =
        'lowercase': @$('.chars-0').is(':checked')
        'uppercase': @$('.chars-1').is(':checked')
        'numeric':@$('.chars-2').is(':checked')
        'special':@$('.chars-3').is(':checked')

      return chars

    # Get the length configuration from the form.
    # @returns {number} The selected length for the password. 
    #   Is in [7, 14, 21, 42].
    # @nosideeffects
    getLength: =>
      return parseInt(@$('.length:checked').val())
  
  return SettingsView
)
