# @fileOverview Implements the IconView.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
  'jquery'
  'underscore'
  'backbone'
  'text!templates/password.html'
  'order!libs/jquery.selecttext'
], ($, _, Backbone, passwordTemplate) ->

  # The visual appearance of a PasswordCollection.
  class PasswordsView extends Backbone.View

    # The pre-compiled underscore template for a single password.
    template: _.template(passwordTemplate)

    # The passwords should be re-rendered when the collection resets.
    initialize: ->
      @model.bind('reset', @render)
      @render()

    events: =>
      'click .strong': @selectPassword

    # Renders the password template once for every password in the collection
    # and appends them to two different sections in the app.
    # If there are no passwords in the collection placeholders are inserted.
    render: =>
      @$('.less').empty()
	  #@$('.more .ui-collapsible-content').empty()
      
      for i in [0..7]

        el = @$('.less')

        password = @model.at(i)
        if password?
          el.append($(@template(password.toJSON()))
            .removeClass('strong-placeholder'))

        else
          nr = _.escape(i+1)
          el.append($(@template(id: i, password:"Password Nr. #{nr}"))
            .addClass('strong-placeholder'))

    # Tries to select and copy the clicked password into the users clipboard.
    selectPassword: (event) =>
      try
        if $(event.target).hasClass('password')
          $(event.target).selectText()
        else
          $(event.target).find('.password').selectText()
        document.execCommand('Copy')
      catch exception

  return PasswordsView
)
