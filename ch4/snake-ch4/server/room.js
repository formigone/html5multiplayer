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
var gameUpdateRate = 1;
var gameUpdates = 0;

var fruitDelay = 1500;
var lastFruit = 0;
var fruitDelta = 0;

var Room = function (fps, worldWidth, worldHeight) {
    console.log('Room::construct', [worldWidth, worldHeight]);
    var self = this;
    this.players = players;
    game = new Game(fps);

    game.onUpdate = function (delta) {
        var now = process.hrtime()[1];
        if (fruits.length < 1) {
            fruitDelta = now - lastFruit;

            if (fruitDelta >= fruitDelay) {
//                socket.emit(gameEvents.server_spawnFruit, {
//                    roomId: roomId,
//                    maxWidth: parseInt(renderer.canvas.width / BLOCK_WIDTH / 2, 10),
//                    maxHeight: parseInt(renderer.canvas.width / BLOCK_HEIGHT / 2, 10)
//                });
                var pos = {
                    x: parseInt(Math.random() * worldWidth, 10),
                    y: parseInt(Math.random() * worldHeight, 10)
                };

                self.addFruit(pos);
                players.map(function(player){
                    player.socket.emit(gameEvents.client_newFruit, pos);
                });
            }
        }

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

        if (++gameUpdates % gameUpdateRate === 0) {
            gameUpdates = 0;
            var data = players.map(function(player){
                return player.snake;
            });
            players.map(function(player){
                player.socket.emit(gameEvents.client_playerState, data);
            });
            lastFruit = now;
        }
    };
};

Room.prototype.start = function () {
    console.log('Room::start');
    game.start();
};

Room.prototype.addFruit = function (pos) {
    fruits[0] = new Fruit(parseInt(pos.x / 16, 10), parseInt(pos.y / 16, 10), fruitColor, 1, 1);
};

Room.prototype.join = function (snake, socket) {
    if (players.indexOf(snake.id) < 0) {
        players.push({
            snake: snake,
            socket: socket
        });
    }
};

Room.prototype.getPlayers = function(){
    return players;
};

module.exports = Room;
