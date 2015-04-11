goog.require('rokko.main');
goog.require('rokko.graphics.Renderer');
goog.require('rokko.scene');
goog.require('rokko.scene.SceneManager');
goog.require('rokko.game');

function main(){
    var WIDTH = 800;
    var HEIGHT = 450;
    var HALF_WIDTH = parseInt(WIDTH / 2, 10);
    var HALF_HEIGHT = parseInt(HEIGHT / 2, 10);

    var renderer = new rokko.graphics.Renderer(WIDTH, HEIGHT);
    var sceneManager = new rokko.scene.SceneManager();

    var splash = new rokko.Scene({
        onLoad: function(){
            document.body.addEventListener('click', function(e){
                sceneManager.setActive('gameOver');
                game.activateScene();
            });
        },
        onRender: function(renderer, frames){
            var ctx = renderer.ctx;

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';

            if (frames % 60 < 35) {
                ctx.font = '2em "Press Start 2P"';
                ctx.fillText('CLICK TO DIE', HALF_WIDTH, HALF_HEIGHT + 50, WIDTH);
            }
            ctx.font = '1em "Press Start 2P"';
            ctx.fillText('(c) RODRIGO SILVEIRA. MEGA MAN (c) CAPCOM 1990, 2004 ', HALF_WIDTH, HEIGHT - 30, WIDTH);
        }
    });

    var gameOver = new rokko.Scene({
        onLoad: function(){
        },
        onRender: function(renderer, frames){
            var ctx = renderer.ctx;

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = '#c00';
            ctx.textAlign = 'center';

            ctx.font = '2em "Press Start 2P"';
            ctx.fillText('GAME OVER!', HALF_WIDTH, HALF_HEIGHT + 50, WIDTH);
        }
    });

    var game = new rokko.Game(renderer, sceneManager);

    sceneManager.add('splash', splash);
    sceneManager.add('gameOver', gameOver);

    sceneManager.setActive('splash');

    renderer.bindTo(document.body);
    game.activateScene();
}
