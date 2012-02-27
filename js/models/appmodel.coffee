# @fileOverview The basic logic of the app.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
	'underscore'
	'backbone'
	'collections/passwordcollection'
	'models/settingsmodel'
], (_, Backbone, PasswordCollection, SettingsModel) ->
	
	#
	class AppModel extends Backbone.Model

		defaults:
			weak: ''
			strong: new PasswordCollection()
			settings: new SettingsModel()
			status: 'locked'

		# Sets the events that can cause the app to request passwords from the sever.
		initialize: ->
			@bind('change:weak', @onChange)

			@settings = @get('settings')
			@settings.bind('change:chars', @onChange)
			@settings.bind('change:length', @onChange)
			
			@passwords = @get('strong')
		
		# Setting an empty string as weak password means that the app should be reset.
		# If a non-empty string is set, a request to the server is sent.
		onChange: =>
			if @get('weak') is ''
				@lock()
			else
				@whisper()

		# Sends a weak password to the server and request the strong passwords.
		# If the weak password is an empty string however, the app gets locked.
		whisper: =>
			data = 'data=' + JSON.stringify(
				weak: @get('weak')
				chars: @settings.get('chars')
				length: @settings.get('length')
			)

			@set('status': 'loading')

			@passwords.fetch(
				data: data
				success: () =>
					@set('status': 'unlocked')
				error: =>
					@set('status': 'locked')
			)

		# Resets the app in the "locked" state by deleting the received passwords.
		lock: =>
			@passwords.reset()
			@set('status': 'locked')
			
	return AppModel
)
