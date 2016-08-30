'use strict';

// Specify port
const port = 3001;

// Import Express
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Import Socket.io
const io = require('socket.io')(http);

// Serve the app directory and Bower scripts
app.use('/', express.static(__dirname + '/app'));
app.use('/lib', express.static(__dirname + '/bower_components'));

// Listen for user connections
io.on('connection', (socket) => {
    let userIp = socket.handshake.address;
    if (userIp === '127.0.0.1' || userIp === '::1') {
        userIp = 'this machine';
    }
    console.log('A user connected from ' + userIp);
    io.emit('infoMessage', 'A user has joined the chat.');
    socket.on('disconnect', () => {
        console.log('A user disconnected from ' + userIp);
        io.emit('infoMessage', 'A user has left the chat.');
    });
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
    socket.on('typing', () => {
        io.emit('typing');
    });
    socket.on('messageClear', () => {
        io.emit('messageClear');
    });
});

// Listen on port 3001 - note that we need to use http.listen rather than Express's app.listen here for Socket.io to work
http.listen(port, () => {
    console.log('Listening on port ' + port + '.');
    console.log('Go to http://localhost:' + port + ' to view.');
});
