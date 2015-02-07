var socket = new WebSocket('ws://localhost:2667');
var events = {
    outgoing: {
        JOIN_GAME: 'csJoinGame',
        MARK: 'csMark',
        QUIT: 'csQuit'
    },
    incoming: {
        JOIN_GAME: 'scJoinGame',
        MARK: 'scMark',
        SET_TURN: 'scSetTurn',
        OPPONENT_READY: 'scOpponentReady',
        GAME_OVER: 'scGameOver',
        ERROR: 'scError',
        QUIT: 'scQuit'
    }
};

var container = document.querySelector('#gameBoard');
var startBtn = document.querySelector('#startBtn');
var nameInput = document.querySelector('#nickname');

var scoreBoard = [
    document.querySelector('#p1Score'),
    document.querySelector('#p2Score')
];

var hero = {};
var board = new Board(scoreBoard);

startBtn.setAttribute('disabled', true);
nameInput.setAttribute('disabled', true);
nameInput.setAttribute('placeholder', 'Loading...');

/**
 *
 * @param action
 * @param data
 * @returns {*}
 */
function makeMessage(action, data){
    var resp = {
        action: action,
        data: data
    };

    return JSON.stringify(resp);
}

/**
 *
 * @param cellId
 */
board.onMark = function(cellId){
    socket.send(makeMessage(events.outgoing.MARK, {playerId: hero.id, cellId: cellId}));
};

/**
 *
 */
function start() {
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }

    if (board.players.length === 1) {
        scoreBoard[1].textContent = 'waiting...';
    }

    board.bindTo(container);
}

startBtn.addEventListener('click', function(event) {
    var name = nameInput.value.trim();

    if (name.length > 0) {
        hero.name = name;
        socket.send(makeMessage(events.outgoing.JOIN_GAME, name));
    }
});

socket.onmessage = function(event){
    var msg = JSON.parse(event.data);

    switch (msg.action) {
        case events.incoming.ERROR:
            alert('Error: ' + msg.data);
            break;
        case events.incoming.JOIN_GAME:
            board.addPlayer(msg.data);
            if (msg.data.name === hero.name) {
                hero = msg.data;
                start();
            }

            break;
        case events.incoming.SET_TURN:
            board.highlightScoreboard(msg.data.id);
            board.ready = true;
            if (msg.data.id === hero.id) {
                board.enableTurn();
            }

            break;
        case events.incoming.MARK:
            board.doMark(msg.data.cellId, msg.data.player.label);

            break;

        case events.incoming.GAME_OVER:
            if (msg.data.player) {
                board.doWinner(msg.data.pos);
            } else {
                board.doDraw();
            }

            socket.send(makeMessage(events.outgoing.QUIT, hero.id));

            break;

        case events.incoming.QUIT:
            socket.close();

            break;
    }
};

socket.onopen = function(event) {
    startBtn.removeAttribute('disabled');
    nameInput.removeAttribute('disabled');
    nameInput.removeAttribute('placeholder');
    nameInput.focus();
};
