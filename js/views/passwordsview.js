(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'text!templates/password.html', 'order!libs/jquery.selecttext'], function($, _, Backbone, passwordTemplate) {
    var PasswordsView;
    PasswordsView = (function(_super) {

      __extends(PasswordsView, _super);

      function PasswordsView() {
        this.selectPassword = __bind(this.selectPassword, this);
        this.render = __bind(this.render, this);
        this.events = __bind(this.events, this);
        PasswordsView.__super__.constructor.apply(this, arguments);
      }

      PasswordsView.prototype.template = _.template(passwordTemplate);

      PasswordsView.prototype.initialize = function() {
        this.model.bind('reset', this.render);
        return this.render();
      };

      PasswordsView.prototype.events = function() {
        return {
          'click .strong': this.selectPassword
        };
      };

      PasswordsView.prototype.render = function() {
        var el, i, nr, password, _results;
        this.$('.less').empty();
        this.$('.more .ui-collapsible-content').empty();
        _results = [];
        for (i = 0; i <= 7; i++) {
          if (i < 2) {
            el = this.$('.less');
          } else {
            el = this.$('.more .ui-collapsible-content');
          }
          password = this.model.at(i);
          if (password != null) {
            _results.push(el.append($(this.template(password.toJSON())).removeClass('strong-placeholder')));
          } else {
            nr = _.escape(i + 1);
            _results.push(el.append($(this.template({
              id: i,
              password: "Password Nr. " + nr
            })).addClass('strong-placeholder')));
          }
        }
        return _results;
      };

      PasswordsView.prototype.selectPassword = function(event) {
        try {
          $(event.target).selectText();
          return document.execCommand('Copy');
        } catch (exception) {

        }
      };

      return PasswordsView;

    })(Backbone.View);
    return PasswordsView;
  });

}).call(this);
