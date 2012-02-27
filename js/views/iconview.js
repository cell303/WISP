(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'text!templates/icon.html'], function($, _, Backbone, iconTemplate) {
    var IconView;
    IconView = (function(_super) {

      __extends(IconView, _super);

      function IconView() {
        this.render = __bind(this.render, this);
        IconView.__super__.constructor.apply(this, arguments);
      }

      IconView.prototype.template = _.template(iconTemplate);

      IconView.prototype.initialize = function() {
        this.model.bind('change:status', this.render);
        return this.render();
      };

      IconView.prototype.render = function() {
        var status;
        this.$el.html(this.template(this.model.toJSON()));
        status = this.model.get('status');
        switch (status) {
          case 'locked':
            return this.$el.removeClass('icon-loading icon-unlocked').addClass('pointer icon-locked').children().hide();
          case 'unlocked':
            return this.$el.removeClass('icon-loading icon-locked').addClass('pointer icon-unlocked').children().hide();
          case 'loading':
            return this.$el.removeClass('pointer icon-locked icon-unlocked').addClass('icon-loading').find('.loading').show();
        }
      };

      return IconView;

    })(Backbone.View);
    return IconView;
  });

}).call(this);
