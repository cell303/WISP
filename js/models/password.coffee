# @fileOverview Password wrapper class.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone) ->

  # Keeps a single strong password. 
  # Every password is a Backbone model so they can be stored in a Backbone 
  # collection.
  class Password extends Backbone.Model
    defaults:
      password: ''
  
  return Password
)
