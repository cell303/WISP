(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'text!templates/settings.html', 'libs/jquery.mobile-1.0.1.min'], function($, _, Backbone, settingsTemplate) {
    var SettingsView;
    SettingsView = (function(_super) {

      __extends(SettingsView, _super);

      function SettingsView() {
        this.getLength = __bind(this.getLength, this);
        this.getChars = __bind(this.getChars, this);
        this.charsChanged = __bind(this.charsChanged, this);
        this.lengthChanged = __bind(this.lengthChanged, this);
        this.events = __bind(this.events, this);
        SettingsView.__super__.constructor.apply(this, arguments);
      }

      SettingsView.prototype.template = _.template(settingsTemplate);

      SettingsView.prototype.initialize = function() {
        return this.render();
      };

      SettingsView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON())).trigger('create');
        return this.$("input[type='checkbox'], input[type='radio']").checkboxradio();
      };

      SettingsView.prototype.events = function() {
        return {
          'change .length': this.lengthChanged,
          'change .chars': this.charsChanged
        };
      };

      SettingsView.prototype.lengthChanged = function() {
        return this.model.save({
          'length': this.getLength()
        });
      };

      SettingsView.prototype.charsChanged = function() {
        return this.model.save({
          'chars': this.getChars()
        });
      };

      SettingsView.prototype.getChars = function() {
        var chars;
        chars = {
          'lowercase': this.$('.chars-0').is(':checked'),
          'uppercase': this.$('.chars-1').is(':checked'),
          'numeric': this.$('.chars-2').is(':checked'),
          'special': this.$('.chars-3').is(':checked')
        };
        return chars;
      };

      SettingsView.prototype.getLength = function() {
        return parseInt(this.$('.length:checked').val());
      };

      return SettingsView;

    })(Backbone.View);
    return SettingsView;
  });

}).call(this);
