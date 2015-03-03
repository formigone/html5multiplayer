var Renderer = function(width, height, element) {
    this.canvas = element || document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
};

Renderer.prototype.bindTo = function(container) {
    container.appendChild(this.canvas);
};

module.exports = Renderer;
