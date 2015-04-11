goog.provide('rokko.scene');

goog.require('rokko.graphics.Renderer');

/**
 *
 * @param {Object} callbacks
 * @constructor
 */
rokko.Scene = function (callbacks) {
    this.onLoad = goog.nullFunction;
    this.onUnload = goog.nullFunction;
    this.onUpdate = goog.nullFunction;
    this.onRender = goog.nullFunction;

    ['onLoad', 'onUnload', 'onUpdate', 'onRender'].forEach(function(method){
        if (callbacks[method] instanceof Function){
            this[method] = callbacks[method];
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
 */
rokko.Scene.prototype.update = function(dt){
    this.onUpdate(dt);
};

/**
 *
 * @param {rokko.graphics.Renderer} renderer
 * @param {number} frames
 */
rokko.Scene.prototype.render = function(renderer, frames){
    this.onRender(renderer, frames);
    console.log('here', this.onRender, this);
};
