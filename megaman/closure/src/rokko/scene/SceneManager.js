goog.provide('rokko.scene.SceneManager');

goog.require('rokko.scene');

/**
 *
 * @constructor
 */
rokko.scene.SceneManager = function(){
    /** @type {Object.<string, rokko.Scene>} scenes */
    this.scenes = {};

    /** @type {rokko.Scene} activeScene */
    this.activeScene = rokko.scene.SceneManager.nullScene;
};

rokko.scene.SceneManager.nullScene = new rokko.Scene({
    onLoad: function(){
        throw new Error('nullScene');
    }
});

/**
 *
 * @param {string} name
 * @param {rokko.Scene} scene
 */
rokko.scene.SceneManager.prototype.add = function(name, scene){
    this.scenes[name] = scene;
};

/**
 *
 * @param {string} name
 */
rokko.scene.SceneManager.prototype.setActive = function(name){
    if (this.scenes[name] instanceof rokko.Scene) {
        this.activeScene = this.scenes[name];
    } else {
        this.activeScene = rokko.scene.SceneManager.nullScene;
    }
};


/**
 * Return the active scene. If none is set, and there is at least one scene,
 * set the first scene (based on alphabetical order of the name) and return that.
 */
rokko.scene.SceneManager.prototype.getActiveScene = function(){
    if (this.activeScene === rokko.scene.SceneManager.nullScene) {
        var scenes = Object.keys(this.scenes);
        if (scenes.length > 0) {
            scenes = scenes.sort();
            this.activeScene = this.scenes[scenes.shift()];
        }
    }

    return this.activeScene;
};
