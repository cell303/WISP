(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'models/password'], function($, _, Backbone, Password) {
    var PasswordCollection;
    PasswordCollection = (function(_super) {

      __extends(PasswordCollection, _super);

      function PasswordCollection() {
        PasswordCollection.__super__.constructor.apply(this, arguments);
      }

      PasswordCollection.prototype.model = Password;

      PasswordCollection.prototype.url = 'whisper';

      return PasswordCollection;

    })(Backbone.Collection);
    return PasswordCollection;
  });

}).call(this);
