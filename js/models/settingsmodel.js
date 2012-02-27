(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'libs/backbone.localstorage'], function(_, Backbone, Store) {
    var SettingsModel;
    SettingsModel = (function(_super) {

      __extends(SettingsModel, _super);

      function SettingsModel() {
        this.sync = __bind(this.sync, this);
        this.save = __bind(this.save, this);
        SettingsModel.__super__.constructor.apply(this, arguments);
      }

      SettingsModel.prototype.defaults = {
        store: false,
        length: 21,
        chars: {
          lowercase: true,
          uppercase: true,
          numeric: true,
          special: false
        }
      };

      SettingsModel.prototype.initialize = function() {
        return this.fetch();
      };

      SettingsModel.prototype.save = function(attributes, options) {
        this.set(attributes, options);
        if (this.get('store') === true) {
          SettingsModel.__super__.save.call(this, attributes, options);
        } else {
          localStorage.clear();
        }
        return this;
      };

      SettingsModel.prototype.id = 'settings';

      SettingsModel.prototype.localStorage = new Store('wisp');

      SettingsModel.prototype.sync = function(method, model, options) {
        var resp, store;
        store = this.localStorage;
        switch (method) {
          case 'create':
            resp = store.create(model);
            break;
          case 'read':
            resp = model.id != null ? store.find(model) : store.findAll();
            break;
          case 'update':
            resp = store.update(model);
            break;
          case 'delete':
            resp = store.destroy(model);
        }
        if (resp) return options.success(resp);
      };

      SettingsModel.prototype.validate = function(attrs) {
        var _ref;
        if ((_ref = attrs.length) !== 7 && _ref !== 14 && _ref !== 21 && _ref !== 42) {
          return "Invalid length";
        }
      };

      return SettingsModel;

    })(Backbone.Model);
    return SettingsModel;
  });

}).call(this);
