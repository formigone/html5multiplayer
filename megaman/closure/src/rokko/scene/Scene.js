goog.provide('rokko.scene');

goog.require('rokko.graphics.Renderer');

/**
 *
 * @param {Object=} options
 * @constructor
 */
rokko.Scene = function (options) {
    this.props = options.props || {};

    this.onLoad = goog.nullFunction;
    this.onUnload = goog.nullFunction;
    this.onUpdate = goog.nullFunction;
    this.onRender = goog.nullFunction;

    ['onLoad', 'onUnload', 'onUpdate', 'onRender'].forEach(function(method){
        if (options[method] instanceof Function){
            this[method] = options[method];
        }
    }.bind(this));
};

rokko.Scene.prototype.load = function(){
    this.onLoad();
};

rokko.Scene.prototype.unload = function(){
    this.onUnload();
};

/**
 *
 * @param {number} dt
 * @param {number} frames
 */
rokko.Scene.prototype.update = function(dt, frames){
    this.onUpdate(dt, frames);
};

/**
 *
 * @param {rokko.graphics.Renderer} renderer
 * @param {number} frames
 */
rokko.Scene.prototype.render = function(renderer, frames){
    this.onRender(renderer, frames);
};
