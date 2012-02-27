(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Password;
    Password = (function(_super) {

      __extends(Password, _super);

      function Password() {
        Password.__super__.constructor.apply(this, arguments);
      }

      Password.prototype.defaults = {
        password: ''
      };

      return Password;

    })(Backbone.Model);
    return Password;
  });

}).call(this);
