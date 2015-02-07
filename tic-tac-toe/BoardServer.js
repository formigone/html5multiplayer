var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 *
 * @constructor
 */
var Board = function() {
    this.cells = [];
    this.players = [];
    this.currentTurn = 0;
    this.ready = false;

    this.init();
};

Board.events = {
    PLAYER_CONNECTED: 'playerConnected',
    GAME_READY: 'gameReady',
    CELL_MARKED: 'cellMarked',
    CHANGE_TURN: 'changeTurn',
    WINNER: 'winner',
    DRAW: 'draw'
};

util.inherits(Board, EventEmitter);

/**
 *
 */
Board.prototype.init = function() {
    for (var i = 0; i < 9; i++) {
        this.cells.push({});
    }
};

Board.prototype.disableAll = function() {
    this.cells.forEach(function(cell) {
        cell.active = false;
    });
};

Board.prototype.enableAll = function() {
    this.cells.forEach(function(cell) {
        cell.active = true;
    });
};

/**
 *
 * @param cellId
 */
Board.prototype.mark = function(cellId) {
    var cell = this.cells[cellId];

    if (!cell) {
        return false;
    }

    if (this.ready && cell.active) {
        var player = this.players[this.currentTurn];
        cell.value = player.label;
        cell.active = false;

        this.emit(Board.events.CELL_MARKED, {cellId: cellId, player: player});

        var res = this.checkWinner();
        if (res.win) {
            this.disableAll();
            this.emit(Board.events.WINNER, {player: this.players[this.currentTurn], pos: res.pos});
        } else if (this.checkDraw()) {
            this.emit(Board.events.DRAW, {});
        } else {
            this.currentTurn = (this.currentTurn + 1) % 2;
            this.emit(Board.events.CHANGE_TURN, this.players[this.currentTurn]);
        }
    }
};

/**
 *
 * @param playerId
 * @returns {boolean}
 */
Board.prototype.checkTurn = function(playerId) {
    return this.players[this.currentTurn].id == playerId;
};

/**
 *
 * @returns {{win: boolean, pos: Array}}
 */
Board.prototype.checkWinner = function() {
    var winPosition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [6, 4, 2]
    ];

    var player = this.players[this.currentTurn];
    var pos = [];

    var win = winPosition.some(function(win) {
        if (this.cells[win[0]].value === player.label) {
            var res = this.cells[win[0]].value === this.cells[win[1]].value && this.cells[win[1]].value === this.cells[win[2]].value;

            if (res) {
                pos = win;
                return true;
            }
        }

        return false;
    }, this);

    return {
        win: win,
        pos: pos
    };

};

/**
 *
 * @returns {boolean}
 */
Board.prototype.checkDraw = function() {
    return this.cells.every(function(cell) {
        return cell.value === this.players[0].label || cell.value === this.players[1].label;
    }, this);
};

/**
 *
 * @param player
 */
Board.prototype.addPlayer = function(player) {
    if (this.players.length < 2) {
        var isNew = this.players.filter(function(p) {
            return p.id == player.id;
        }).length === 0;

        if (isNew) {
            this.players.push(player);
            this.ready = this.players.length === 2;
            this.emit(Board.events.PLAYER_CONNECTED, player);

            if (this.ready) {
                this.enableAll();
                this.emit(Board.events.GAME_READY, this.players[0]);
            }
        }
    }
};

module.exports = Board;