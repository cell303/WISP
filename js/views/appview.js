(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'views/iconview', 'views/settingsview', 'views/passwordsview', 'text!templates/app.html', 'libs/jquery.mobile-1.0.1.min'], function($, _, Backbone, IconView, SettingsView, PasswordsView, appTemplate) {
    var AppView;
    AppView = (function(_super) {

      __extends(AppView, _super);

      function AppView() {
        this.onKeydown = __bind(this.onKeydown, this);
        this.onClick = __bind(this.onClick, this);
        this.render = __bind(this.render, this);
        this.events = __bind(this.events, this);
        AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.template = _.template(appTemplate);

      AppView.prototype.initialize = function() {
        this.settings = this.model.get('settings');
        this.passwords = this.model.get('strong');
        return this.render();
      };

      AppView.prototype.events = function() {
        return {
          'click .icon': this.onClick,
          'keydown .weak': this.onKeydown
        };
      };

      AppView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON())).trigger('create');
        this.iconView = new IconView({
          el: this.$('.icon'),
          model: this.model
        });
        this.settingsView = new SettingsView({
          el: this.$('.app-settings'),
          model: this.settings
        });
        this.passwordViews = new PasswordsView({
          el: this.$('.app-passwords'),
          model: this.passwords
        });
        this.$weak = this.$('.weak');
        return this.focusInput();
      };

      AppView.prototype.onClick = function() {
        this.$weak.blur();
        if (this.model.get('status') === 'unlocked') this.$weak.val('').focus();
        return this.model.set({
          'weak': this.$weak.val()
        });
      };

      AppView.prototype.onKeydown = function(e) {
        if (e.which === 13) {
          this.$weak.blur();
          return this.model.set({
            'weak': this.$weak.val()
          });
        }
      };

      AppView.prototype.focusInput = function() {
        var _this = this;
        return setTimeout(function() {
          return _this.$weak.focus();
        }, 1);
      };

      return AppView;

    })(Backbone.View);
    return AppView;
  });

}).call(this);
