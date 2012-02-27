# @fileOverview A collection of passwords.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
	'jquery'
	'underscore'
	'backbone'
	'models/password'
], ($, _, Backbone, Password) ->

	# The 8 strong passwords are stored in this collection.
	class PasswordCollection extends Backbone.Collection
        
		# The collection should contain passwords
		model: Password

		# The url used by Backbone to `fetch` the passwords from the server.
		url: 'whisper'

	return PasswordCollection
)
