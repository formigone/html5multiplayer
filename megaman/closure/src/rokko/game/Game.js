goog.provide('rokko.game');

goog.require('rokko.graphics.Renderer');
goog.require('rokko.scene.SceneManager');

/**
 *
 * @param {rokko.graphics.Renderer} renderer
 * @param {rokko.scene.SceneManager} sceneManager
 * @param {Object=} config
 * @constructor
 */
rokko.Game = function (renderer, sceneManager, config) {
    config = config || {};

    this.fps = config.fps || 60;
    this.freq = 1000 / this.fps;
    this.lastTime = 0;
    this.delta = 0;
    this.frames = 0;
    this.rafId = 0;

    this.renderer = renderer;
    this.sceneManager = sceneManager;
    this.activeScene = sceneManager.activeScene;
};

rokko.Game.prototype.run = function(){
    if (this.rafId <= 0) {
        this.activeScene.load();
        this.rafId = window.requestAnimationFrame(this.loop.bind(this));
    }
};

rokko.Game.prototype.activateScene = function(){
    this.pause();
    this.activeScene = this.sceneManager.getActiveScene();
    this.run();
};

rokko.Game.prototype.pause = function(){
    window.cancelAnimationFrame(this.rafId);
    this.rafId = 0;
};

rokko.Game.prototype.loop = function(now){
    this.rafId = window.requestAnimationFrame(this.loop.bind(this));

    this.delta = now - this.lastTime;
    this.activeScene.update(this.delta);
    this.activeScene.render(this.renderer, this.frames);

    this.frames += 1;
    this.lastTime = now;
};
