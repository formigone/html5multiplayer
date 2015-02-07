var WebSocketServer = require('ws').Server;
var Board = require('./BoardServer');
var Player = require('./Player');

var PORT = 2667;
var wss = new WebSocketServer({port: PORT});
var board = new Board();

var events = {
    incoming: {
        JOIN_GAME: 'csJoinGame',
        MARK: 'csMark',
        QUIT: 'csQuit'
    },
    outgoing: {
        JOIN_GAME: 'scJoinGame',
        MARK: 'scMark',
        SET_TURN: 'scSetTurn',
        OPPONENT_READY: 'scOpponentReady',
        GAME_OVER: 'scGameOver',
        ERROR: 'scError',
        QUIT: 'scQuit'
    }
};

/**
 *
 * @param action
 * @param data
 * @returns {*}
 */
function makeMessage(action, data) {
    var resp = {
        action: action,
        data: data
    };

    return JSON.stringify(resp);
}

wss.on('connection', function connection(ws) {
    board.on(Board.events.PLAYER_CONNECTED, function(player) {
        wss.clients.forEach(function(client) {
            board.players.forEach(function(player) {
                client.send(makeMessage(events.outgoing.JOIN_GAME, player));
            });
        });
    });

    board.on(Board.events.GAME_READY, function(player) {
        wss.clients.forEach(function(client) {
            client.send(makeMessage(events.outgoing.SET_TURN, player));
        });
    });

    board.on(Board.events.CELL_MARKED, function(event) {
        wss.clients.forEach(function(client) {
            client.send(makeMessage(events.outgoing.MARK, event));
        });
    });

    board.on(Board.events.CHANGE_TURN, function(player) {
        wss.clients.forEach(function(client) {
            client.send(makeMessage(events.outgoing.SET_TURN, player));
        });
    });

    board.on(Board.events.WINNER, function(event) {
        wss.clients.forEach(function(client) {
            client.send(makeMessage(events.outgoing.GAME_OVER, event));
        });
    });

    board.on(Board.events.DRAW, function(event) {
        wss.clients.forEach(function(client) {
            client.send(makeMessage(events.outgoing.GAME_OVER, event));
        });
    });

    ws.on('message', function incoming(msg) {
        try {
            var msg = JSON.parse(msg);
        } catch (error) {
            ws.send(makeMessage(events.outgoing.ERROR, 'Invalid action'));
            return;
        }

        try {
            switch (msg.action) {
                case events.incoming.JOIN_GAME:
                    var player = new Player(board.players.length + 1, board.players.length === 0 ? 'X' : 'O', msg.data);
                    board.addPlayer(player);

                    break;
                case events.incoming.MARK:
                    if (board.checkTurn(msg.data.playerId)) {
                        var player = board.players.filter(function(player){
                            return player.id == msg.data.playerId;
                        }).pop();

                        board.mark(msg.data.cellId);
                    }

                    break;

                case events.incoming.QUIT:
                    board = new Board();
                    wss.clients.forEach(function(client){
                        client.send(makeMessage(events.outgoing.QUIT, {}));
                    });

                    break;
            }
        } catch (error) {
            ws.send(makeMessage(events.outgoing.ERROR, error.message));
        }
    });
});

console.log('Listening on port %d', PORT);
