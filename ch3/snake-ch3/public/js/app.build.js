(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Renderer = require('./renderer.js');
var Game = require('./game.js');
var Snake = require('./snake.js');
var Fruit = require('./fruit.js');
var keys = require('./keyboard.js');

var BLOCK_WIDTH = 16;
var BLOCK_HEIGHT = 16;
var FPS = 10;
var renderer = new Renderer(0, 0, document.getElementById('gameCanvas'));
var game = new Game(FPS);
var fruitDelay = 1500;
var lastFruit = 0;
var fruitDelta = 0;

var player = new Snake(10, 10, '#0c0', BLOCK_WIDTH, BLOCK_HEIGHT);
var fruits = [];
var ctx = renderer.ctx;

game.onUpdate = function (delta) {
    var now = performance.now();

    if (fruits.length < 1) {
        fruitDelta = now - lastFruit;
        console.log(delta, fruitDelta);
        if (fruitDelta >= fruitDelay) {
            // TODO: spawn fruit where we know there's no snakes on
            fruits[0] = new Fruit(parseInt(Math.random() * renderer.canvas.width / BLOCK_WIDTH / 2, 10) + 5, parseInt(Math.random() * renderer.canvas.width / BLOCK_HEIGHT / 2, 10) + 5, '#c00', BLOCK_WIDTH, BLOCK_HEIGHT);
        }
    }

    player.update(delta);

    if (player.head.x < 0) {
        player.head.x = parseInt(renderer.canvas.width / player.width, 10);
    }

    if (player.head.x > parseInt(renderer.canvas.width / player.width, 10)) {
        player.head.x = 0;
    }

    if (player.head.y < 0) {
        player.head.y = parseInt(renderer.canvas.height / player.height, 10);
    }

    if (player.head.y > parseInt(renderer.canvas.height / player.height, 10)) {
        player.head.y = 0;
    }

    if (fruits.length > 0) {
        if (player.head.x === fruits[0].x && player.head.y === fruits[0].y) {
            fruits = [];
            player.grow();
            lastFruit = now;
        }
    }
};

game.onRender = function () {
    ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

    ctx.fillStyle = player.color;
    player.pieces.forEach(function(piece){
        ctx.fillRect(piece.x * player.width, piece.y * player.height, player.width, player.height);
    });

    fruits.forEach(function(fruit){
        ctx.fillStyle = fruit.color;
        ctx.fillRect(fruit.x * fruit.width, fruit.y * fruit.height, fruit.width, fruit.height);
    });
};

document.body.addEventListener('keydown', function (e) {
    var key = e.keyCode;

    switch (key) {
        case keys.ESC:
            game.stop();
            break;
        case keys.SPACEBAR:
            game.start();
            break;
        case keys.LEFT:
        case keys.RIGHT:
        case keys.UP:
        case keys.DOWN:
            player.setKey(key);
            break;
        case keys.D:
            console.log(player.pieces);
            break;
    }
});

function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

    renderer.canvas.width = newWidth;
    renderer.canvas.height = newHeight;
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
resizeGame();
game.start();

},{"./fruit.js":2,"./game.js":3,"./keyboard.js":4,"./renderer.js":5,"./snake.js":6}],2:[function(require,module,exports){
var Fruit = function (x, y, color_hex, width, height) {
    this.color = color_hex;
    this.x = x;
    this.y = y;
    this.width = width || 16;
    this.height = height || 16;
};

module.exports = Fruit;

},{}],3:[function(require,module,exports){
var Game = function (fps) {
    this.fps = fps;
    this.delay = 1000 / this.fps;
    this.lastTime = 0;
    this.raf = 0;

    this.onUpdate = function (delta) {
    };
    this.onRender = function () {
    };
};

Game.prototype.update = function (delta) {
    this.onUpdate(delta);
};

Game.prototype.render = function () {
    this.onRender();
};

Game.prototype.loop = function (now) {
    this.raf = requestAnimationFrame(this.loop.bind(this));

    var delta = now - this.lastTime;
    if (delta >= this.delay) {
        this.update(delta);
        this.render();
        this.lastTime = now;
    }
};

Game.prototype.start = function () {
    if (this.raf < 1) {
        this.loop(0);
    }
};

Game.prototype.stop = function () {
    if (this.raf > 0) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
    }
};

module.exports = Game;

},{}],4:[function(require,module,exports){
module.exports = {
    ESC: 27,
    SPACEBAR: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    D: 68
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

Snake.prototype.grow = function() {
    this.readyToGrow = true;
};

module.exports = Snake;

},{"./keyboard.js":4}]},{},[1]);
