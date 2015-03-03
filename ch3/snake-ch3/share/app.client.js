var Renderer = require('./renderer.js');
var Game = require('./game.js');
var Snake = require('./snake.js');
var keys = require('./keyboard.js');

var WIDTH = 1600 / 2;
var HEIGHT = 900 / 2;
var FPS = 10;
var renderer = new Renderer(WIDTH, HEIGHT);
var game = new Game(FPS);

var player = new Snake(10, 10, '#0c0');
var ctx = renderer.ctx;

game.onUpdate = function (delta) {
    player.update(delta);
};

game.onRender = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = player.color;

    player.pieces.forEach(function(piece){
        ctx.fillRect(piece.x * player.width, piece.y * player.height, player.width, player.height);
    });
};

renderer.bindTo(document.body);
document.body.addEventListener('keydown', function (e) {
    var key = e.keyCode;

    switch (key) {
        case keys.ESC:
            game.stop();
            break;
        case keys.SPACEBAR:
            game.start();
            player.grow();
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
