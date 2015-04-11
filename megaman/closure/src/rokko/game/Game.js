goog.provide('rokko.game');

goog.require('rokko.graphics.Renderer');

/**
 *
 * @param {rokko.graphics.Renderer} renderer
 * @param {rokko.Scene} scene
 * @param {Object} config
 * @constructor
 */
rokko.Game = function (renderer, scene, config) {
    config = config || {};

    this.fps = config.fps || 60;
    this.freq = 1000 / this.fps;
    this.lastTime = 0;
    this.delta = 0;
    this.frames = 0;
    this.rafId = 0;

    this.renderer = renderer;
    this.activeScene = scene;
};

rokko.Game.prototype.run = function(){
    if (this.rafId <= 0) {
        this.activeScene.load();
        this.rafId = window.requestAnimationFrame(this.loop.bind(this));
    }
};

rokko.Game.prototype.loop = function(now){
    this.rafId = window.requestAnimationFrame(this.loop.bind(this));

    this.delta = now - this.lastTime;
    this.activeScene.update(this.delta);
    this.activeScene.render(this.renderer, this.frames);

    this.frames += 1;
    this.lastTime = now;
};

/**
 *
 * @param {rokko.Scene} scene
 */
rokko.Game.prototype.setScene = function(scene){
    this.activeScene = scene;
};
