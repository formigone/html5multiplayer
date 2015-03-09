var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();
var gameEvents = require('./share/events.js');
var game = require('./server/app.js');

var routes = require('./routes/index');

var app = express();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(socket){
//    console.log('new client');

    socket.on(gameEvents.server_newRoom, function(data){
        console.log('Message in: ', gameEvents.server_newRoom, data);
        var roomId = game.newRoom(data.maxWidth, data.maxHeight);
        game.joinRoom(roomId, this, data.id, data.x, data.y, data.color);
    });

    socket.on(gameEvents.server_joinRoom, function(data){
        console.log('Message in: ', gameEvents.server_joinRoom, data);
        game.joinRoom(data.roomId, this, data.playerId, data.playerX, data.playerY, data.playerColor);
    });

    socket.on(gameEvents.server_listRooms, function(){
//        console.log('Message in: ', gameEvents.server_listRooms);
        var rooms = game.listRooms();
        socket.emit(gameEvents.client_roomsList, rooms);
    });

    socket.on(gameEvents.server_startRoom, function(data){
//        console.log('Message in: ', gameEvents.server_startRoom, data);
        game.startRoom(data.roomId);
    });

    socket.on(gameEvents.server_spawnFruit, function(data){
//        console.log('Message in: ', gameEvents.server_spawnFruit, data);
        var pos = game.spawnFruit(data.roomId, data.maxWidth, data.maxHeight);
        socket.emit(gameEvents.client_newFruit, pos);
    });

    socket.on(gameEvents.server_setPlayerKey, function(data){
//        console.log('Message in: ', gameEvents.server_setPlayerKey, data);
        game.setPlayerKey(data.roomId, data.playerId, data.keyCode);
    })
});

module.exports = app;
