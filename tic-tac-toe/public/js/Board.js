/**
 *
 * @constructor
 */
var Board = function(scoreBoard) {
    this.cells = [];
    this.dom = document.createElement('table');
    this.dom.addEventListener('click', this.mark.bind(this));
    this.players = [];
    this.currentTurn = 0;
    this.ready = false;

    this.scoreBoard = scoreBoard;

    this.init();
};

/**
 *
 */
Board.prototype.init = function() {
    var row = document.createElement('tr');
    var rowCol = document.createElement('td');
    var col = document.createElement('td');
    var cell = document.createElement('td');

    rowCol.classList.add('boardRow');
    rowCol.classList.add('bgWhite');
    rowCol.setAttribute('colspan', 5);
    row.appendChild(rowCol);

    col.classList.add('boardCol');
    col.classList.add('bgWhite');

    cell.classList.add('gameCell');
    cell.classList.add('notActive');
    cell.setAttribute('marked', 'false');

    this.dom.classList.add('gameBoard');

    for (var i = 0; i < 9; i++) {
        this.cells.push(cell.cloneNode(true));
    }

    for (var r, i = 0; i < 9; i += 3) {
        r = row.cloneNode(false);
        r.appendChild(this.cells[i]);
        r.appendChild(col.cloneNode(false));
        r.appendChild(this.cells[i + 1]);
        r.appendChild(col.cloneNode(false));
        r.appendChild(this.cells[i + 2]);

        this.dom.appendChild(r);

        if (i < 6) {
            this.dom.appendChild(row.cloneNode(true));
        }
    }
};

/**
 *
 * @param container
 */
Board.prototype.bindTo = function(container) {
    container.appendChild(this.dom);
};

Board.prototype.disableAll = function() {
    this.cells.forEach(function(cell) {
        cell.classList.add('notActive');
    });
};

Board.prototype.enableAll = function() {
    this.cells.forEach(function(cell) {
        cell.classList.remove('notActive');
        cell.setAttribute('marked', 'false');
    });
};

Board.prototype.highlightCells = function(pos) {
    var cells = this.cells;
    pos.forEach(function(i) {
        cells[i].classList.add('colorRed');
    });

    cells.forEach(function(cell) {
        cell.setAttribute('marked', 'true');
    });
};

Board.prototype.lowlightCells = function() {
    var cells = this.cells;
    cells.forEach(function(cell) {
        cell.classList.add('colorWhite');
    });
};

/**
 *
 * @param event
 */
Board.prototype.mark = function(event) {
    var target = event.target;

    if (this.ready && target.getAttribute('marked') === 'false') {
        target.textContent = this.players[this.currentTurn].label;
        target.classList.add('notActive');
        target.setAttribute('marked', 'true');

        var res = this.checkWinner();
        if (res.win) {
            this.disableAll();
            this.highlightCells(res.pos);
        } else if (this.checkDraw()) {
            this.lowlightCells();
        } else {
            this.currentTurn = (this.currentTurn + 1) % 2;
            this.highlightScoreboard();
        }
    }
};

/**
 *
 */
Board.prototype.highlightScoreboard = function() {
    this.scoreBoard.forEach(function(score) {
        score.classList.remove('active');
    });

    this.scoreBoard[this.currentTurn].classList.add('active');
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
        if (this.cells[win[0]].textContent === player.label) {
            var res = this.cells[win[0]].textContent === this.cells[win[1]].textContent && this.cells[win[1]].textContent === this.cells[win[2]].textContent;

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
        return cell.textContent === this.players[0].label || cell.textContent === this.players[1].label;
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

            if (this.players.length === 1) {
                this.scoreBoard[this.players.length - 1].textContent = player.label + ' ' + player.name;
            } else {
                this.scoreBoard[this.players.length - 1].textContent = player.name + ' ' + player.label;
            }

            this.ready = this.players.length === 2;

            if (this.ready) {
                this.enableAll();
                this.highlightScoreboard();
            }
        }
    }
};
