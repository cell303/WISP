# @fileOverview Implements the SettignsModel.
# @author <a href="https://www.twitter.com/cell303">@cell303</a>
# @version 1

define([
  'underscore'
  'backbone'
  'libs/backbone.localstorage'
], (_, Backbone, Store) ->
  
  # This class capsules the settings and saves them 
  # to the localStorage if desired.
  class SettingsModel extends Backbone.Model

    # The default settings
    defaults:
      store: false
      length: 21
      chars:
        lowercase: true
        uppercase: true
        numeric: true
        special: false

    # Gets the settings from the localStorage if available.
    initialize: ->
      @fetch()

    # Used to change the settings of the app.
    # If store is set on model, it will save the settings to the 
    # localStorage. Otherwise the localStorage is cleared.
    # @param {Object} attributes A hash of the settings to change, as with set.
    # @param {Object=} options Options as with `save` or `set`.
    # @returns {SettingsModel} Must return itself to be a valid Backbone.Model.
    # @override
    save: (attributes, options) =>
      @set(attributes, options)

      if @get('store') is true
        super(attributes, options)
      else
        localStorage.clear()

      return this

    # This id is required to save/fetch the settings from the localStorage.
    id: 'settings'

    # The link to the localStorage
    localStorage: new Store('wisp')

    # Backbone will call this function when accessing the localStorage.
    # @param {string} method The CRUD method.
    # @param {Backbone.Model} model The model to be saved. Always this model.
    # @param {Object=} options Additional jquery ajax request options
    sync: (method, model, options) =>
      store = @localStorage
      
      switch (method)
        when 'create'
          resp = store.create(model)
        when 'read'
          resp = if model.id? then store.find(model) else store.findAll()
        when 'update'
          resp = store.update(model)
        when 'delete'
          resp = store.destroy(model)
      
      if (resp)
        options.success(resp)

    # Checks the attributes for correct password length
    # @param {Object} attrs The to-be-changed attributes of the model.
    # @returns {string=} Only if the attributes are not valid. Backbone 
    # knows what to do. 
    validate: (attrs) ->
      unless attrs.length in [7, 14, 21, 42]
        return "Invalid length"

  return SettingsModel
)

