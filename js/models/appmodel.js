(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'collections/passwordcollection', 'models/settingsmodel'], function(_, Backbone, PasswordCollection, SettingsModel) {
    var AppModel;
    AppModel = (function(_super) {

      __extends(AppModel, _super);

      function AppModel() {
        this.lock = __bind(this.lock, this);
        this.whisper = __bind(this.whisper, this);
        this.onChange = __bind(this.onChange, this);
        AppModel.__super__.constructor.apply(this, arguments);
      }

      AppModel.prototype.defaults = {
        weak: '',
        strong: new PasswordCollection(),
        settings: new SettingsModel(),
        status: 'locked'
      };

      AppModel.prototype.initialize = function() {
        this.bind('change:weak', this.onChange);
        this.settings = this.get('settings');
        this.settings.bind('change:chars', this.onChange);
        this.settings.bind('change:length', this.onChange);
        return this.passwords = this.get('strong');
      };

      AppModel.prototype.onChange = function() {
        if (this.get('weak') === '') {
          return this.lock();
        } else {
          return this.whisper();
        }
      };

      AppModel.prototype.whisper = function() {
        var data,
          _this = this;
        data = 'data=' + JSON.stringify({
          weak: this.get('weak'),
          chars: this.settings.get('chars'),
          length: this.settings.get('length')
        });
        this.set({
          'status': 'loading'
        });
        return this.passwords.fetch({
          data: data,
          success: function() {
            return _this.set({
              'status': 'unlocked'
            });
          },
          error: function() {
            return _this.set({
              'status': 'locked'
            });
          }
        });
      };

      AppModel.prototype.lock = function() {
        this.passwords.reset();
        return this.set({
          'status': 'locked'
        });
      };

      return AppModel;

    })(Backbone.Model);
    return AppModel;
  });

}).call(this);
