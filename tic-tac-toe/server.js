var WebSocketServer = require('ws').Server;
var Board = require('./BoardServer');
var Player = require('./Player');

var PORT = 2667;
var wss = new WebSocketServer({port: PORT});
var board = new Board();

var players = [];
var events = {
    incoming: {
        JOIN_GAME: 'inJoinGame',
        MARK: 'inMark'
    },
    outgoing: {
        JOIN_GAME: 'outJoinGame',
        MARK: 'outMark',
        GAME_READY: 'outGameReady',
        OPPONENT_READY: 'outOpponentReady',
        GAME_OVER: 'outGameOver',
        ERROR: 'outError'
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
    ws.on('message', function incoming(msg) {
        try {
            var msg = JSON.parse(msg);
        } catch (error) {
            ws.send(makeMessage(events.outgoing.ERROR, 'Invalid action'));
        }

        try {
            switch (msg.action) {
                case events.incoming.JOIN_GAME:
                    if (players.length < 2) {
                        var player = new Player(players.length + 1, players.length === 0 ? 'X' : 'O', msg.data);
                        players.push(player);
                        board.addPlayer(player);

                        console.log('New player', player);
                        console.log('Total players', players.length);
                        ws.send(makeMessage(events.outgoing.JOIN_GAME, player));

                        wss.clients.forEach(function(client) {
                            players.forEach(function(player) {
                                client.send(makeMessage(events.outgoing.JOIN_GAME, player));
                            });
                        });
                    } else {
                        throw new Error('Too many players');
                    }

                    break;
            }
        } catch (error) {
            console.log('Error:', error.message);
            ws.send(makeMessage(events.outgoing.ERROR, error.message));
        }
    });
});

console.log('Listening on port %d', PORT);
