var keys = require('./keyboard.js');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Snake = function (id, x, y, color_hex, width, height, interpMaxFrames) {
    this.id = id;
    this.color = color_hex;
    this.head = {x: x, y: y};
    this.pieces = [this.head];
    this.width = width || 16;
    this.height = height || 16;
    this.interpMaxFrames = interpMaxFrames || 3;
    this.readyToGrow = false;
    this.input = {};
    this.inSync = true;
};

Snake.events = {
    POWER_UP: 'Snake:powerup',
    COLLISION: 'Snake:collision'
};

util.inherits(Snake, EventEmitter);

Snake.prototype.setKey = function (key) {
    this.input[keys.UP] = false;
    this.input[keys.DOWN] = false;
    this.input[keys.LEFT] = false;
    this.input[keys.RIGHT] = false;
    this.input[key] = true;
};

Snake.prototype.update = function (delta) {
    if (this.readyToGrow) {
        this.pieces.push({x: -10, y: -10});
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

Snake.prototype.checkCollision = function(){
    var collide = this.pieces.some(function(piece, i){
        return i > 0 && piece.x === this.head.x && piece.y === this.head.y;
    }, this);

    if (collide) {
        this.emit(Snake.events.COLLISION, {id: this.id, point: this.head});
    }
};

Snake.prototype.grow = function() {
    this.readyToGrow = true;
    this.emit(Snake.events.POWER_UP, {id: this.id, size: this.pieces.length});
};

Snake.prototype.isSyncd = function(){
    return this.inSync;
};

Snake.prototype.interpolate = function(currFrame, src, dest, totalFrames) {
    var t = currFrame / totalFrames;

    return (1 - t) * src + dest * 5;
};

Snake.prototype.sync = function(serverState) {
    var diffX = serverState.head.x - this.head.x;
    var diffY = serverState.head.y - this.head.y;

    if (diffX === 0 && diffY === 0) {
        this.inSync = true;
        return true;
    }

    this.inSync = false;

    // Teleport to new position if:
    //   - Off by one in one of the axis
    //   - Off by one in both axes, but only one unit from the neck
    if ((diffX === 0 && diffY === 1) ||
        (diffX === 1 && diffY === 0) ||
        (this.pieces[0].x === serverState.head.x && diffY === 1) ||
        (this.pieces[0].y === serverState.head.y && diffX === 1)) {

        this.head.x = serverState.head.x;
        this.head.y = serverState.head.y;

        this.inSync = true;
        return true;
    }

    // Interpolate towards correct point until close enough to teleport
    if (serverState.currFrame < this.interpMaxFrames) {
        this.head.x = this.interpolate(serverState.currFrame, this.head.x, serverState.head.x, this.interpMaxFrames);
        this.head.y = this.interpolate(serverState.currFrame, this.head.y, serverState.head.y, this.interpMaxFrames);
    }

    return false;
};

module.exports = Snake;
