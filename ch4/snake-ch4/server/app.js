var Game = require('./../share/game.js');
var Snake = require('./../share/snake.js');
var Fruit = require('./../share/fruit.js');
var keys = require('./../share/keyboard.js');
var gameEvents = require('./../share/events.js');
var Room = require('./room.js');

var BLOCK_WIDTH = 16;
var BLOCK_HEIGHT = 16;
var FPS = 60;

/** @type {Array.<Room>} */
var rooms = [];

module.exports = {
    /**
     *
     * @returns {number} Room index
     */
    newRoom: function(maxWidth, maxHeight){
        var room = new Room(FPS, maxWidth, maxHeight);
        rooms.push(room);
        return rooms.length - 1;
    },

    listRooms: function(){
        return rooms.map(function(room, index) {
            return {
                roomId: index,
                players: room.players.map(function(player){
                    return {
                        id: player.snake.id,
                        x: player.snake.head.x,
                        y: player.snake.head.y,
                        color: player.snake.color
                    };
                })
            };
        });
    },

    joinRoom: function(roomId, socket, playerId, playerX, playerY, playerColor) {
        console.log('Server.App: Joined room', roomId);
        var room = rooms[roomId];
        var snake = new Snake(playerId, playerX, playerY, playerColor, 1, 1);
        room.join(snake, socket);

        socket.emit(gameEvents.client_roomJoined, {roomId: roomId});
    },

    startRoom: function(roomId) {
        console.log('Server.App: Started room', roomId);
        rooms[roomId].start();
    },

    spawnFruit: function(roomId, maxWidth, maxHeight) {
        var pos = {
            x: parseInt(Math.random() * maxWidth, 10),
            y: parseInt(Math.random() * maxHeight, 10)
        };

        rooms[roomId].addFruit(pos);
        return pos;
    },

    setPlayerKey: function(roomId, playerId, keyCode) {
        var players = rooms[roomId].getPlayers();
        var data = players.map(function(player){
            return player.snake;
        });

        players.map(function(player){
            if (player.snake.id == playerId) {
                player.snake.setKey(keyCode);
            }

            player.socket.emit(gameEvents.client_playerState, data);
        });
    }
};
