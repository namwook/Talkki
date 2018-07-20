#!/usr/bin/env node
/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('nwtalkki:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.app.set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app.app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const io = require('socket.io')(server);

io.on('connection', (socket => {
    io.to('a new user has joined the room');
    socket.on('set nickname', function (name) {
        socket.id = name;
        io.emit('set nickname', name);
    });

    socket.on('chat message', function (msg) {
        console.log(`socket.on chat the msg on server side.`);
        io.emit('chat message', {msg: msg, id: socket.id});
    });

    // TODO: Add “{user} is typing” functionality
    // 1. client 에서 input value 가 ''가 아니면 emit 하고,
    // 2. server 에서는 emit event handling 해서
    socket.on('showKeyStatus', function (msg) {
        // 2-1. 각 사용자에게 입력 중 이라는 메세지 띄우기
        // 2-2. *메세지를 쓰고 있는 사용자는 메세지 받으면 안된다. -> Using socket.broadcast.emit method!!
        console.log('server: showKeyStatus::', msg);
        socket.broadcast.emit('showKeyStatus', { data: msg });
    });


    // TODO: Show who’s online

    // TODO: Add private messaging
    socket.on('say to someone', (id, msg) => {
        // send a private message to the socket with the given id
        socket.to(id).emit('my message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected at server side.`);
    });

    // setTimeout(() => socket.disconnect(true), 1000000);
}));

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

