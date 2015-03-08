var Game = require('./../share/game.js');
var Snake = require('./../share/snake.js');
var Fruit = require('./../share/fruit.js');
var keys = require('./../share/keyboard.js');
var gameEvents = require('./../share/events.js');

var players = [];
var fruits = [];
var fruitColor = '#c00';

/** @type {Game} */
var game = null;

var Room = function (fps, worldWidth, worldHeight) {
    game = new Game(fps);

    game.onUpdate = function (delta) {
        players.map(function (player) {
            player.snake.update(delta);
            player.snake.checkCollision();

            if (player.snake.head.x < 0) {
                player.snake.head.x = worldWidth;
            }

            if (player.snake.head.x > worldWidth) {
                player.snake.head.x = 0;
            }

            if (player.snake.head.y < 0) {
                player.snake.head.y = worldHeight;
            }

            if (player.snake.head.y > worldHeight) {
                player.snake.head.y = 0;
            }

            if (fruits.length > 0) {
                if (player.snake.head.x === fruits[0].x && player.snake.head.y === fruits[0].y) {
                    fruits = [];
                    player.snake.grow();
                }
            }
        });
    };

    this.players = players;
};

Room.prototype.start = function () {
    game.start();
};

Room.prototype.addFruit = function (pos) {
    fruits[0] = new Fruit(pos.x, pos.y, fruitColor, 1, 1);
};

Room.prototype.join = function (snake, socket) {
    if (players.indexOf(snake.id) < 0) {
        players.push({
            snake: snake,
            socket: socket
        });
    }
};

module.exports = Room;
