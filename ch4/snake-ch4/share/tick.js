var tick = function (delay) {
    var _delay = delay;
    var timer;

    if (typeof requestAnimationFrame === 'undefined') {
        timer = function (cb) {
            setImmediate(function () {
                cb(_delay);
            }, _delay);
        }
    } else {
        timer = window.requestAnimationFrame;
    }

    return function (cb) {
        return timer(cb);
    }
};

module.exports = tick;