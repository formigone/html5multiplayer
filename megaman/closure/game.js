goog.provide('rokko.main');

goog.require('rokko.graphics.Renderer');
goog.require('rokko.scene');
goog.require('rokko.scene.SceneManager');
goog.require('rokko.game');

//goog.require('goog.dom.fullscreen');

rokko.main = function(){
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
                ctx.fillText('CLICK TO DIE', HALF_WIDTH, HALF_HEIGHT, WIDTH);
            }
            ctx.font = '0.8em "Press Start 2P"';
            ctx.fillText('(c) RODRIGO SILVEIRA. MEGA MAN (c) CAPCOM 1990, 2004 ', HALF_WIDTH, HEIGHT - 30, WIDTH);
        }
    });

    var gameOver = new rokko.Scene({
        props: {
            text: {y: HALF_HEIGHT + 50, i: 0},
            img: new Image(),
            frames: [
                {x: 13, y: 13, w: 37, h: 53},
                {x: 230, y: 13, w: 32, h: 52},
                {x: 274, y: 13, w: 32, h: 52},
                {x: 316, y: 13, w: 32, h: 52},
                {x: 355, y: 13, w: 38, h: 52},
                {x: 404, y: 13, w: 32, h: 52},
                {x: 440, y: 13, w: 32, h: 52},
                {x: 480, y: 13, w: 32, h: 52},
                {x: 517, y: 13, w: 38, h: 52},
                {x: 517, y: 13, w: 34, h: 52},
                {x: 561, y: 13, w: 37, h: 52},
                {x: 609, y: 13, w: 34, h: 52}
            ],
            currFrame: 0,
            mm: {x: HALF_WIDTH, y: HEIGHT - 200, dx: 0.15}
        },
        onLoad: function(){
            this.props.img.src = '/img/powerup.png';
        },
        onUpdate: function(dt, frames){
            var text = this.props.text;
            text.y = (Math.sin(text.i) * 30) + 10;
            text.i += 0.05;
            text.y += 200;

            this.props.mm.x += this.props.mm.dx * dt;
            if (this.props.mm.x > WIDTH) {
                this.props.mm.x = -32;
            }
        },
        onRender: function(renderer, frames){
            var ctx = renderer.ctx;
            var anim = this.props.frames;
            var frame = anim[this.props.currFrame];

            if (frames % 3 === 0) {
                this.props.currFrame += 1;
                if (this.props.currFrame >= anim.length) {
                    this.props.currFrame = 1;
                }
            }

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = '#c00';
            ctx.textAlign = 'center';

            ctx.font = '2em "Press Start 2P"';
            ctx.fillText('GAME OVER!', HALF_WIDTH, this.props.text.y, WIDTH);

            ctx.drawImage(this.props.img, frame.x, frame.y, frame.w, frame.h, this.props.mm.x, HEIGHT - 200, frame.w,frame.h);
        }
    });

    var game = new rokko.Game(renderer, sceneManager);

    sceneManager.add('splash', splash);
    sceneManager.add('gameOver', gameOver);

    sceneManager.setActive('splash');

    renderer.bindTo(document.body);
    //document.body.addEventListener('keydown', function(){
    //    goog.dom.fullscreen.requestFullScreen(renderer.canvas);
        game.activateScene();
    //});
};

goog.exportSymbol('rokko.play', rokko.main);
