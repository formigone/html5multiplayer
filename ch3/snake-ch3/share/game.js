var tick = (function(){
    var now = 0;
    var timer = (typeof requestAnimationFrame === 'undefined') ? function(cb, timeout){ setTimeout(function(){ cb(++now); }, timeout); } : requestAnimationFrame;
    return function(cb, timeout){
        return timer(cb, timeout);
    }
}());

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
    this.raf = tick(this.loop.bind(this), this.fps);

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
