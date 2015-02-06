var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 2667});

wss.on('connection', function connection(ws){

    ws.on('message', function incoming(msg){
        console.log('Incoming: %s', msg);
        ws.send('yo yo yo');
    });
});