//var socket = new WebSocket('ws://localhost:2667');
var container = document.querySelector('#gameBoard');
var scoreBoard = [
    document.querySelector('#p1Score'),
    document.querySelector('#p2Score')
];


/**
 *
 * @constructor
 */
var Board = function(scoreBoard){
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
Board.prototype.init = function(){
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

/**
 *
 * @param event
 */
Board.prototype.mark = function(event){
    var target = event.target;

    if (this.ready && target.getAttribute('marked') === 'false') {
        target.textContent = this.players[this.currentTurn].label;
        target.classList.add('notActive');

        this.currentTurn = (this.currentTurn + 1) % 2;
        this.highlightScoreboard();
    }
};

/**
 *
 */
Board.prototype.highlightScoreboard = function(){
    this.scoreBoard.forEach(function(score){
        score.classList.remove('active');
    });

    this.scoreBoard[this.currentTurn].classList.add('active');
};

Board.prototype.checkWinner = function(){
    
};

/**
 *
 * @param player
 */
Board.prototype.addPlayer = function(player){
    if (this.players.length < 2) {
        var isNew = this.players.filter(function(p){
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
                this.cells.forEach(function(cell){
                    cell.classList.remove('notActive');
                });

                this.highlightScoreboard();
            }
        }
    }
};

/**
 *
 * @param id
 * @param label
 * @param name
 * @constructor
 */
var Player = function(id, label, name){
    this.id = id;
    this.label = label;
    this.name = name;
};

var board = new Board(scoreBoard);
board.bindTo(container);

var p1 = new Player(1, 'X', 'Rodrigo');
var p2 = new Player(2, 'O', 'Mara');

setTimeout(function(){
    board.addPlayer(p1);
}, 500);

setTimeout(function(){
    board.addPlayer(p2);
}, 800);


/*

var btn = document.createElement('button');
btn.textContent = 'Click';
btn.disabled = true;
btn.addEventListener('click', function(event){
    sendMsg('hello ' + Math.random() * 9999);
});

var sendMsg = function(msg){
    socket.send(msg);
};

container.appendChild(btn);

socket.onopen = function(event){
    btn.disabled = false;
};

socket.onmessage = function(event){
    var e = document.createElement('p');
    e.textContent = event.data;
    console.log(event);

    container.appendChild(e);
};
*/
