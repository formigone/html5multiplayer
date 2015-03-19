var Renderer = require('./renderer.js');
var Game = require('./game.js');
var Snake = require('./snake.js');
var Fruit = require('./fruit.js');
var keys = require('./keyboard.js');
var socket = require('socket.io-client')(window.location.origin);
var gameEvents = require('./events.js');

var BLOCK_WIDTH = 16;
var BLOCK_HEIGHT = 16;
var FPS = 20;
var renderer = new Renderer(0, 0, document.getElementById('gameCanvas'));
var game = new Game(FPS);
//var fruitDelay = 1500;
//var lastFruit = 0;
//var fruitDelta = 0;
var roomId = 0;
var playerAColor = '#0c0';
var playerBColor = '#cc7400';

/** @type {Snake} */
var player = new Snake(parseInt(Math.random() * 999999, 10), parseInt(Math.random() * window.innerWidth / 1.5, 10), parseInt(Math.random() * window.innerHeight / 1.5, 10), playerAColor, BLOCK_WIDTH, BLOCK_HEIGHT);
var otherPlayers = [];
var fruits = [];
var ctx = renderer.ctx;
var scoreWidget = document.querySelector('#scoreA span');
var gameOver = document.getElementById('gameOver');
var screens = {
    main: document.getElementById('main'),
    lobby: document.getElementById('lobby')
};

var roomList = document.getElementById('roomList');
var inputTimer = 0;
var inputTimeoutPeriod = 100;

var serverState = {};

game.onUpdate = function (delta) {
    if (serverState.id) {
        player.sync(serverState);

        if (player.isSyncd()) {
            serverState = {};
        }
    } else {
        player.update(delta);
        player.checkCollision();

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
            }
        }
    }
};

game.onRender = function () {
    ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

    ctx.fillStyle = player.color;
    player.pieces.forEach(function (piece) {
        ctx.fillRect(piece.x * player.width, piece.y * player.height, player.width, player.height);
    });

    fruits.forEach(function (fruit) {
        ctx.fillStyle = fruit.color;
        ctx.fillRect(fruit.x * fruit.width, fruit.y * fruit.height, fruit.width, fruit.height);
    });

    otherPlayers.map(function(player){
        ctx.fillStyle = player.color;
        player.pieces.forEach(function (piece) {
            ctx.fillRect(piece.x * player.width, piece.y * player.height, player.width, player.height);
        });
    });
};

player.on(Snake.events.POWER_UP, function (event) {
    var score = event.size * 10;
    scoreWidget.textContent = '000000'.slice(0, -(score + '').length) + score + '';
});

player.on(Snake.events.COLLISION, function (event) {
    scoreWidget.parentElement.classList.add('gameOver');

    game.stop();
    setTimeout(function () {
        ctx.fillStyle = '#f00';
        ctx.fillRect(event.point.x * player.width, event.point.y * player.height, player.width, player.height);
    }, 0);

    setTimeout(function () {
        gameOver.classList.remove('hidden');
    }, 100);
});

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
            if (inputTimer === 0) {
                inputTimer = setTimeout(function(){
                    console.log('update server with new player state');
                    socket.emit(gameEvents.server_setPlayerKey, {
                            roomId: roomId,
                            playerId: player.id,
                            keyCode: key
                        }
                    );
                }, inputTimeoutPeriod);
            } else {
                clearTimeout(inputTimer);
                inputTimer = 0;
            }
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

socket.on('connect', function () {
    socket.emit(gameEvents.server_listRooms);
});

socket.on(gameEvents.client_roomsList, function (rooms) {
    console.log(gameEvents.client_roomsList, rooms);
    rooms.map(function (room) {
        var roomWidget = document.createElement('div');
        roomWidget.textContent = room.players.length + ' player' + (room.players.length > 1 ? 's' : '');
        roomWidget.addEventListener('click', function () {
                player.color = playerBColor;
            socket.emit(gameEvents.server_joinRoom, {
                    roomId: room.roomId,
                    playerId: player.id,
                    playerX: player.head.x,
                    playerY: player.head.y,
                    playerColor: player.color
                }
            );
        });
        roomList.appendChild(roomWidget);
    });

    var roomWidget = document.createElement('div');
    roomWidget.classList.add('newRoomWidget');
    roomWidget.textContent = 'New Game';
    roomWidget.addEventListener('click', function () {
        socket.emit(gameEvents.server_newRoom, {
            id: player.id,
            x: player.head.x,
            y: player.head.y,
            color: player.color,
            maxWidth: window.innerWidth,
            maxHeight: window.innerHeight
        });
    });
    roomList.appendChild(roomWidget);
});

socket.on(gameEvents.client_roomJoined, function (data) {
    console.log(gameEvents.client_roomJoined, data);
    roomId = data.roomId;
    screens.lobby.classList.add('hidden');
    screens.main.classList.remove('hidden');
    socket.emit(gameEvents.server_startRoom, {
        roomId: roomId
    });
    game.start();
});

socket.on(gameEvents.client_playerState, function(data){
//    console.log(gameEvents.client_playerState, data);
    otherPlayers = data.filter(function(_player){
        if (_player.id == player.id) {
            serverState = _player;
            serverState.currFrame = 0;
            return false;
        }

        _player.width = BLOCK_WIDTH;
        _player.height = BLOCK_HEIGHT;
        _player.head.x = parseInt(_player.head.x / BLOCK_WIDTH, 10);
        _player.head.y = parseInt(_player.head.y / BLOCK_HEIGHT, 10);
        _player.pieces = _player.pieces.map(function(piece){
            piece.x = parseInt(piece.x / BLOCK_WIDTH, 10);
            piece.y = parseInt(piece.y / BLOCK_HEIGHT, 10);
            return piece;
        });

        return true;
    });
});

socket.on(gameEvents.client_newFruit, function (fruit) {
    console.log(gameEvents.client_newFruit, fruit);
    fruits[0] = new Fruit(parseInt(fruit.x / BLOCK_WIDTH / BLOCK_WIDTH, 10), parseInt(fruit.y / BLOCK_HEIGHT / BLOCK_HEIGHT, 10), '#c00', BLOCK_WIDTH, BLOCK_HEIGHT);
});
