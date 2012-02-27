# @fileOverview The visuals appearance of the app.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
	'jquery'
	'underscore'
	'backbone'
	'views/iconview'
	'views/settingsview'
	'views/passwordsview'
	'text!templates/app.html'
	'libs/jquery.mobile-1.0.1.min'
], ($, _, Backbone, IconView, SettingsView, PasswordsView, appTemplate) ->

	# The primary class to render the app.
	# Creates and contains other view objects.
	class AppView extends Backbone.View

		# The pre-compiled underscore template.
		template: _.template(appTemplate)

		# Cache the settingsModel and the passwordCollection form the model.
		initialize: ->
			@settings = @model.get('settings')
			@passwords = @model.get('strong')
			@render()

		# A request to the server can be initialized by a click on the icon 
		# or when pressing enter.
		events: =>
			'click .icon': @onClick
			'keydown .weak': @onKeydown

		# Renders the app.
		# Creates view objects and assigns the appropriate models/collections to them as well as
		# the rendered DOM elements so they can be rendered as well. 
		render: =>
			@$el.html(@template(@model.toJSON())).trigger('create')

			@iconView = new IconView(
				el: @$('.icon')
				model: @model
			)

			@settingsView = new SettingsView(
				el: @$('.app-settings')
				model: @settings
			)

			@passwordViews = new PasswordsView(
				el: @$('.app-passwords')
				model: @passwords
			)

			@$weak = @$('.weak')
			@focusInput()

		# The action when clicking the icon is determined by the status of the app.
		# If there are currently passwords displayed (unlocked) the app should be reset,
		# and the focus is set on the input again.
		onClick: =>
			@$weak.blur()

			if @model.get('status') is 'unlocked'
				@$weak.val('').focus()

			@model.set('weak': @$weak.val())

		# When enter is pressed the weak password should be updated on the server regardless of the
		# current status of the app. This is a more intuitive behaviour.
		onKeydown: (e) =>
			if e.which is 13
				@$weak.blur()
				@model.set('weak': @$weak.val())

		# HACK: Sets the focus on the weak password input field.
		# There seems to be no other way with jquery mobile.
		focusInput: ->
			setTimeout( =>
				@$weak.focus()
			, 1)

	return AppView
)
