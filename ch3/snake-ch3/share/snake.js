var keys = require('./keyboard.js');

var Snake = function (x, y, color_hex, width, height) {
    this.color = color_hex;
    this.head = {x: x, y: y};
    this.pieces = [this.head];
    this.width = width || 16;
    this.height = height || 16;
    this.readyToGrow = false;
    this.input = {};
};

Snake.prototype.setKey = function (key) {
    this.input[keys.UP] = false;
    this.input[keys.DOWN] = false;
    this.input[keys.LEFT] = false;
    this.input[keys.RIGHT] = false;
    this.input[key] = true;
};

Snake.prototype.update = function (delta) {
    if (this.readyToGrow) {
        this.pieces.push({x: 0, y: 0});
        this.readyToGrow = false;
    }

    for (var len = this.pieces.length, i = len - 1; i > 0; i--) {
        this.pieces[i].x = this.pieces[i - 1].x;
        this.pieces[i].y = this.pieces[i - 1].y;
    }

    if (this.input[keys.LEFT]) {
        this.head.x += -1;
    } else if (this.input[keys.RIGHT]) {
        this.head.x += 1;
    } else if (this.input[keys.UP]) {
        this.head.y += -1;
    } else if (this.input[keys.DOWN]) {
        this.head.y += 1;
    }
};

Snake.prototype.grow = function() {
    this.readyToGrow = true;
};

module.exports = Snake;
