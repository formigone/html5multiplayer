var keys = require('./keyboard.js');

var Snake = function (x, y, color_hex, speed_ppf, width, height) {
    this.color = color_hex;
    this.head = {x: x, y: y};
    this.pieces = [this.head];
    this.speed = speed_ppf;
    this.width = width || 16;
    this.height = height || 16;
    this.readyToGrow = false;
    this.input = {};
};

Snake.prototype.setKey = function (key, pressed) {
    this.input[key] = pressed;
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
        this.move(-1, 0);
    } else if (this.input[keys.RIGHT]) {
        this.move(1, 0);
    } else if (this.input[keys.UP]) {
        this.move(0, -1);
    } else if (this.input[keys.DOWN]) {
        this.move(0, 1);
    }
};

Snake.prototype.grow = function() {
    this.readyToGrow = true;
};

Snake.prototype.move = function (x, y) {
    this.head.x += x * this.width * this.speed;
    this.head.y += y * this.height * this.speed;
};

module.exports = Snake;
