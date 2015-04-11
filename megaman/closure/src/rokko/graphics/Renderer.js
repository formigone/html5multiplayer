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


    var scale = {x: 1, y: 1};
    var style = this.canvas.getAttribute('style') || '';
    scale.x = (window.innerWidth) / this.canvas.width;
    scale.y = (window.innerHeight) / this.canvas.height;

    if (scale.x < 1 || scale.y < 1) {
        scale = '1, 1';
    } else if (scale.x < scale.y) {
        scale = scale.x + ', ' + scale.x;
    } else {
        scale = scale.y + ', ' + scale.y;
    }

    this.canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + '); image-rendering: pixelated;');
};

rokko.graphics.Renderer.prototype.bindTo = function(element) {
    element.appendChild(this.canvas);
};
