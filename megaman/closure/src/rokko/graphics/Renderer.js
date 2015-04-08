goog.provide('rokko.graphics.Renderer');

goog.require('goog.dom');

/**
 *
 * @param {number} width
 * @param {number} height
 * @param {Object=} config
 *
 * @constructor
 */
rokko.graphics.Renderer = function(width, height, config) {
    config = config || {};

    this.canvas = goog.dom.createDom('canvas', {width: width, height: height});
    this.ctx = this.canvas.getContext('2d');

    this.ctx.imageSmoothingEnabled = config.smoothing || false;
};

rokko.graphics.Renderer.prototype.bindTo = function(element) {
    element.appendChild(this.canvas);
};
